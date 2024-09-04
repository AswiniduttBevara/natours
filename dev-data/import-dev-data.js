const fs = require('fs');

const Tour = require('./../models/tourModel');

const dotenv = require('dotenv');
dotenv.config({path:`${__dirname}/../config.env`});


const mongoose = require('mongoose');
// console.log(process.env.DATABASECONNECTIONSTRING);
const DB = process.env.DATABASECONNECTIONSTRING.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);

mongoose.connect(DB)
.then(() => console.log("database connection successfull"))
.catch(err => console.log(err));

const tourData = JSON.parse(fs.readFileSync(`${__dirname}/data/tours-simple.json`, 'utf-8'));

const fileImport = async () => {
    await Tour.create(tourData);
    console.log("Data successfully uploaded to database");
    process.exit();
}

const deleteData = async () => {
    await Tour.deleteMany();
    console.log("Documents deleted from the collection");
    process.exit();
}

console.log(process.argv);

if(process.argv[2] === '__import'){
    fileImport();
}else if(process.argv[2] === '__delete'){
    deleteData();
}

