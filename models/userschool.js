'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserSchool extends Model {
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
        through: 'school',
        foreignKey: 'user_id',
      })

      //RELATION WITH `user role`
      this.hasMany(models.UserRole, {
        as: "learner",
        foreignKey: "user_id"
      })

      //RELATION WITH `user role`
      this.hasMany(models.Role, {
        as: "learnerRole",
        foreignKey: "id"
      })

      //RELATION WITH `user role`
      this.hasMany(models.UserRole, {
        as: "teacher",
        foreignKey: "user_id"
      })

      //RELATION WITH `user role`
      this.belongsTo(models.School, {
        as: "schools",
        foreignKey: "school_id"
      })


    }
  }
  UserSchool.init({
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    school_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'schools',
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'UserSchool',
    tableName: 'user_schools',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return UserSchool;
};