const path = require("path")
require(path.resolve("./.env"))

module.exports = {
  "development": {
    "username": DATABASE_USERNAME,
    "password": DATABASE_PASSWORD,
    "database": DATABASE_NAME,
    "host": DATABASE_HOST,
    "dialect": DATABASE_DIALECT
  },
  "test": {
    "username": DATABASE_USERNAME,
    "password": DATABASE_PASSWORD,
    "database": DATABASE_NAME,
    "host": DATABASE_HOST,
    "dialect": DATABASE_DIALECT
  },
  "production": {
    "username": DATABASE_USERNAME,
    "password": DATABASE_PASSWORD,
    "database": DATABASE_NAME,
    "host": DATABASE_HOST,
    "dialect": DATABASE_DIALECT
  }
}