const mongoose = require("mongoose");
const { isEmail } = require("validator");
const eventModel = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
  },
  eventName: {
    type: String,
    require: true,
  },
  location: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
  },
  startDate: {
    type: Date,
    require: true,
  },
  endDate: {
    type: Date,
    require: true,
  },
  excelFile:{
type:String,

  },
  users:[
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            require:true
         },
         firstName:{
            type:String,
            require:true
         },
         lastName:{
            type:String,
            require:true
        },
        age:{
            type:Number,
            require:true
        },

    }
  ]
});

module.exports = mongoose.model("event", eventModel);
