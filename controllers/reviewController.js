const Review = require('./../models/reviewModel') 
// const catchAsync = require('./../utils/catchAsync')
const factory = require('./handlerfactory')

exports.setTourUserIds = (req,res,next) =>{
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next()
}

exports.addReview = factory.createOne(Review)
exports.viewAllReviews = factory.getAll(Review)
exports.getReview = factory.getOne(Review)
exports.updateReview = factory.updateOne(Review)
exports.deleteReview = factory.deleteOne(Review)