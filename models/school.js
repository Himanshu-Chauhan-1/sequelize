'use strict';
let allModels;
const Op = require('sequelize').Op
const path = require('path')
const { Model } = require('sequelize');
const phaseEnum = ['Secondary', 'Combined']
module.exports = (sequelize, DataTypes) => {
  class School extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // RELATION WITH `users`
      this.belongsToMany(models.User, {
        as: 'users',
        through: 'user_schools',
        foreignKey: 'school_id',
      })

      //RELATION WITH `user school`
      this.hasMany(models.UserSchool, {
        as: "learners",
        foreignKey: "school_id"
      })

      //RELATION WITH `user school`
      this.hasMany(models.UserSchool, {
        as: "learners1",
        foreignKey: "school_id"
      })

      //RELATION WITH `user school`
      this.hasMany(models.UserSchool, {
        as: "teachers",
        foreignKey: "school_id"
      })

    }
  }
  School.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize.literal('uuid_generate_v4()'),
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contact_number: {
      type: DataTypes.STRING(15),
      defaultValue: null,
    },
    number_of_matric_student: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    total_number_of_student: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    learner_2019: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    educator_2019: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    phase_ped: {
      type: DataTypes.ENUM(phaseEnum),
      defaultValue: null,
    },
    quintile: {
      type: DataTypes.STRING(50),
      defaultValue: 'NOT APPLICABLE',
    },
  },
    {
      sequelize,
      modelName: 'School',
      tableName: 'schools',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }, {
    sequelize,
    modelName: 'School',
  });

  School.registerAllModels = function (models) {
    allModels = models;
  };

  School.getList = async function (data) {


    let page = Number(req.body.page) || 1;
    let limit = Number(req.query.limit) || 3;
    let skip = (page - 1) * limit

    if (data) {
      if (data.query.like) {
        whereOptions['name'] = {
          [Op.iLike]: `${data.query.like}%`,
        }
      }

      if (data.query.name) {
        whereOptions['name'] = data.query.name
      }

      if (data.query.limit) {
        queryOptions['limit'] = data.query.limit > 10 ? 10 : data.query.limit
      }
    }
  }

  return School;
};