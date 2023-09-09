const yup = require("yup")

const clientSchema = yup.object().shape({
    nome: yup.string().required(),
    email: yup.string().email().required(),
    cpf: yup.string().required(),
    cep: yup.string(),
    rua: yup.string(),
    numero: yup.string(),
    bairro: yup.string(),
    cidade: yup.string(),
    estado: yup.string().min(2).max(2)
})

module.exports = clientSchema