var express = require('express');
var router = express.Router();

const authenticationMiddleware = require('../middleware/authentication');

const { sequelize, DataTypes, Op } = require('../models/sequelize');

const Usuario = require('../models/usuarios')(sequelize, DataTypes);
const Tarefa = require('../models/tarefas')(sequelize, DataTypes);

// GET /tarefas[/1]
router.get('/:tarefaId*?', [authenticationMiddleware], function (req, res, next) {
  const titulo = req.query.titulo;
  const concluida = req.query.concluida;
  const idusuario = req.dadosUsuario.id;
  const tarefaId = req.params.tarefaId || req.query.id;

  const where = {};

  if (titulo) {
    where.titulo = {
      [Op.iLike]: `%${titulo}%`
    }
  }

  if (concluida) {
    where.concluida = concluida;
  }

  if (tarefaId) {
    where.id = tarefaId;
  }

  Tarefa.findAll({
    attributes: ['id', 'titulo', 'descricao', 'concluida', 'idusuario'],
    include: [{ 
      association: 'usuario',
      attributes: ['id', 'nome', 'email', 'cpf', 'status'],
      where: {
        id: idusuario
      }
    }],
    where
  })
    .then(function (tarefasBanco) {
      if (!tarefasBanco || !tarefasBanco.length) {
        return res.status(404).send();
      }

      return res.status(200).json(tarefasBanco);
    })
    .catch(function (error) {
      console.error(error);
      res.status(422).send();
    });
});

// POST /tarefas
router.post('/', [authenticationMiddleware], function(req, res, next) {
  const tarefa = req.body;
  const idusuario = req.dadosUsuario.id;

  Tarefa.create({
      titulo: tarefa.titulo,
      descricao: tarefa.descricao,
      concluida: 0,
      idusuario: idusuario
  })
  .then(function(usuarioCriado) {
    res.status(201).json(usuarioCriado);
  })
  .catch(function(error) {
    console.log(error);
    res.status(422).send();
  });
});

// PUT /usuarios
router.put('/:tarefaId', [ authenticationMiddleware ], async function(req, res, next) {
  const tarefaId = req.params.tarefaId
  const body = req.body;
  const idusuario = req.dadosUsuario.id;

  try { 
    const tarefa = await Tarefa.findOne({ where: {
      id: tarefaId,
      idusuario: idusuario
    } });
    
    if (!tarefa || !tarefa.length) {
      return res.status(404).send();
    }

    const tarefaAtualizada = await tarefa.update({
      titulo: body.titulo,
      descricao: body.descricao
    })

    return res.status(200).json(tarefaAtualizada)
  } catch (error) {
    console.error(error);
    res.status(422).send()
  }
});

// DELETE /usuarios/4
router.delete('/:tarefaId', [ authenticationMiddleware ], function(req, res, next) {
  const tarefaId = req.params.tarefaId;
  const idusuario = req.dadosUsuario.id;

  Tarefa.destroy({
    where: {
      id: tarefaId,
      idusuario: idusuario
    }
  })
  .then(function(removidos) {
    if (removidos <= 0) {
      return res.status(404).send();
    }

    res.status(204).send();
  })
  .catch(function(error) {
    console.error(error);
    res.status(422).send();
  })
});

router.use('/:tarefaId/concluida', [ authenticationMiddleware ], async function(req, res, next) {
  if (req.method !== 'PUT' && req.method !== 'DELETE') {
    return next();
  }

  const concluida = req.method === 'PUT' ? 1 : 0;
  const tarefaId = req.params.tarefaId
  const idusuario = req.dadosUsuario.id;

  try {
    const tarefa = await Tarefa.update(
      {
        concluida: concluida,
      },
      { 
        where: {
          id: tarefaId,
          idusuario: idusuario
        }
      }
    );
    
    if (!tarefa || !tarefa[0]) {
      return res.status(404).send();
    }

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(422).send()
  }
});

module.exports = router;
