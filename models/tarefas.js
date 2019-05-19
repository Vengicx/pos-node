/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Tarefa = sequelize.define('tarefas', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: false
    },
    concluida: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    idusuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      }
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
    tableName: 'tarefas'
  });

  Tarefa.belongsTo(sequelize.models.usuarios, { as: 'usuario', foreignKey: 'idusuario' });

  return Tarefa;
};
