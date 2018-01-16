// src/instances/sequelize.ts

import * as Sequelize from 'sequelize'

const db = 'pibui';
const username = 'root';
const password = '';

export const sequelize = new Sequelize(db, username, password, {
    dialect: "mysql",
    port: 3306,
    operatorsAliases: false
});

sequelize.authenticate();
