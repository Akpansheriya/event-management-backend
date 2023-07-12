const mongoose = require("mongoose");
const {isEmail} = require("validator")
const adminModel = new mongoose.Schema({
    firstName:{
        type:String,
        require:true
    },
    lastName:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        validate: [ isEmail, 'invalid email' ]
    },
    password:{
        type:String,
        require:true
    },
    emailToken:{
        type:String,
        
    },
    isVerified:{
        type:Boolean
    }
})


module.exports = mongoose.model("admin",adminModel)