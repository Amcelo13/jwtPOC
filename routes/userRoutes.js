const express = require('express');
const router = express.Router()
const userController = require('../controllers/userController');
const { checkAuth } = require('../middlewares/auth-middleware');

//Route level Middleware - To protect routes and verify
router.use('/changePassword', checkAuth)
router.use('/loggedUser', checkAuth)



//Public routes
router.post('/register',userController.userRegistration)
router.post('/login',userController.userLogin)
router.post('/send-reset-password-email', userController.sendPasswordResetEmail)
router.post('/reset-password/:id/:token', userController.resetPassword)


//Protected routes by using milldleware
router.post('/changePassword',userController.changePassword)
router.get('/loggedUser',userController.loggedUser)
module.exports = router
