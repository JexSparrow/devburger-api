import * as Yup from 'Yup';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth'


class SessionController {
    async store(request, response) {

        const schema = Yup.object({
            email: Yup.string().required(),
            password: Yup.string().min(6).required(),
        });

        const isValid = await schema.isValid(request.body)

        const emailOrPasswordIncorrect = () => 
            response.status(401).json({ error: 'Certifique-se de que os dados estão corretos' })

        if (!isValid) {
           return emailOrPasswordIncorrect();
        }

        const { email, password } = request.body

        const user = await User.findOne({
            where: {
                email,
            },
        })

        if (!user) {
           return emailOrPasswordIncorrect();
        }

        const isSamePassword = await user.checkPassword(password)

        if (!isSamePassword) {
          return  emailOrPasswordIncorrect();
        }

        return response.status(201).json({
            message: 'sessão iniciada',
            id: user.id,
            name: user.name,
            email,
            admin: user.admin,
            token: jwt.sign({ id: user.id, name: user.name }, authConfig.secret, { // <-- Corrected
                expiresIn: authConfig.expiresIn, // Use expiresIn here!
            }),
            expiresIn: authConfig.expiresIn, // You can keep this for the client
        });
        }           
 }



export default new SessionController();