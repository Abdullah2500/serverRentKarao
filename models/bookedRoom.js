const mongoose = require("mongoose");
const BookedRoomSchema = new mongoose.Schema({
room: {
  type:mongoose.Schema.Types.ObjectId,
  ref:"Rooms"
},
fee:{
  type:String,
},
bookedBy: {
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},
});

module.exports  = mongoose.model("BookedRoom", BookedRoomSchema);