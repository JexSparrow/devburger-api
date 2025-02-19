'use-strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) { // metodo up, cria 
    await queryInterface.createTable('users', {
      id: {
        primaryKey: true,
        allowNull: false, // permitir nulo?
        type: Sequelize.UUID, // caracteres aleatorios
        defaultValue: Sequelize.UUIDV4, // Versão 4 do uuid
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // email unico, não pode repetir
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      admin: {
        type: Sequelize.BOOLEAN, // sim ou nao
        defaultValue: false, // padrao false, pois a maioria dos usuarios nao serao adm (adm pode realizar as alterações na pagina)
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    })
   
  },

  async down (queryInterface) { // metodo down, desfaz as alterações
    await queryInterface.dropTable('users') 
    
  }
};