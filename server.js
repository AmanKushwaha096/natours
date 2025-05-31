// SERVER STARTED
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config({path: './config.env'});
const app = require('./app')

const db = process.env.DATABASE;

mongoose.connect(db,{
    useNewUrlParser :  true,
    useUnifiedTopology :true
}).then((con)=>{
    console.log('Connection successfull')
});


const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
})

process.on('unhandledRejection',err =>{
    console.log(err.name,err.message);
    server.close(()=>{
        process.exit(1);
    })
})