var express = require('express');
var router = express.Router();

const { sequelize, DataTypes } = require('../models/sequelize');

const Usuario = require('../models/usuarios')(sequelize, DataTypes);
const authenticationMiddleware = require('../middleware/authentication');

// GET /usuarios
router.get('/', function(req, res, next) {
  const nome = req.query.nome;
  const email = req.query.email;
  const status = req.query.status;
  const nascimento = req.query.nascimento;
  const cpf = req.query.cpf;

  const where = {};

  if (nome) {
    where.nome = {
      [Op.iLike]: `%${nome}%`
    }
  }

  if (email) {
    where.email = email;
  }

  if (status) {
    where.status = status;
  }

  if (nascimento) {
    where.nascimento = nascimento;
  }

  if (nascimento) {
    where.cpf = cpf;
  }

  Usuario.findAll({
    attributes: ['id', 'nome', 'email', 'cpf', 'status', 'nascimento'],
    where
  })
  .then(function(usuarios) {
    if (!usuarios.length) {
      return res.status(404).send();
    }

    return res.status(200).json(usuarios);
  })
  .catch(function(error) {
    console.error(error);
    res.status(422).send();
  });
});

// POST /usuarios
router.post('/', function(req, res, next) {
  const usuario = req.body;

  const { hash } = require('../helper/hash');

  hash(usuario.senha).then(hashedPassword => {
    return Usuario.create({
      nome: usuario.nome,
      email: usuario.email,
      nascimento: usuario.nascimento,
      cpf: usuario.cpf,
      senha: hashedPassword
    });
  })
  .then(function(usuarioCriado) {
    let json = usuarioCriado.toJSON();
    delete json.senha;
    res.status(201).json(json);
  })
  .catch(function(error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ 'msg': 'Usuário já existe' });
    }

    console.error(error);
    
    res.status(422).send();
  });
});

// PUT /usuarios
router.put('/:usuarioId', [ authenticationMiddleware ], async function(req, res, next) {
  const usuarioId = req.params.usuarioId
  const body = req.body;

  if (req.dadosUsuario.id != usuarioId) {
    return res.status(403).send({ msg: 'Você não tem permissão para acessar este recurso' });
  }

  try { 
    const usuario = await Usuario.findByPk(usuarioId);
    
    if (!usuario) {
      return res.status(404).send();
    }

    const usuarioAtualizado = await usuario.update({
      nome: body.nome,
      email: body.email,
      nascimento: body.nascimento,
      cpf: body.cpf,
    })

    const usuarioJson = usuarioAtualizado.toJSON();
    delete usuarioJson.senha;

    return res.status(200).json(usuarioJson)
  } catch (error) {
    console.error(error);
    res.status(422).send()
  }
});

// POST /usuarios/login
router.post('/login', function(req, res, next) {
  const usuario = req.body;

  const hash = require('../helper/hash');
  const jwt = require('../helper/jwt');

  Usuario.findOne({
    attributes: ['id', 'nome', 'email', 'senha'],
    where: {
      email: usuario.email
    }
  })
  .then(function(usuarioBanco) {
    console.log(usuarioBanco);

    if (!usuarioBanco) {
      return res.status(404).send();
    }

    hash.compare(usuario.senha, usuarioBanco.senha)
    .then((passwordMatch) => {
      if (!passwordMatch) {
        return res.status(401).send();
      }
      
      const usuarioJson = usuarioBanco.toJSON();
      delete usuarioJson.senha;
      const token = jwt.sign(usuarioJson);

      return res.status(200).json({ token });
    })
    .catch(function(error) {
      console.error(error);

      return res.status(401).send();
    });
  })
  .catch(function(error) {
    console.error(error);
    res.status(422).send();
  });
});

// GET /usuarios/4
router.get('/:usuarioId', [ authenticationMiddleware ], function (req, res, next) {
  const usuarioId = req.params.usuarioId

  Usuario.findByPk(usuarioId)
  .then(function (usuario) {
    if (usuario) {
      if (req.dadosUsuario.id != usuarioId) {
        return res.status(403).send({ msg: 'Você não tem permissão para acessar este recurso' });
      }

      const usuarioJson = usuario.toJSON();
      delete usuarioJson.senha;

      res.status(200).json(usuarioJson)
    }else {
      res.status(404).send()
    }
  })
  .catch(function (error) {
    console.log(error)
    res.status(422).send()
  })
});

module.exports = router;
