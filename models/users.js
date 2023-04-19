'use strict';
const { Model } = require('sequelize');

// ENUMS
const userGender = [
  'Male',
  'Female',
  'Other',
  'Non-Binary',
  'Agender',
  'Intersex',
  'Transgender Female',
  'Two-Spirit',
  'Genderqueer',
  'Gender Non-conforming (GNC)',
  'Prefer not to say',
  'Transgender Male',
]

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // RELATION WITH `school`
      this.belongsToMany(models.School, {
        as: 'schools',
        through: models.UserSchool,
        foreignKey: 'user_id',
        otherKey: 'school_id',
      })

     // RELATION WITH `role`
     this.belongsToMany(models.Role, {
      as: 'roles',
      through: models.UserRole,
      foreignKey: 'user_id',
      otherkey: 'role_id',
    })
    }
  }
  Users.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize.literal('uuid_generate_v4()'),
      },
      title: {
        type: DataTypes.STRING(25),
        allowNull: false,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING(25),
        allowNull: false,
      },
      display_name: {
        type: DataTypes.STRING(120),
        allowNull: false,
        /**
         * Method to set the upper words.
         * @param {String} value naked password value.
         * */
        set(value) {
          if (value) {
            this.setDataValue('display_name', toUpperWords(value))
          }
        },
      },
      username: {
        type: DataTypes.STRING(120),
        unique: true,
      },
      ethinicity: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING(15),
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_accepted_tc: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_accepted_ofm: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_requested_to_delete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      password: {
        type: DataTypes.STRING(250),
        /**
         * Method to set the hashed password.
         * @param {String} value naked password value.
         * */
        set(value) {
          if (value) {
            this.setDataValue('password', bcrypt.hashSync(value, 10))
          }
        },
      },
      reset_token: {
        type: DataTypes.STRING(250),
      },
      reset_token_expiry: {
        type: DataTypes.DATE,
      },
      first_login_token: {
        type: DataTypes.STRING(250),
      },
      gender: {
        type: DataTypes.ENUM(userGender),
        allowNull: false,
      },
      profile_picture: {
        type: DataTypes.TEXT,
      },
      bio: {
        type: DataTypes.TEXT,
      },
      nationality: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      province: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      date_of_birth: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      enter_routes: {
        type: DataTypes.STRING(50),
      },
      mobile: {
        type: DataTypes.STRING(15),
      },
      is_email_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_phone_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      sessions: {
        type: DataTypes.ARRAY(DataTypes.STRING),
      },
      delete_reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      delete_requests_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      pre_survey: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      post_survey: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  )

  return Users;
};