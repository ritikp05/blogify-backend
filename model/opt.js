const mongoose = require("mongoose");

const optSchema = mongoose.Schema({
  otp: {
    required: true,
    type: "string",
  },
  email: {
    required: true,
    type: "string",
 
  },
  time:{
    type: Date,
    default: Date.now
  },

});

const Otp=mongoose.model("Otp",optSchema);

module.exports=Otp;