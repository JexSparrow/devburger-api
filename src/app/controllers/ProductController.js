import * as Yup from 'Yup'; // Importa a biblioteca Yup para validação de dados.
import Product from '../models/Product';
import Category from '../models/Category';
import User from '../models/User';

class ProductController { // Declara a classe ProductController, que contém os métodos para lidar com requisições relacionadas a produtos.

    async store(request, response) { // Define o método store, responsável por criar um novo produto.

        const schema = Yup.object({ // Define o schema de validação para os dados do produto usando Yup.
            name: Yup.string().required(), // O campo name é uma string obrigatória.
            price: Yup.number().required(), // O campo price é um número obrigatório.
            category_id: Yup.number().required(), // O campo category é uma string obrigatória.
        });

        try { // Bloco try...catch para lidar com possíveis erros durante a validação.
            schema.validateSync(request.body, { abortEarly: false }); // Valida os dados da requisição com o schema definido. { abortEarly: false } permite que todos os erros de validação sejam retornados.
        } catch (err) { // Captura erros de validação.
            return response.status(400).json({ error: err.errors }); // Retorna uma resposta com status 400 (Bad Request) e os erros de validação.
        }

        // Se a validação passou, o código continua aqui.
        // Você adicionaria aqui a lógica para criar o produto no banco de dados.

        const {admin: isAdmin} = await User.findByPk(request.userId);

        if(!isAdmin){
            return response.status(401).json()
        }

        const { file } = request;

        const { filename: path } = file;
        const { name, price, category_id } = request.body

        const product = await Product.create({
            name,
            price,
            category_id,
            path,
        });

        return response.status(201).json(product)
    }

    async index(request, response) {
        const products = await Product.findAll({
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name'],
                },
            ],
        });

        console.log({ userId: request.userId })

        return response.json({ message: 'Todos os Produtos', products })
    }
}

export default new ProductController(); // Exporta uma nova instância da classe ProductController.