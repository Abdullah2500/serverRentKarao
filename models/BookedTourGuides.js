const mongoose = require("mongoose");
const BookedTourGuidesSchema = new mongoose.Schema({
tourGuide: {
  type:mongoose.Schema.Types.ObjectId,
  ref:"Tourguide"
},
fee:{
  type:String,
},
bookedBy: {
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},
});

module.exports  = mongoose.model("BookedTourGuide", BookedTourGuidesSchema);