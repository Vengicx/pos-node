const { Sequelize, DataTypes, Op } = require('sequelize');

module.exports = {
    DataTypes,
    Op,
    sequelize: new Sequelize(
        process.env.POSTGRES_DB,
        process.env.POSTGRES_USER,
        process.env.POSTGRES_PASSWORD,
        {
            dialect: 'postgres',
            protocol: process.env.POSTGRES_PROTOCOL || 'tcp',
            host: process.env.POSTGRES_HOST || 'db',
            port: process.env.POSTGRES_PORT,
            define: {
                charset: 'utf8',
                dialectOptions: {
                    collate: 'utf8_general_ci'
                },
                timestamps: true 
            },
        }
    ) 
};
