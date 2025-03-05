import express from 'express' // Importa o módulo Express, que é um framework web para Node.js. Ele facilita a criação de servidores web e APIs.
import routes from './routes' // Importa o módulo routes, que provavelmente contém as definições das rotas da sua aplicação.
import './database'; // Importa o arquivo './database'.  Este arquivo provavelmente contém a configuração da conexão com o banco de dados e a inicialização dos models. A importação executa o código nesse arquivo, estabelecendo a conexão com o banco de dados.
import { resolve } from 'node:path';
import cors from 'cors';

class App { // Declara a classe App, que encapsula a lógica principal da aplicação.
    constructor() { // Define o construtor da classe App. O construtor é executado quando uma nova instância da classe é criada.
        this.app = express() // Cria uma instância do Express e a atribui à propriedade this.app. Esta instância será usada para configurar o servidor.
        this.app.use(cors())
        this.middlewares() // Chama o método middlewares() para configurar os middlewares da aplicação.
        this.routes() // Chama o método routes() para configurar as rotas da aplicação.
    }

    middlewares() { // Define o método middlewares(), responsável por configurar os middlewares da aplicação. Middlewares são funções que interceptam as requisições antes de chegarem às rotas.
        this.app.use(express.json()); // Usa o middleware express.json(). Este middleware converte o corpo das requisições (que geralmente vem em formato JSON) em objetos JavaScript, que podem ser acessados dentro das rotas.
        this.app.use('/products-file', express.static(resolve(__dirname, 'uploads')));
        this.app.use('/categories-file', express.static(resolve(__dirname, 'uploads')));
    }

    routes() { // Define o método routes(), responsável por configurar as rotas da aplicação.
        this.app.use(routes) // Usa o módulo routes (que foi importado no início do arquivo). Isso adiciona as rotas definidas no módulo routes à aplicação Express.
    }
}

export default new App().app // Cria uma nova instância da classe App e exporta a propriedade app (que contém a instância do Express já configurada). Isso permite que outros arquivos (como o arquivo principal do servidor) utilizem a aplicação Express.