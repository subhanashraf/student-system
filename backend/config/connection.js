const mongoose = require('mongoose');


 mongoose.connect(`${'mongodb://localhost:27017'}/attendance`).then(()=>{
    console.log('data base connection done');
 }).catch((error)=>{
    console.log(`Some error in your data base ${error}`);
 })