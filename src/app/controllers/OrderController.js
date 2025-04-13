import * as Yup from 'Yup';
import Order from '../schemas/Order';
import Product from '../models/Product';
import Category from '../models/Category';
import mongoose from 'mongoose';
import User from '../models/User';

class OrderController {
    async store(request, response) {

        const schema = Yup.object({
            products: Yup.array().required().of(
                Yup.object({
                    id: Yup.number().required(),
                    quantity: Yup.number().required(),
                }),
            ),
        });

        try {
            await schema.validateSync(request.body, { abortEarly: false });
        } catch (err) {
            return response.status(400).json({ error: err.errors });
        }

        const { products } = request.body;
        const productsId = products.map((product) => product.id);

        const findProducts = await Product.findAll({
            where: { id: productsId },
            include: [{
                model: Category,
                as: 'category',
                attributes: ['name'],
            }],
        });

        const formattedProducts = findProducts.map((product) => {
            const productIndex = products.findIndex((item) => item.id === product.id);

            const newProduct = {
                id: product.id,
                name: product.name,
                category: product.category.name,
                price: product.price,
                url: product.url,
                quantity: products[productIndex].quantity,
            };

            return newProduct;
        });

        const order = {
            user: {
                id: request.userId,
                name: request.userName,
            },
            products: formattedProducts,
            status: 'Pedido Realizado!'
        };

        const createdOrder = await Order.create(order);

        return response.status(201).json(createdOrder);
    }

    async index(request, response) {
        const orders = await Order.find();

        return response.json(orders)
    }

    async update(request, response) {
        const schema = Yup.object({
            status: Yup.string().required(),
        });

        try {
            await schema.validate(request.body, { abortEarly: false });
        } catch (err) {
            return response.status(400).json({ error: err.errors });
        }

        const { admin: isAdmin } = await User.findByPk(request.userId);

        if (!isAdmin) {
            return response.status(401).json()
        }

        const { id } = request.params;
        const { status } = request.body;

        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {  // Verifica se o ID é válido
                return response.status(400).json({ error: "ID inválido." });
            }

            const objectId = new mongoose.Types.ObjectId(id); // Converte para ObjectId

            const updatedOrder = await Order.findByIdAndUpdate(objectId, { status }, { new: true }); // Correção: use findByIdAndUpdate com { new: true }

            if (!updatedOrder) {
                return response.status(404).json({ error: "Pedido não encontrado." });
            }

            return response.json({ message: 'Status atualizado com Sucesso!' }); // Retorna o pedido atualizado

        } catch (err) {
            console.error("Erro ao atualizar pedido:", err);
            if (err.name === 'CastError') {
                return response.status(400).json({ error: "ID inválido." });
            }
            return response.status(500).json({ error: "Erro interno do servidor." });
        }
    }
}

export default new OrderController();