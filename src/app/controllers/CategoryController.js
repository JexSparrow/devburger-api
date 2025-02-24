import * as Yup from 'Yup'; // Importa a biblioteca Yup para validação de dados.
import Category from '../models/Category';
import User from '../models/User';

class CategoryController { 

    async store(request, response) { // Define o método store, responsável por criar um novo produto.

        const schema = Yup.object({ // Define o schema de validação para os dados do produto usando Yup.
            name: Yup.string().required(), // O campo name é uma string obrigatória.
        });

        try { // Bloco try...catch para lidar com possíveis erros durante a validação.
            schema.validateSync(request.body, { abortEarly: false }); // Valida os dados da requisição com o schema definido. { abortEarly: false } permite que todos os erros de validação sejam retornados.
        } catch (err) { // Captura erros de validação.
            return response.status(400).json({ error: err.errors }); // Retorna uma resposta com status 400 (Bad Request) e os erros de validação.
        }

        const {admin: isAdmin} = await User.findByPk(request.userId);

        if(!isAdmin){
            return response.status(401).json()
        }

        const {name} = request.body;

        const categoryExists = await Category.findOne({
            where: {
                name,
            }
        });

        if (categoryExists){
            return response.status(400).json({ error: 'Categoria já existe!'})
        }

        const {id} = await Category.create({
            name,
        });

        return response.status(201).json({id, name})
    }

    async index(request, response) {
        const categories = await Category.findAll();

        return response.json({message: 'Todas as Categorias' , categories})
    }
}

export default new CategoryController();