/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  const Usuario = sequelize.define('usuarios', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    cpf: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    nascimento: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('now')
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('now')
    }
  }, {
      tableName: 'usuarios'
    });

  // Usuario.hasMany(sequelize.models.Tarefa, { foreignKey: 'idusuario', sourceKey: 'id' });
  Usuario.associate = function(models) {
      models.Usuario.hasMany(models.Tarefa, {
        as: 'tarefas',
        foreignKey: 'idusuario',
        sourceKey: 'id'
    })
  };
  
  return Usuario;
};
