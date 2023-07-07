const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({

    name:{
        type: String,
        required: true,
        trim: true
    },

    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },

    password:{
        type: String,
        required: true,
        trim: true,
        // minlength: 7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Enter a valid password')
            }else if(value.length<7){
                throw new Error('Enter a valid password')
            }
        }
    },

    notes:[
        {
            type: String
        }
    ]

})

const User = mongoose.model('User', userSchema)

module.exports = User