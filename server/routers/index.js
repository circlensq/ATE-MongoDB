const router = require('express').Router()
const csurf = require('csurf')
const csrfProtection = csurf({ cookie: true }) 

const { verifyUserToken, IsSuperuser, IsStaff, IsActive } = require("../middleware/auth");

const userController = require('../controllers/user')
const dataController = require('../controllers/data')
const fileController = require('../controllers/file')

// Send CSRF token for session
router.get('/getcsrftoken', csrfProtection, function (req, res) {
    return res.json({ csrfToken: req.csrfToken() });
});

// Register a new User
router.post('/accounts/register', userController.register )

// Register Utilities
router.post('/accounts/register/checkUsername', userController.checkUsername)
router.post('/accounts/register/checkMaxEmailUsage', userController.checkMaxEmailUsage)

// Login user
router.post('/accounts/login', userController.login)
router.post('/accounts/getId', verifyUserToken, userController.getId)

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
router.get('/tests/search/:query', dataController.searchTest)

// Upload File API route
router.post('/file/upload', verifyUserToken, IsStaff, fileController.upload)
router.post('/file/download/:data', fileController.download)
router.get('/file/download/:name', fileController.downloadSingle) 

// Search Data route

module.exports = router