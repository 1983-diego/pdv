const knex = require("../config/connect")

const getCategories = async (req, res) => {
    try {
        const categories = await knex('categorias')
        
        return res.status(200).json(categories)
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

module.exports = getCategories