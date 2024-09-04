const Tour = require('../models/tourModel');

const catchAsync = require('./../utils/catchAsync');

const APIFeatures = require('./../utils/apiFeatures');

const AppError = require('./../utils/appError');

exports.aliasTopTour = (req, res, next) => {
    req.query.sort='price,ratingsAverage';
    req.query.limit='5';
    req.query.fields = 'name,price,difficulty,summary,ratingsAverage';

    next();
}

exports.createTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body);
        res.status(201).json({
            status:'success',
            data:{
                tour:newTour
            }
        })
});

   
exports.getAllTours = catchAsync(async (req, res, next) => {

    const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().pagination();

        let query = features.mongoQuery;
        
        //EXECUTE THE QUERY
        const tours = await query; 

        //SEND THE RESPONSE
        res.status(200).json({
            status:"success",
            results:tours.length,
            data:{
                tours
            }
        })
});

exports.getTour = catchAsync(async (req, res, next) => {
    
    const tour = await Tour.findById(req.params.id);

    if(!tour){
        return next(new AppError('no tour available with the requested id',404));
    }
        res.status(200).json({
            status:"success",
            data: {
                tour
            }
        })
});

exports.updateTour = catchAsync(async (req, res, next) => {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    });

    if(!updatedTour){
        return next(new AppError('no tour available with the requested id',404));
    }
    res.status(200).json({
        status:"success",
        data:{
            tour:updatedTour
        }
    });
});

exports.deleteTour= catchAsync(async (req, res, next) => {
    const deletedTour = await Tour.findByIdAndDelete(req.params.id);

    if(!deletedTour){
        return next(new AppError('no tour available with the requested id',404));
    }

        res.status(204).json({
            status:"success",
            result:"deleted the tour successfully"
        })
});

exports.getTourStats = catchAsync(async (req, res, next) => {

    const tourStats = await Tour.aggregate([
        {$match:{ratingsAverage:{$gte:4.5}}},
        {$group:{
            _id:{$toUpper:'$difficulty'},
            numTours: {$sum:1},
            totalRatings:{$sum:'$ratingsQuantity'},
            avgRating:{$avg:'$ratingsAverage'},
            avgPrice:{$avg:'$price'},
            minPrice:{$min:'$price'},
            maxPrice:{$max:'$price'}
        }},
        {$sort:{totalRatings:1}},
        // {$match:{minPrice:{$lte:500}}}
    ])

    res.status(200).json({
        status:"success",
        data:{
            tourStats
        }
    })
});

exports.yearlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year*1;
        console.log(year);
        const tourPlans = await Tour.aggregate([
            {$unwind:'$startDates'},
            {$match:{startDates:{
                $gte:new Date(`${year},01,01`),
                $lte:new Date(`${year},12,31`)
            }}},
            {$group:{
                _id: '$startDates',
                numTours:{$sum:1},
                tourName:{$push:'$name'},
                // date:'$startDates'
            }},
            {$addFields:{
                month:{$month:'$_id'}
            }},
            {$project:{_id:0}},
            {$sort:{month:1}},
            {$limit:12}
        ]);
    
        res.status(200).json({
            status:"success",
            data:{
                tourPlans
            }
        })
});