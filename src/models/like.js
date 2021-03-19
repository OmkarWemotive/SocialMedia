const mongoose= require('mongoose')
const { default: validator } = require('validator')

const likeSchema = new mongoose.Schema({
    user_id:
    { 
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    post_id:
    {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Post'
    },
    like:
    {
        type:Boolean
    }
},{
    timestamps:true
})


const Like= mongoose.model('Like',likeSchema)


module.exports=Like