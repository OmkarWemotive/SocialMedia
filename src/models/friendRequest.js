const mongoose= require('mongoose')
const { default: validator } = require('validator')

const requestSchema = new mongoose.Schema({
    sender_id:
    { 
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    receiver_id:
    {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    status:
    {
        type:Number,
        default:0
    }
},{
    timestamps:true
})


const FrientRequest= mongoose.model('Request',requestSchema)


module.exports=FrientRequest