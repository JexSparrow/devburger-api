import multer from 'multer'; // Importa o módulo multer, que é um middleware para lidar com uploads de arquivos.
import {v4} from 'uuid'; // Importa a função v4 do módulo uuid, que gera IDs únicos (UUIDs).

import { resolve, extname } from 'node:path'; // Importa as funções resolve e extname do módulo path do Node.js.
// - resolve:  Usada para criar caminhos absolutos.
// - extname: Usada para obter a extensão de um arquivo.

export default { // Exporta um objeto com as configurações do multer.
    storage: multer.diskStorage({ // Define a configuração de armazenamento para uploads em disco.
        destination: resolve(__dirname, '..', 'uploads'), // Define o diretório de destino para os uploads.
        // - __dirname: Diretório do arquivo atual (onde este código está).
        // - '..', '..': Sobe dois níveis na hierarquia de diretórios.
        // - 'uploads': Pasta onde os arquivos serão armazenados.
        // O caminho final será algo como: /caminho/para/seu/projeto/uploads

        filename: (request, file, callback) => // Define a função que gera o nome do arquivo.
            callback(null, v4() + extname(file.originalname)), // Gera um nome único para o arquivo.
        // - request: Objeto de requisição do Express.
        // - file: Objeto com informações sobre o arquivo enviado.
        // - callback: Função que deve ser chamada com o nome do arquivo.
        // A função gera um UUID (v4()) e concatena com a extensão original do arquivo.
        // Exemplo:  `a1b2c3d4-e5f6-7890-1234-567890abcdef.jpg`
    }),
};