const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
   listId:{
    type: String,
    require: true
   },
   items:{
    type: String,
    max:500
   },
   
}, 
{timestamps:true}
);

module.exports = mongoose.model("Post", PostSchema);