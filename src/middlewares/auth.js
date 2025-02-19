import jwt from 'jsonwebtoken';
import authConfig from '../config/auth';


function authMiddleware(request, response, next) {
    const authToken = request.headers.authorization;

    if(!authToken){
        return response.status(401).json({ error: "Token não fornecido"})
    }

    const token = authToken.split(' ').at(1);

    try{
        jwt.verify(token, authConfig.secret , (err , decoded) => {

            if(err){
                throw new Error();
            }

            request.userId = decoded.id;

//             console.log(decoded)
//             id: '92b57655-c016-49fa-9de2-209e7b5865fe',
//             iat: 1739834708,
//             exp: 1740266708

        });

    } catch(err){

       return response.status(401).json({ error: 'Token Inválido'})
    }

    return next();

}

export default authMiddleware;