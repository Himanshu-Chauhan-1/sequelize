'use strict';
/** @type {import('sequelize-cli').Migration} */

const spaceType = ['Private', 'Public'];

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
      .then(async () => {
        await queryInterface.createTable('spaces', {
          id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.DataTypes.UUID,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
          },
          name: {
            type: Sequelize.STRING(100),
            allowNull: false,
          },
          description: {
            type: Sequelize.TEXT,
          },
          logo: {
            type: Sequelize.TEXT,
          },
          space_type: {
            type: Sequelize.ENUM(spaceType),
            allowNull: false,
          },
          is_active: {
            type: Sequelize.BOOLEAN,
          },
          created_at: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updated_at: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          deleted_at: {
            type: Sequelize.DATE,
          },
        });

        await queryInterface.addIndex(
          'spaces',
          ['name', 'description'],
          {
            indexName: 'name_description_index',
            indicesType: 'GIST',
          },
        );
      });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('spaces');
  }
};