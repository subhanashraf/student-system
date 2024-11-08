const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const db = require('./config/connection')
const router = require('./router/router')
const path = require('path')
const app = express();
app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json())
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, './uploads')));
app.use('/api',router)


app.get('/',(req,res)=>{
    res.status(200).send('Backend is working slach route')
})

app.listen(4000,(errr)=>{
if (errr) {
    console.log('some error your code');
}
else{
    console.log('Backend is working');
    
}
})