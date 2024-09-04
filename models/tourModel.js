const slugify = require('slugify');
const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'A tour must contain name'],
        unique:true,
        trim:true,
        minlength:[10, "The name of the tour should contain atleast 10 characters"],
        maxlength:[40, "The name of the tour should be less than 40 characters"]
    },
    slug:String,
    secretTour:{
        type:Boolean,
        default:false
    },
    ratingsAverage:{
        type: Number,
        default:4.5,
        min:[1, "should be atleast equal or above 1"],
        max:[5, "should be equal or less than 5"]
    },
    ratingsQuantity:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        required:[true, 'A tour must contain price']
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        select:false
    },
    summary:{
        type: String,
        required:[true, "summary is required for tour"],
        trim:true
    },
    startDates:{
        type: [Date]
    },
    duration:{
        type:Number,
        required:[true, "A tour must have duration"]
    },
    maxGroupSize:{
        type:Number,
        required : [true, 'A tour must have group size']
    },
    difficulty:{
        type: String,
        required:[true, 'A tour must have a diffculty'],
        enum: {
            values:["easy", "medium", "difficult"],
            message:"difficulty level should be in between these three ['easy', 'medium', 'difficult']"
        }
    },
    description:{
        type:String,
        trim:true
    },
    priceDiscount: {
        type: Number,
        validate:{
            validator:function (val){
                return val < this.price;
            },
            messsage:"discount price [{val}] should be less than the main price"
        }
    },
    imageCover:{
        type:String,
        required:[true, 'A tour must have a cover image']
    },
    images:[String],
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

/////////////////////////////////////////////////
// to display data on browser not to save on database
tourSchema.virtual('durationWeeks').get(function(){
    return this.duration/7;
});

//////////////////////////////////////////////
//Document middleware
//pre-save hook runs on [save or create]

tourSchema.pre('save', function(next){
    this.slug = slugify(this.name, {lower:true});

    next();
});

tourSchema.pre('save', function(next){
    // console.log('before=>', this);
    next();
})

//post-save hook
tourSchema.post('save', function(doc, next){
    // console.log('after=>',doc);
    next();
})

////////////////////////////////////////////////////
//Query middleware for mongoose

//pre-find hook
tourSchema.pre(/^find/, function(next){
    this.find({secretTour:{$ne:true}})
    this.startTime = Date.now();
    next();
})

//post-find hook
tourSchema.post(/^find/, function(docs, next){
    console.log(`Query took ${Date.now() - this.startTime} milliseconds`);
    // console.log('docs=>',docs);
    next();
})

////////////////////////////////////
//Aggregate middleware

//pre-aggregate hook
tourSchema.pre('aggregate', function(next) {
    this.pipeline().unshift({$match:{secretTour:{$ne:true}}});
    next();
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;