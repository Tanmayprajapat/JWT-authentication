const mongoose = require('mongoose');

const userScheme =new mongoose.Schema({
    username:{type:String ,required:true,unique:true},
    password:{type:String,required:true}
},{collection:'users'})

const model=mongoose.model('userScheme',userScheme)

module.exports = model 