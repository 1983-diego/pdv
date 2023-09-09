const knex = require("../config/connect")
const clientSchema = require("../schemas/clientSchema")

const createClient = async (req, res) => {
    const {nome,email,cpf,cep,rua,numero,bairro,cidade,estado} = req.body

    try {
        await clientSchema.validate(req.body)

        const clientCheck = await knex("clientes").where("email", "=", email).orWhere("cpf", "=", cpf).first()

        if(clientCheck) {
            return res.status(400).json({message: "Email and/or CPF already exist"})
        }

        const newClient = await knex("clientes").insert({
            nome,email,cpf,cep,rua,numero,bairro,cidade,estado
        }).returning("*")

        if (!newClient) {
            return res.status(400).json({message: "Client not registered"})
        }

        return res.status(201).json(newClient)
        
    } catch (error) {
        return res.status(400).json({message: error.message})
    }

}

const updateClient = async (req, res) => {
    const {nome,email,cpf,cep,rua,numero,bairro,cidade,estado} = req.body
    const {id} = req.params
    

        try {
        const emailCheck = await knex('clientes').where({email}).first()
        
        if (emailCheck && emailCheck.id != id) {
            return res.status(400).json({mensagem: "Email has been used"})
        }
        
        const cpfCheck = await knex('clientes').where({cpf}).first()
        
        if (cpfCheck && cpfCheck.id != id) {
            return res.status(400).json({mensagem: "Cpf has been used"})
        }

        const update = await knex('clientes').update({
            nome, 
            email, 
            cpf, 
            cep,
            rua,
            numero,
            bairro,
            cidade,
            estado
        }).where({id}).returning("*")

        if (!update) {
            return res.status(400).json({ mensagem: "Client not updated"})
        }

        return res.status(204).send()
    } catch (error) {
        return res.status(400).json({mensagem: error.message})
    }
}

const getClients = async (req, res) => {
    try {
        const clients = await knex("clientes").returning("*")

        return res.status(200).json(clients)
        
    } catch (error) {
        return res.status(400).json({mensagem: error.message})
    }
}

const getOneClient = async (req, res) => {
    const {id} = req.params

    try {
        const client = await knex("clientes").where({id}).first()

        if(!client) {
            return res.status(404).json({message: "Client not found"})
        }

        return res.status(200).json(client)
        
    } catch (error) {
        return res.status(400).json({mensagem: error.message})
    }
}

module.exports = {
    createClient,
    updateClient,
    getClients,
    getOneClient
    
}