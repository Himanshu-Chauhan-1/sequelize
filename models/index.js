'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};
config.logging = false;

let sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.DATABASE_NAME,
    config.DATABASE_USERNAME,
    config.DATABASE_PASSWORD,
    config,
  );
  sequelize.authenticate()
    .then(function () {
      console.log("INFO - Database is connected successfully!");
    })
    .catch(function (err) {
      console.log("ERROR - Unable to connect to the database:", err.message);
    })
}

fs.readdirSync(__dirname).filter(file => {
  return (
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.slice(-3) === '.js' &&
    file.indexOf('.test.js') === -1
  );
}).forEach(file => {
  const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
});

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
  if (db[modelName].registerAllModels) {
    db[modelName].registerAllModels(db);
  }
  if (db[modelName].loadProfiler) {
    db[modelName].loadProfiler();
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
