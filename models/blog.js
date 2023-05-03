'use strict';
const { Model } = require('sequelize');

// ENUMS
const contentType = ['Text', 'Link']
const audienceType = ['Public', 'Friends', 'Specific', 'Students']

module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // RELATION WITH `users`
      this.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'user_id',
      })

      // RELATION WITH `users`
      this.belongsTo(models.User, {
        as: 'postedBy',
        foreignKey: 'posted_by',
      })

      // RELATION WITH `space`
      this.belongsTo(models.Space, {
        as: 'space',
        foreignKey: 'space_id',
      })
    }
  }
  Blog.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize.literal('uuid_generate_v4()'),
    },
    audience_type: {
      type: DataTypes.ENUM(audienceType),
      allowNull: false,
    },
    content_type: {
      type: DataTypes.ENUM(contentType),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    is_draft: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    header_image_id: {
      type: DataTypes.UUID,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    posted_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    space_id: {
      type: DataTypes.UUID,
      references: {
        model: 'spaces',
        key: 'id',
      },
    },
  },
    {
      defaultScope: {
        where: {
          is_draft: false,
        },
      },
      scopes: {
        draft: {
          where: {
            is_draft: true,
          },
        },
      },
      sequelize,
      paranoid: true,
      modelName: 'Blog',
      tableName: 'blogs',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
    });
  return Blog;
};