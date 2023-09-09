const knex = require("../config/connect")
const orderSchema = require("../schemas/orderSchema")
const transporter = require("../email")
require("dotenv").config()

const createOrder = async (req, res) => {
    const {cliente_id, observacao, pedido_produtos} = req.body

    try {
        await orderSchema.validate(req.body)

        const client = await knex("clientes").where("id", "=", cliente_id).first()

        if (!client) {
            return res.status(404).json({message: "Client not found"})
        }

        let notProduct = []
        let totalValue = 0

        for (let item of pedido_produtos) {
            let product = await knex('produtos').where("id", "=", item.produto_id).first()

            if(!product) {
                notProduct.push({
                    message: `There is no product with id: ${item.produto_id} `
                })
            } else {
                if (item.quantidade_produto > product.quantidade_estoque) {
                    notProduct.push({
                        message: `The stock current quantity is ${product.quantidade_estoque} for the product ID: ${item.produto_id}`
                    })
                } else {
                    totalValue += product.valor * item.quantidade_produto

                    item.valor_produto = product.valor

                    item.quantidade_estoque_subtraido = product.quantidade_estoque - item.quantidade_produto
                }
            }
        }

        if(notProduct.length > 0) {
            return res.status(400).json({message: notProduct})
        }

        const order = await knex("pedidos").insert({
            cliente_id,
            observacao,
            valor_total: totalValue
        }).returning("*")

        for (let item of pedido_produtos) {
            await knex('pedido_produtos').insert({
                pedido_id: order[0].id,
                produto_id: item.produto_id,
                quantidade_produto: item.quantidade_produto,
                valor_produto: item.valor_produto
            }).returning("*")

            await knex("produtos").where("id", "=", item.produto_id).update({
                quantidade_estoque: item.quantidade_estoque_subtraido
            }).returning("*")
        }

        const clientEmail = await knex('clientes').where('id', '=', cliente_id).returning('*')

        await transporter.sendMail({
            from: `${process.env.EMAIL_NAME} <${process.env.EMAIL_FROM}>`,
            to: `${clientEmail[0].nome} <${clientEmail[0].email}>`,
            subject: "Confirmação de Pedido ✔",
            html: ` <table>
                        <th>Produto</th>
                        <th>Quantidade</th>
                        <th>Valor Unitário</th>
                            ${contentTable}
                            <p> Valor total: ${pedidoValorTotal}</p>
                    </table>`,
          });

          return res.status(201).json({message: "Order created"})
        
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

const getOrders = async (req, res) => {
    const {cliente_id } = req.query

    try {
        if (cliente_id){
            const client = await knex("clientes"). where("id", "=", cliente_id).first()

            if (!client) {
                return res.status(404).json({message: "Client not found"})
            }
        }

        let orders = []
        if(cliente_id) {
            orders = await knex('pedidos').where("cliente_id", "=", cliente_id)
        } else {
            orders = await knex("pedidos")
        }

        let allOrders = []
        for (let order of orders) {
            let productOrder = await knex("pedido_produtos").where("pedido_id", "=", order.id)

            allOrders.push({
                order,
                productOrder
            })
        }

        if (allOrders.length === 0) {
            return res.status(494).json({message: "There's no order"})
        }

        return res.json(allOrders)

    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}


module.exports = {
    createOrder,
    getOrders
}