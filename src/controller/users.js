const knex = require("../config/connect")
const bcrypt = require("bcrypt")
const { userSchema } = require("../schemas/userSchema")

const createUser = async (req, res) => {
    const {nome, email, senha} = req.body
    
    try {
        await userSchema.validate(req.body)

        const checkEmail = await knex('usuarios').where("email", "=", email).first()

        if(checkEmail) {
            return res.status(400).json({message: "Email already exists"})
        }

        const passwordCrypt = await bcrypt.hash(senha, 10)
        
        const newUser = await knex('usuarios').insert({
            nome,
            email,
            senha: passwordCrypt
        }).returning("*")

        if (newUser.length === 0) {
            return res.status(400).json({message: "User not created"})
        }

        return res.status(201).json(newUser)

    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

const getUser = async (req, res) => {
    try {
        return res.status(200).json(req.user)
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

const updateUser = async (req, res) => {
    const {nome, email, senha} = req.body
    const {id} = req.user

    try {
        await userSchema.validate(req.body)

        const emailChecker = await knex('usuarios').where({email}).first()

        if (emailChecker && emailChecker.email != req.user.email) {
            return res.status(400).json({message: "Email has been used"})
        }

        const password = await bcrypt.hash(senha, 10)

        await knex("usuarios").where({id}).update({
            nome,
            email,
            senha: password
        })

        return res.status(204).send()
        
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

module.exports = {
    createUser,
    getUser,
    updateUser,

}