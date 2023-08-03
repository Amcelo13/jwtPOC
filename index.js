const dotenv = require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const app = express();
const connectDB = require('./config/connectDB')
const port =  process.env.PORT
const userRoutes = require('./routes/userRoutes')
app.use(cors());

//JSON
app.use(express.json());

//LOAD Routes

app.use('/api/users', userRoutes)




app.get('/',(req, res)=>{
    res.send('API is running good and welcome to the backend')
})

//Connect the database below CORS
connectDB()

app.listen(port, ()=>{
    console.log('🚀 Server listening on port 8000')
});