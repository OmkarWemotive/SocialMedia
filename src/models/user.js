
const mongoose= require('mongoose')
const { default: validator } = require('validator')
const bcrypt =require('bcryptjs')
const jwt =require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name:
    { 
        type:String,
        required:true
    },
    email:
    {
        type:String,
        unique :true,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value))
            {
                throw new Error('Email is Invalid')
            }
        }
    },
    password:
    {
        type:String,
        required:true,
        minlength :2,
        trim:true,
       
    },
    mobile:
    { 
        type:Number,
        minlength :10
    },
    dob:
    { 
        type:Date,
        
    },
    gender:
    { 
        type:String,
        
    },
    tokens:
    [{
        token :
        {
            type:String,
            required:true
        }
    }],
    avatar:
    {
        type:String
    }
},{
    timestamps:true
})



userSchema.methods.generateAuthToken=async function()
{
    const user =this
    const token = jwt.sign({_id:user._id.toString()},'thisisnodedemo')

    user.tokens=user.tokens.concat({ token })
    await user.save()
    return token
}


userSchema.statics.findByCredentials=async(email,password)=>{
    const user = await User.findOne({ email })
    
    if(!user)
    {
        throw new Error('Unable to Login')
    }
    const isMatch= await bcrypt.compare(password,user.password)
    // console.log(isMatch)
    if(!isMatch)
    {
        throw new Error('Wrong Password')
    }
    return user
    // console.log(user)

}


// hash plain text password before saving
userSchema.pre('save',async function(next){
    const user =this

    if(user.isModified('password'))
    {
        user.password= await bcrypt.hash(user.password,8)
    }
    next()
})




const User= mongoose.model('User',userSchema)


module.exports=User