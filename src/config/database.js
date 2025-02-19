module.exports = {
    dialect: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'postgres',
    password: 'postgres',
    database: 'devburger', // nome do banco ????
    define: { // algumas configs do banco
        timestamps: true, // hora que foi criado, update, etc (auditoria)
        underscored: true,
        underscoredAll: true, // caixa baixa , separados por underline ex: users_products
    }
}