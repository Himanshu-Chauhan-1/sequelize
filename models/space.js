'use strict';

let allModels
const { Model, Op } = require('sequelize');
const spaceType = ['Private', 'Public']
module.exports = (sequelize, DataTypes) => {
  class Space extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Space.init({
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    logo: {
      type: DataTypes.TEXT,
    },
    space_type: {
      type: DataTypes.ENUM(spaceType),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    sequelize,
    modelName: 'Space',
    modelName: 'Space',
    tableName: 'spaces',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  });

  Space.registerAllModels = function (models) {
    allModels = models
  }

  // CREATE SPACE METHOD
  Space.createSpace = async function (data) {
    const body = data.body
    const payload = {
      name: body.name,
      space_type: body.type,
      description: body.description,
    }

    const createdSpace = await Space.create(payload)
    return createdSpace
  }

  return Space;
};