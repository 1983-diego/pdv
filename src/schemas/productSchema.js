const yup = require("yup")

const productSchema = yup.object().shape({
    descricao: yup.string().required(),
    quantidade_estoque: yup.number().positive().integer().required(),
    valor: yup.number().positive().integer().required(),
    categoria_id: yup.number().positive().integer().max(5).min(1).required()
})

module.exports = {
    productSchema
}