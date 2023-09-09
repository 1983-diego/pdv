const express = require("express")
const router = express.Router()
const getCategories = require("./controller/categories")
const { createUser, getUser, updateUser } = require("./controller/users")
const login = require("./controller/login")
const { createProduct, updateProduct, getProducts, getOneProduct, deleteProduct } = require("./controller/products")
const { createClient, updateClient, getClients, getOneClient } = require("./controller/clients")
const checkLogin = require("./middleware/checkLogin")
const multer = require("./middleware/multer")

router.get("/categories", getCategories)
router.post("/usuario", createUser)
router.post("/login", login)

router.use(checkLogin)

router.get("/usuario", getUser)
router.put("/usuario", updateUser)

router.post("/produto", createProduct)
router.put("/produto/:id", multer.single('imagem'), updateProduct)
router.get("/produto", getProducts)
router.get("/produto/:id", getOneProduct)
router.delete("/produto/:id", deleteProduct)

router.post("/cliente", createClient)
router.put("/cliente/:id", updateClient)
router.get("/cliente", getClients)
router.get("/cliente/:id", getOneClient)

module.exports = router