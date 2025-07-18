const express = require('express')
const router = express.Router({mergeParams: true});
const reviewController = require('./../controllers/reviewController')
const authController = require('./../controllers/authController')

router.use(authController.protect)

router.route('/').get(reviewController.viewAllReviews).post(authController.protect,authController.restrictTo('user'),reviewController.setTourUserIds,reviewController.addReview)
router.route('/:id').get(reviewController.getReview).patch(authController.restrictTo('user', 'admin'), reviewController.updateReview).delete(authController.restrictTo('user','admin'), reviewController.deleteReview)

module.exports = router;