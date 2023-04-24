'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
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
        through: models.UserRole,
        foreignKey: 'role_id',
        otherKey: 'user_id',
      })

      //RELATION WITH `user school`
      this.belongsTo(models.UserSchool, {
        as: "learnerSchool",
        foreignKey: "id"
      })

    }
  }
  Role.init({
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    public_id: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    website: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
    {
      sequelize,
      modelName: 'Role',
      tableName: 'roles',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    });
  return Role;
};