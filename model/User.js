const mongoose = require('mongoose');
const Schema = mongoose.Schema;


///////////////////////////* Schema for User Data *////////////////////////////

const userSchema = new Schema({
    first_name:{
        type : String,
        required : true
    },
    last_name:{
        type : String,
        required : true
    },
    number:{
        type : String,
        minLength: 10,
        maxLength: 13,
        required : true,
        unique : true
    },
    password:{
        type : String,
        minLength: 4
    },
    g_password:{
        type : String,
        minLength: 4
    },
    email:{
        type : String,
        required : true,
        lowercase: true,        
        unique : true
    },
})

///////////////////////////* Exporting Part*////////////////////////////

const User = mongoose.model('User' ,userSchema ,'Users' );
module.exports = User;