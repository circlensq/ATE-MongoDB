const router = require('express').Router()
var csurf = require('csurf')
var csrfProtection = csurf({ cookie: true })

const { verifyUserToken, IsSuperuser, IsStaff, IsActive } = require("../middleware/auth");

const userController = require('../controllers/user')
const dataController = require('../controllers/tests')
const fileController = require('../controllers/file_tests')
const fileUniversalController = require('../controllers/file_universal')
const projectController = require('../controllers/project')

// Send CSRF token for session
router.get('/getcsrftokensecre', csrfProtection, function (req, res) {
    return res.json({ csrfToken: req.csrfToken() });
});


// Register User
router.post('/accounts/register', csrfProtection, userController.register)
router.post('/accounts/register/checkUsername', csrfProtection, userController.checkUsername)
router.post('/accounts/register/checkMaxEmailUsage', csrfProtection, userController.checkMaxEmailUsage)

// Login user
router.post('/accounts/login', csrfProtection, userController.login)
router.post('/accounts/login/instrument', userController.login)
router.post('/accounts/getId', verifyUserToken, userController.getId)
router.get('/accounts/user/search/:id', userController.searchUser)

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
router.get('/tests/:id/', dataController.getById)
router.get('/tests/search/:project_id/:test_station', dataController.passedPercentages)

// * Test .txt files Upload & Download File API route (for C#) -> ONLY FOR Data, log, ComportText, TelnetText
router.post('/file/upload', verifyUserToken, IsStaff, fileController.upload)
router.post('/file/download/:name', fileController.download)

// * Test .txt files Upload (Converter File) API route (website) -> ONLY FOR Data, log, ComportText, TelnetText
router.post('/file/converter/upload', fileController.converter)

// * Universal Upload File API (for Dashboard)
router.post('/file/universal/upload', fileUniversalController.upload)
router.get('/file/universal/all', fileUniversalController.getAll)
router.post('/file/universal/delete', fileUniversalController.deleteFile)
router.post('/file/universal/download', fileUniversalController.download)

// Download .txt file and universal files
router.get('/file/download/:name', fileController.downloadSingle)

// Project Data route
router.post('/project/create', projectController.createProject)
router.post('/project/edit', projectController.editProject)
router.get('/project/all', projectController.projectsAll)
router.get('/project/:id', projectController.projectData)
router.get('/project/search/:name', projectController.searchProject)

module.exports = router