import Sequelize, {Model} from "sequelize"; // Importa o Sequelize e a classe Model do pacote sequelize. Sequelize é o ORM, Model é a classe base para os models.
import bcrypt from 'bcrypt'; // Importa o bcrypt, biblioteca para criptografar senhas de forma segura.

class User extends Model { // Declara a classe User, que herda da classe Model do Sequelize. Isso significa que User será um model do Sequelize.
    static init(sequelize){ // Define o método init, que é responsável por inicializar o model. Este método recebe a instância do Sequelize como argumento.
        super.init( // Chama o método init da classe pai (Model). Este método configura o model.
            { // Primeiro argumento para super.init: Um objeto que define os atributos (colunas) da tabela User.
                name: Sequelize.STRING, // Define o atributo name como uma string.
                email: Sequelize.STRING, // Define o atributo email como uma string.
                password: Sequelize.VIRTUAL, // Define o atributo password como virtual. Este atributo não será armazenado no banco de dados, servindo apenas para receber a senha no momento da criação ou atualização do usuário.
                password_hash: Sequelize.STRING, // Define o atributo password_hash como uma string. Este atributo armazenará o hash da senha do usuário (nunca a senha em texto plano).
                admin: Sequelize.BOOLEAN, // Define o atributo admin como um booleano.
            },
            { // Segundo argumento para super.init: Um objeto com opções para o model.
                sequelize, // Passa a instância do Sequelize para o model. Isso é essencial para que o model saiba qual banco de dados ele deve usar.
            }
        );

        this.addHook('beforeSave', async (user)=> { // Adiciona um hook (gancho) que será executado antes de salvar o usuário no banco de dados. Este hook permite executar uma função antes da operação de salvar.
            if(user.password){ // Verifica se o atributo password foi preenchido.
                user.password_hash = await bcrypt.hash(user.password, 8) // Criptografa a senha usando bcrypt e armazena o hash em password_hash. O número 8 representa o custo computacional do hash (quanto maior, mais seguro, porém mais lento).
            }
        })
        return this; // Retorna a instância do model.
    }

    async checkPassword(password){ // Método para comparar a senha fornecida com o hash armazenado no banco de dados.
        return bcrypt.compare(password, this.password_hash) // Compara a senha (criptografada pelo bcrypt) com o hash armazenado em password_hash.
    }
}

export default User; // Exporta a classe User como padrão. Isso permite que você importe este model em outros arquivos.