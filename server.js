require('dotenv').config()
//pull port from .env, give default value of 4000
const { PORT = 4000, DATABASE_URL } = process.env 
//import EXPRESS
const express = require('express')
//create application
const app = express()
//import mongoose
const mongoose = require('mongoose')
//import middlewares
const cors = require('cors')
const morgan = require('morgan')
///////////////////////////////
// DATABASE CONNECTION
////////////////////////////////
// Establish Connection
mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
// Connection Events
mongoose.connection
    .on("open", () => console.log("You are connected to mongoose"))
    .on("close", () => console.log("You are disconnected from mongoose"))
    .on("error", (error) => console.log(error));

/////////////////////////////////
//MODELS/////
/////////////////////////////////
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String,
})

const People = mongoose.model('People', PeopleSchema)

/////////////////////////////////
//Middleware/////
/////////////////////////////////
app.use(cors())
app.use(morgan('dev')) //logging
app.use(express.json()) //prse json bodies

/////////////////////////////////
//ROUTES/////
/////////////////////////////////
app.get('/', (req, res) => {
    res.send('Hello World')
})

//PEOPLE INDEX ROUTE
app.get('/people', async (req, res) =>{
    try {
        //send all people
        res.json(await People.find({}));
    } catch (error) {
        //send error
        res.status(400).json(error);
    }
});

//PEOPLE CREATE ROUTE
app.post('/people', async (req, res) =>{
    try {
        //send all people
        res.json(await People.create(req.body));
    } catch (error) {
        //send error
        res.status(400).json(error);
    }
});

//PEOPLE DELETE ROUTE
app.delete('/people/:id', async (req, res) => {
    try {
        res.json(await People.findByIdAndRemove(req.params.id))
    } catch (error) {
        res.status(400).json(error)
    }
})

//PEOPLE UPDATE ROUTE
app.put('/people/:id', async (req, res) => {
    try {
        res.json(await People.findByIdAndUpdate(req.params.id, req.body, { new: true }))
    } catch (error) {
        res.status(400).json(error)
    }
})

/////////////////////////////////
//LISTENER/////
/////////////////////////////////
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`))