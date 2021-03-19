const mongoose= require('mongoose')
const { default: validator } = require('validator')

const postSchema = new mongoose.Schema({
    image:
    { 
        type:String,
    },
    description:
    {
        type:String
    },
    user:
    {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    like:
    {
        type:Number,
        default:00
    }
},{
    timestamps:true
})


const Post= mongoose.model('Post',postSchema)


module.exports=Post