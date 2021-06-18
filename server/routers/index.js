const router = require('express').Router()
const { verifyUserToken, IsSuperuser, IsStaff, IsActive } = require("../middleware/auth");

const userController = require('../controllers/user')
const dataController = require('../controllers/data')
const fileController = require('../controllers/file')

// Register a new User
router.post('/accounts/register', userController.register)

// Register Utilities
router.post('/accounts/register/checkUsername', userController.checkUsername)
router.post('/accounts/register/checkMaxEmailUsage', userController.checkMaxEmailUsage)

// Login user
router.post('/accounts/login', userController.login)
// Login code user
router.post('/accounts/login/code', userController.submitLoginCode)

// Auth Superuser only
router.post('/superuser', verifyUserToken, IsSuperuser, userController.userEvent)

// Auth staff only
router.get('/staff', verifyUserToken, IsStaff, userController.userEvent)

// Auth user only
router.get('/events', verifyUserToken, IsActive, userController.userEvent)

// Test Data route
router.get('/tests/all', dataController.getAll)
router.get('/tests/updateData', dataController.getUpdateData)

// Upload File API route
router.post('/upload/file', fileController.upload)

module.exports = router