const mongoose= require('mongoose')
const { default: validator } = require('validator')

const commentSchema = new mongoose.Schema({
    comment:
    { 
        type:String
    },
    post_id:
    {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Post'
    },
    user_id:
    {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }

},{
    timestamps:true
})

commentSchema.virtual('commentLike',{
    ref:'Like',
    localField:'post_id',
    foreignField:'post_id'
})


const Comment= mongoose.model('Comment',commentSchema)


module.exports=Comment