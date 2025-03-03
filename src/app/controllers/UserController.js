// store => cadastrar/adicionar
// index => listar vários
// show => lisar apenas um
// update => atualizar
// delete => deletar

import { v4 } from 'uuid'; // Importa a função v4 do módulo uuid, que gera IDs únicos (UUIDs).
import User from '../models/User'; // Importa o model User do arquivo '../models/User.js'.
import * as Yup from 'Yup'; // Importa o Yup, uma biblioteca para validação de dados.

class UserController { // Define a classe UserController, que contém os métodos para lidar com as requisições relacionadas a usuários.
    async store(request, response) { // Define o método store, responsável por cadastrar/adicionar um novo usuário.

        const schema = Yup.object({ // Define o schema de validação para os dados do usuário usando o Yup.
            name: Yup.string().required(), // O campo name é uma string obrigatória.
            email: Yup.string().email().required(), // O campo email é uma string obrigatória e deve ser um email válido.
            password: Yup.string().min(6).required(), // O campo password é uma string obrigatória e deve ter no mínimo 6 caracteres.
            admin: Yup.boolean() // O campo admin é um booleano (opcional).
        })

        // const isValid = await schema.isValid(request.body); // Versão antiga da validação com Yup (agora comentada).
        // if(!isValid){
        //     return response.status(400).json({error: 'tá certo isso?'});
        // }

        try { // Bloco try...catch para lidar com possíveis erros durante a validação.
            schema.validateSync(request.body, { abortEarly: false }) // Valida os dados da requisição com o schema definido. { abortEarly: false } permite que todos os erros de validação sejam retornados.
        } catch (err) { // Captura erros de validação.
            return response.status(400).json({ error: err.errors }) // Retorna uma resposta com status 400 (Bad Request) e os erros de validação.
        }

        const { name, email, password, admin } = request.body; // Extrai os dados do corpo da requisição.

        const userExist = await User.findOne({ // Verifica se já existe um usuário com o email fornecido.
            where: {
                email,
            },
        });

        if (userExist) { // Se o usuário já existe...
            return response.status(409).json({ error: 'Usuário já existe' }) // Retorna uma resposta com status 409 e a mensagem de erro.
        }

        const user = await User.create({ // Cria um novo usuário no banco de dados.
            id: v4(), // Gera um UUID para o novo usuário.
            name,
            email,
            password, // A senha será criptografada automaticamente pelo hook 'beforeSave' no model User.
            admin,
        });

        return response.status(201).json({ // Retorna uma resposta com status 201 (Created) e os dados do usuário criado.
            id: user.id,
            name,
            email,
            admin,
        });
    };
}

export default new UserController; // Exporta uma nova instância da classe UserController.