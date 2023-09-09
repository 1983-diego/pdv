const yup = require("yup")

const orderSchema = yup.object().shape({
    cliente_id: yup.number().positive().integer().required(),
    observacao: yup.string(),
    pedido_produtos: yup.array().of(
        yup.object().shape({
            produto_id: yup.number().positive().integer().required(),
            quantidade_produto: yupp.number().positive().integer().required()

        })
    )
})

module.exports = orderSchema