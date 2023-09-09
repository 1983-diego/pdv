const knex = require("../config/connect")
const { productSchema } = require("../schemas/productSchema")
require("dotenv").config()

const createProduct = async (req, res) => {
    const {descricao, quantidade_estoque, valor, categoria_id} = req.body

    try {
        await productSchema.validate(req.body)

        const newProduct = await knex('produtos').insert({
            descricao,
            quantidade_estoque,
            valor,
            categoria_id
        }).returning("*")

        if (!newProduct){
            return res.status(400).json({message: "Product not created"})
        }

        return res.status(201).json(newProduct)
        
    } catch (error) {
        return res.status(400).json({message: error.message})
    }

}

const updateProduct = async (req, res) => {
    const {descricao, quantidade_estoque, valor, categoria_id} = req.body
    const {id} = req.params 

    try {
        await productSchema.validate(req.body)

        const findProduct = await knex('produtos').where({id}).first()

        if (!findProduct) {
            return res.status(404).json({message: "Product not found"})
        }

        const update = await knex('produtos').where({id}).update({
            descricao, quantidade_estoque, valor, categoria_id
        }).returning("*")
        

        return res.status(201).json(update)
        
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

const getProducts = async (req, res) => {
    const {q} = req.query
    
    try {
        if (q) {
            const queryProducts = await knex("produtos").where("descricao","ilike" , `%${q}%`).returning("*")
            
            return res.status(200).json(queryProducts)
        } else {
            const products = await knex('produtos')

            return res.status(200).json(products)
        }
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

const getOneProduct = async (req, res) => {
    const {id} = req.params
    
    try {
        const product = await knex('produtos').where({id}).first()

        if (!product){
            return res.status(404).json({message: 'Product not found'})
        }

        return res.status(200).json(product)
        
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

const deleteProduct = async (req, res) => {
    const {id} = req.params
    
    try {
        let product = await knex('produtos').where({id}).first()

        if (!product){
            return res.status(404).json({message: 'Product not found'})
        } 

        const orders = await knex("pedido_produtos").where("produto_id", "=", id)

        if(orders.length > 0) {
            return res.status(400).json({message: "Cannot delete product / there is/are orders of it."})
        }

        if (product.produto_imagem) {
            let urlImage = product.produto_imagem.split(`${process.env.BACKBLAZE_BUCKET_ENDPOINT}/`);
            let caminhoImage = urlImage[1];
            await excluirImagem(caminhoImage);
        }

        product = await knex('produtos')
            .where('id', '=', id)
            .del();
            
        if (product.length === 0) {
            return res.status(400).json({message: "Cannot delete product"});
        }

        return res.status(204).send();
        
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

//parei no endpoint cadastrar cliente na sprint 2

module.exports = {
    createProduct,
    updateProduct,
    getProducts,
    getOneProduct,
    deleteProduct

}