module.exports = {
    dialect: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'postgres',
    password: 'postgres',
    database: 'devburguer', // nome do banco ????
    define: { // algumas configs do banco
        timestamps: true, // hora que foi criado, update, etc (auditoria)
        underscored: true,
        underscoredAll: true, // caixa baixa , separados por underline ex: users_products
    }
}

const stripeSecretKey = 'sk_test_51R4AJ4PZrUrBoxG977J799oAsDx0hAkBOEKIi3EIi75VD1Pirl7Q5tjUm4RMB54jAcqeqwVAWiWr7edThQldQRIH00XDU9jzzi'

export default stripeSecretKey;