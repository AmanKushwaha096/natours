const Tour = require('./../models/tourModel')
const Bookings = require('./../models/bookingModel')
const User = require('./../models/userModel')

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
exports.getOverview = catchAsync(async (req, res, next) => {
    // get tour data from collection
    const tours = await Tour.find();


    // build template 
    // render that template using tour data from 1
    res.status(200).render('overview', {
        title: 'All Tours',
        tours
    })
})
exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'review rating user'
    })

    if (!tour) return next(new AppError('There is no tour with that name ', 404))

    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour
    })
})

exports.getLoginForm = (req, res) => {
    res.status(200).render('login', {
        title: 'Login'
    })
}

exports.getSignupForm = (req, res) => {
    res.status(200).render('signup', {
        title: 'Sign up'
    })
}

exports.getAccount = (req, res) => {
    res.status(200).render('account', {
        title: 'Your account'
    })
}

exports.getMyTours = catchAsync(async (req, res, next) => {
    // Find all bookings 
    const bookings = await Bookings.find({ user: req.user.id })
    // find tours with the returned ids
    const tourIDs = bookings.map(el => el.tour)
    const tours = await Tour.find({ _id: { $in: tourIDs } })

    res.status(200).render('overview', {
        title: 'My tours',
        tours
    })
})

exports.updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
        email: req.body.email
    }, {
        new: true,
        runValidators: true
    })

    res.status(200).render('account', {
        title: 'Your account',
        user: updatedUser
    })


})