const express = require("express")
const router = express.Router()
const showCategories = require("./controller/categories")
const { createUser } = require("./controller/users")
const login = require("./controller/login")

router.get("/categories", showCategories)
router.post("/users", createUser)
router.post("/login", login)


module.exports = router