'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      // define association here

      //RELATION WITH `user school`
      this.belongsTo(models.UserSchool, {
        as: "learner",
        foreignKey: "user_id"
      })

      // RELATION WITH `users`
      this.belongsToMany(models.User, {
        as: 'users',
        through: models.UserRole,
        foreignKey: 'role_id',
        otherKey: 'user_id',
      })

    }
  }
  UserRole.init({
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    role_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'UserRole',
    tableName: 'user_roles',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return UserRole;
};