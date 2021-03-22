const express = require('express')
const multer=require('multer')
const User= require('../models/user')
const Post= require('../models/post')
const FrientRequest =require('../models/friendRequest')
const auth=require('../middlware/auth')
const bcrypt =require('bcryptjs')
const router = new express.Router()



//----------------------------------------USER save Operation with async await-------------------

router.post('/save-user',async(req,res)=>{
    const user=new User(req.body)
    // console.log(req.body)
    try
    {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({token})
    }
    catch(e)
    {
        res.status(400).send(e)
    }
})
//----------------------------------------USER Login Operation----------------------------------
router.post('/login',async(req,res)=>{
    try
    {
        // res.send(req.body)
        const user=await User.findByCredentials(req.body.email,req.body.password)
       // console.log(user)
        const token =await user.generateAuthToken()

        res.status(200).send({token})
        
        
    }
    catch(e)
    {
        res.status(400).send(e)
    }
})
//----------------------------------------USER Logout Operation----------------------------------Not Work
router.post('/logout',auth,async (req,res)=>{
    
    try
    {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token != req.token
        })
        await req.user.save()
        res.send("Logout Successfully, Thank You...!")
    }
    catch(e)
    {
        res.status(500).send(e)
    }
})
//----------------------------------fetch all recors of users with async await ----------------------
router.get('/users',async(req,res)=>{
    
    try
    {
        const users =await User.find({})
        res.send(users)
    }
    catch(e)
    {
        res.status(500).send()
    }
})



//-----------------------------------Refactor Update User ----------------------------

router.patch('/update',auth,async (req,res)=>{
    
    try
    {
        // const user=new User(req.body)
        // await user.save()
        // res.send(user)
         req.body.password= await bcrypt.hash(req.body.password,8)
        // res.send(password)
        const update_key = {"name":req.body.name,
                        "password":req.body.password,
                        "email":req.body.email,
                        "mobile":req.body.mobile,
                        "dob":req.body.dob}
        const user=  await User.where({ _id: req.user._id }).update({ $set: update_key }).exec(); 
        res.send(user)
    }
    catch(e)
    {
        res.status(400).send(e)
    }
})
//----------------------------------Read Profile ---------------------------------------------------

router.get('/show-profile',auth,async(req,res)=>{
    
    res.send(req.user)
})

//----------------------------------Search User-------------------------------------------------------
router.post('/search',async(req,res)=>{
    const userName=req.body.name
    // res.send(userName)
    try
    {
        const user = await User.find({ 'name' : { $regex : userName, $options : 'i' } })
        res.send(user)
    }
    catch(e)
    {
        res.status(400).send(e)
    }


})

//-------------------------------------Send friend Request----------------------------------------------

router.post('/send-request', auth,async(req,res)=>{

    const senderId=req.user._id
    const receiverId=req.body.id

    try
    {
        const friend = new FrientRequest({'sender_id':senderId,'receiver_id':receiverId})
        const reqStatus = await friend.save()
        res.send(reqStatus)
    }
    catch(e)
    {
        res.status(400).send(e)
    }

})
//-------------------------------------Cancle friend Request----------------------------------------------

router.post('/cancle-request', auth,async(req,res)=>{
    const senderId=req.user._id
    const receiverId=req.body.id
    try
    {
        const reqStatus = await FrientRequest.deleteMany({'sender_id':senderId,'receiver_id':receiverId});
        res.send(reqStatus)
    }
    catch(e)
    {
        res.status(400).send(e)
    }
})
//-------------------------------------My Request-------------------------------------------------------

router.get('/my-request',auth,async(req,res)=>{
    try
    {
        const reqStatus = await FrientRequest.find({receiver_id:req.user._id,status :0}).populate({path:'sender_id',select:'name'}).exec()
        res.send(reqStatus)
    }
    catch(e)
    {
        res.status(400).send(e)
    }
})
//----------------------------------Friend Request Status--------------------------------------------------
// 0 : arrived,
// 1 : accepted,
// 2 : reject,
router.post('/request-status', auth,async(req,res)=>{
    const senderId= req.body.id
    const receiverId=req.user._id
    const statusCode = req.body.status
    try
    {
        let reqStatus
        if(statusCode=== 1)
        {
            reqStatus=  await FrientRequest.where({ sender_id: senderId ,receiver_id: receiverId })
                                           .update({ $set: { 'status':1 } }).exec(); 
        }
        if(statusCode=== 2)
        {
            reqStatus = await FrientRequest.deleteOne({'sender_id':senderId,'receiver_id':receiverId});
        }
        res.send(reqStatus)
    }
    catch(e)
    {
        res.status(400).send(e)
    }
})
//----------------------------------------my friends------------------------------------------------
router.get('/my-frinds',auth,async(req,res)=>{
    try
    {
        const reqStatus = await FrientRequest.find({receiver_id:req.user._id,status :1}).populate({path:'sender_id',select:'name'}).exec()
        res.send(reqStatus)
    }
    catch(e)
    {
        res.status(400).send(e)
    }
})







module.exports=router
