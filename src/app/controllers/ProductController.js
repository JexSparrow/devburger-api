import * as Yup from 'Yup';
import Product from '../models/Product';
import Category from '../models/Category';
import User from '../models/User';

class ProductController {
    async store(request, response) {
        const schema = Yup.object({
            name: Yup.string().required(),
            price: Yup.number().required(),
            category_id: Yup.number().required(),
            offer: Yup.boolean(),
        });

        try {
            await schema.validate(request.body, { abortEarly: false });
        } catch (err) {
            return response.status(400).json({ error: err.errors });
        }

        const { admin: isAdmin } = await User.findByPk(request.userId);

        if (!isAdmin) {
            return response.status(401).json();
        }

        const { file } = request;
        const { filename: path } = file;
        
        const { name, price, category_id, offer } = request.body;

        const product = await Product.create({
            name,
            price,
            category_id,
            path,
            offer,
        });

        console.log(request.body);

        return response.status(201).json(product);
    }

    async update(request, response) {
        const schema = Yup.object({
            name: Yup.string(),
            price: Yup.number(),
            category_id: Yup.number(),
            offer: Yup.boolean(),
        });

        try {
            await schema.validate(request.body, { abortEarly: false });
        } catch (err) {
            return response.status(400).json({ error: err.errors });
        }

        const { admin: isAdmin } = await User.findByPk(request.userId);

        if (!isAdmin) {
            return response.status(401).json();
        }

        const {id} = request.params;

        const findProduct = await Product.findByPk(id);

        if (!findProduct) {
            return response.status(400).json({ error: 'Certifique-se de que o ID esteja correto!' })
        }

        let path;
        if (request.file) {
            path = request.file.filename;
        }

        const { name, price, category_id, offer } = request.body;

        await Product.update({

            name,
            price,
            category_id,
            path,
            offer,
        },
            {
                where: {
                    id,
                }
            }
        );


        return response.status(200).json({ message: 'Produto Atualizado!' });
    }

    async index(request, response) {
        const products = await Product.findAll({
            attributes: ['id', 'name', 'price', 'url', 'offer'],
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name'],
            }],
        });

        console.log({ userId: request.userId });

        return response.json({ message: 'Todos os Produtos', products });
    }
}

export default new ProductController();