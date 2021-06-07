const router = require('express').Router()
const { verifyUserToken, IsSuperuser, IsStaff, IsActive } = require("../middleware/auth");

const userController = require('../controllers/user')

// Register a new User
router.post('/accounts/register', userController.register)

// Login user
router.post('/accounts/login', userController.login)

// Auth Superuser only
router.get('/superuser', verifyUserToken, IsSuperuser, userController.userEvent)

// Auth staff only
router.get('/staff', verifyUserToken, IsStaff, userController.userEvent)

// Auth user only
router.get('/events', verifyUserToken, IsActive, userController.userEvent)

module.exports = router