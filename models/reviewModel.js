// review / rating / created at / referenc to tour / ref to user

const mongoose = require("mongoose");
const Tour = require('./tourModel')
const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'A review must have its content']
    },
    rating: {
        type: Number,
        minlength: [1, 'rating must be above 1.0'],
        maxlength: [5, 'rating must be below 5.0']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    tour:
    {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a tour']
    }
    ,
    user:
    {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user']

    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)

reviewSchema.index({tour : 1 , user : 1 },{unique : true})

reviewSchema.pre(/^find/, function (next){
    // this.populate({
    //     path:  'tour',
    //     select: 'name'
    // }).populate({
    //     path : 'user',
    //     select : 'name photo'
    // })
    // next()

    
    this.populate({
        path : 'user',
        select : 'name photo'
    })
    next()
})

reviewSchema.statics.calcAverageRatings = async function(tourId){
    const stats = await this.aggregate([
        {
            $match : {tour : tourId}
        },
        {
            $group : {
                _id : '$tour',
                nRating : {$sum : 1},
                avgRating : {$avg : '$rating'}
            }
        }
    ])
    // console.log(stats);
    await Tour.findByIdAndUpdate(tourId,{
        ratingsQuantity : stats[0].nRating,
        ratingsAverage: stats[0].avgRating
    })
}

reviewSchema.post('save',function(  ){
    this.constructor.calcAverageRatings(this.tour)
  
})



const Review = mongoose.model('Review', reviewSchema)

module.exports = Review