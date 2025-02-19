import { Sequelize } from 'sequelize'; // Importa a classe Sequelize do pacote 'sequelize'. Sequelize é o ORM (Object-Relational Mapper) que facilita a interação com o banco de dados.

import configDatabase from '../config/database'; // Importa as configurações do banco de dados do arquivo '../config/database.js'. Este arquivo contém informações como nome do banco de dados, usuário, senha, host, etc.

import User from '../app/models/User'; // Importa o model User do arquivo '../app/models/User.js'. O model User define a estrutura da tabela de usuários no banco de dados.
import Product from '../app/models/Product';
import Category from '../app/models/Category';

const models = [User, Product, Category]; // Cria um array chamado models que contém o model User. Este array será usado para inicializar todos os models.

class Database { // Declara a classe Database, responsável por gerenciar a conexão com o banco de dados e inicializar os models.
    constructor() { // Define o construtor da classe Database. O construtor é executado quando uma nova instância da classe é criada.
        this.init(); // Chama o método init() dentro do construtor para inicializar a conexão com o banco de dados e os models.
    }

    init() { // Define o método init(), responsável por inicializar a conexão com o banco de dados e os models.
        this.connection = new Sequelize(configDatabase); // Cria uma nova instância do Sequelize, passando as configurações do banco de dados (importadas de configDatabase) como argumento. Esta instância representa a conexão com o banco de dados.
        models.map((model) => model.init(this.connection)); // Itera sobre o array models (que contém o model User) e chama o método init() de cada model, passando a instância da conexão (this.connection) como argumento. Isso inicializa cada model e o associa à conexão com o banco de dados.
    }
}

export default new Database(); // Cria uma nova instância da classe Database e a exporta como padrão. Isso permite que outros arquivos importem esta instância e a utilizem para interagir com o banco de dados.