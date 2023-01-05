const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 
///set Schema variable just to shorten code

const PostSchema = new Schema({
    id:Number, 
    title:String, 
    date:Date, /// 1999-09-28
    imageURL:String,
    tags: [{type: String}]
});

module.exports = mongoose.model('Post', PostSchema);
