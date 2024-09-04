const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
    console.log("uncaught exception");
    console.log(err.name, err.message);
    process.exit(1);
})

const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});

const app = require('./app');

const DB = process.env.DATABASECONNECTIONSTRING.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);
mongoose.connect(DB).then(()=>{
    // console.log(con.connections)
    console.log('db connection established successfully');
})
///handling uncaught rejections on [process object]
.catch(err => console.log(err.message));
    


//STARTING THE SERVER
// console.log(process.env);
const port = 3000||process.env.PORT;
const server = app.listen(port, () => {
    console.log(`listening to the server: ${port}`);
})

process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    console.log("uncaught rejections shuttingdown the server");

    server.close(() => {
        process.exit(1);

    })
})