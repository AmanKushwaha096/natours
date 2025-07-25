const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
// const User = require('./userModel')

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, "A tour name must have less or equal to 40 characters"],
        minlength: [10, "A tour name must have more or equal to 10 characters"],
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'A tour must have duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either easy , medium , difficult '
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'rating must be above 1.0'],
        max: [5, 'rating must be below 5.0'],
        set : val => Math.round(val *10)/10
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                return val < this.price
            },
            message: 'Discount price should be below regular price'
        }
    },
    summary: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    },
    startLocation: {
        // geoJSON
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ]
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });

// tourSchema.virtual('durationWeeks').get(function () {
//     return this.duration / 7;
// })

// tourSchema.index({price : 1})
tourSchema.index({price : 1,ratingsAverage : -1})
tourSchema.index({slug : 1})
tourSchema.index({startLocation : '2dsphere'})

// Virtual populate
tourSchema.virtual('reviews',{
    ref : 'Review',
    foreignField : 'tour',
    localField : '_id'
})

tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name,{ lower: true });
    next();
})

tourSchema.pre(/^find/,function(next){
    this.populate({
        path: 'guides',
        select: '-__v -pwdChangedAt'
    });
    next()
}) 

// tourSchema.pre('save',async function(next){
//     const guidesPromises = this.guides.map(async id => await User.findById(id))
//     this.guides = await Promise.all(guidesPromises)
//    next() 
// })

// tourSchema.post('save',function(doc,next){
//     console.log(doc);
//     next();
// })

// tourSchema.pre('find',function(next){
//     this.find({secretTour : {$ne : true}});
//     next();
// })


const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

