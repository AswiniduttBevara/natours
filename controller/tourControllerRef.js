const fs = require('fs');

const express = require('express');

const app = require('../app');

// app.use(express.json());

///////////////////////////////////////
// Running the application using json files on folder

// exports.checkId = (req, res, next, val) => {
//     console.log(`id is: ${+val} type of: ${typeof +val}`);
//     if(val >= tours.length){
//     // if(!tour){
//         return res.status(404).json({
//             status:'fail',
//             message:'invalid id'
//         })
//     }
//     next();
// }

// exports.checkBody = (req, res, next) => {
//     const data = req.body;
//     console.log('data=>',data);
//     console.log('data=>',data['price']);
//     console.log('data=>',data['name']);
//     if(!data['name'] || !data['price']){
//         return res.status(400).json({
//             status:'fail',
//             message:'info should contain name and price'
//         })
//     }
//     next();
// }

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8'));

exports.getTours = (req, res) => {
// Running the application using json files on folder

    // res.status(200).json({
        // status:'success',
        // result: tours.length,
        // requstedAt:req.requestTime,
        // data:{
        //     tours
        // }
    // })
};

exports.updateTour = (req, res) => {
// Running the application using json files on folder
    
    // const id = +req.params.id;
    // const tour = tours[id];
    
    // // if(+req.params.id > tours.length){
    // if(!tour){    
    //     return res.status(404).json({
    //         status:'fail',
    //         message:"Invalid id"
    //     })
    // }

    // const updatedTour = {...tour, ...req.body};
    // tours[id] = updatedTour;

    // fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
    //     if(err){
    //         return res.status(404).json({
    //             status:'fail',
    //             message:"Error in writing the updated tour to the json file"
    //         })    
    //     }
        // res.status(200).json({
        //     status:'success',
        //     tour:updatedTour
        // })
    // })
};

exports.deleteTour = (req, res) => {
// Running the application using json files on folder

    // const id = +req.params.id;
    // const deletedTour = tours[id];
    // const updatedTours = tours.filter(el => el.id !== id);

    // fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(updatedTours), (err) => {
    //     res.status(204).json({
    //         status:'success',
    //         tour:deletedTour
    //     })
    // })

};

exports.getTour = (req, res) => {
// Running the application using json files on folder

    // const id = req.params.id * 1;
    // console.log(req.params);
    // const id = +req.params.id;

    // const tour = tours.find(el => el.id === id);
    

    // res.status(200).json({
    //     status:'success',
    //     data:{
    //         tour
    //     }
    // })
}

exports.createTour = (req, res) => {
// Running the application using json files on folder

    // const newTour = req.body;
    // const id = tours[tours.length-1].id+1;
    // const newTour = {id, ...req.body};

    // tours.push(newTour);

    // fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
    //     res.status(201).json({
    //         status:'success',
    //         data:{
    //             tour: newTour
    //         }
    //     })
    // });
};
