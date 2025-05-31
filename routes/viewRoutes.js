const express = require('express')
const viewController = require('./../controllers/viewsController')
const router = express.Router();
const authControlller = require('../controllers/authController')
const bookingController = require('../controllers/bookingController')


router.get('/',bookingController.createBookingCheckout,authControlller.isLoggedIn,viewController.getOverview)
router.get('/login', authControlller.isLoggedIn,viewController.getLoginForm)
router.get('/signup',viewController.getSignupForm)
router.get('/tour/:slug', authControlller.isLoggedIn,viewController.getTour)
router.get('/me',authControlller.protect,viewController.getAccount)
router.get('/my-tours',authControlller.protect,viewController.getMyTours)


// router.post('/submit-user-data',authControlller.protect,viewController.updateUserData)

module.exports = router;
