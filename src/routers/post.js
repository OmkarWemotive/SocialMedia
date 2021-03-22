const express = require('express')
const multer=require('multer')
const User= require('../models/user')
const Post= require('../models/post')
const Comment = require('../models/comment')
const Like = require('../models/like')
const auth=require('../middlware/auth')
const FrientRequest =require('../models/friendRequest')
const router = new express.Router()



//----------------------------Upload Files middleware-------------------------------------------------

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img')
    },
    filename: function (req, file, cb) {
        
        cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })
//----------------------------------User Added New Post --------------------------------------------
// upload.single('avatar')
router.post('/add-post',auth,upload.single('avatar'),async(req,res)=>{
   
    try
    {
        const path= '/img/'+req.file.originalname
        // const path= '/img/d2.jpg'
        const post= new Post({
        "image":path,
        "description":req.body.description,
        "user":req.user._id
        })
        const post1=await post.save()
        res.send(post1)
    }
    catch(e)
    {
        res.status(400).send(e)
    }
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

//--------------------------------- Show single Post ------------------------------------
router.get('/post/:id',async(req,res)=>{
    const _id = req.params.id
    console.log(_id)
    try
    {
        const post=await Post.findById(_id)
        if(!post)
        {
            return res.status(404).send()
        }
        res.set('Content-Type','image/jpg')
        res.send("src"+post.image)
    }
    catch(e)
    {
        res.status(500).send()
    }
})

//--------------------------------------Comment To Post-----------------------------------------------
router.post('/comment',auth,async(req,res)=>{

    try
    {
        const comment = new Comment({
            "user_id":req.user._id,
            "post_id":req.body.post_id,
            "comment":req.body.comment
        })
        const cmt=await comment.save()
        await Post.findByIdAndUpdate(req.body.post_id, { $inc:{ comment:1 } }, (err, docs)=>{ 
            if(err){ console.log(err) } 
        });
        res.send(cmt)
    }
    catch(e)
    {
        res.status(400).send(e)
    }
    
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

//--------------------------------------Like To Post-----------------------------------------------
router.post('/like',auth,async(req,res)=>{

    try
    {
        const like = new Like({
            "user_id":req.user._id,
            "post_id":req.body.post_id,
            "like":req.body.like
        })
        const lk=await like.save()
        res.send({lk })
        // const user = await Like.find({user_id:req.user._id,post_id:req.body.post_id})
        // if(!user)
        // {
        //     const lk=await like.save()
        //     await Post.findByIdAndUpdate(req.body.post_id, { $inc:{ like:1 } }, (err, docs)=>{ 
        //         if(err){ console.log(err) } 
        //     });
        //     res.send({lk })
        // }
        // else
        // {
            
        //     res.status(400).send("u have already like this post")
        // }
    }
    catch(e)
    {
        res.status(400).send(e)
    }
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

//--------------------------------------Dislike To Post-----------------------------------------------
router.post('/dislike',auth,async(req,res)=>{

    try
    {
        const status = await Like.deleteMany({ 'user_id': req.user._id,'post_id':req.body.post_id });
    
        await Post.findByIdAndUpdate(req.body.post_id, { $inc:{ like:-1 } }, (err, docs)=>{ 
            if(err){ console.log(err) } 
        }); 

        res.send({status})
    }
    catch(e)
    {
        res.status(400).send(e)
    }
    
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})
//----------------------------------------Get all users Post--------------------------------------------------

router.get('/view-all-post',async(req,res)=>{

    try
    {
        const post=await Post.find({}).populate({path:'user',select:'name'}).exec()
        
        res.send(post)
        // res.send(post.like)
    }
    catch(e)
    {
        res.status(500).send()
    }


}) 
//----------------------------------------Get all friends Post--------------------------------------------------

router.get('/view-friends-post',auth,async(req,res)=>{

    try
    {
        const myFriends = await FrientRequest.find({receiver_id:req.user._id,status :1}).populate({path:'sender_id',select:'name'}).exec()

        const post=await Post.find({}).populate({path:'user',select:'name'}).exec()
        
        const totalPost =myFriends.filter((myfriend)=>{ 
           return myfriend.sender_id._id === post.user._id
        })
        
        res.send({myFriends,post,totalPost})
        // res.send(post.like)
    }
    catch(e)
    {
        res.status(500).send()
    }


}) 

//----------------------------------------Get single Post--------------------------------------------------

router.get('/view-post/:id',async(req,res)=>{

    const _id = req.params.id
    
    try
    {
        const post=await Post.findById(_id)
        const comment=await Comment.find({post_id:post._id}).populate({path:'user_id',select:'name'}).exec()

        const like=await Like.find({post_id:post._id}).populate({path:'user_id',select:'name'}).exec()

        res.send({post, comment, like})
        // res.send(post.like)
    }
    catch(e)
    {
        res.status(500).send()
    }


}) 
//----------------------------------------View Comment--------------------------------------------------

router.post('/view-comment',async(req,res)=>{

    try
    {
        const _id = req.body.id
        const comment=await Comment.find({post_id:_id}).populate({path:'user_id',select:'name'}).exec()
        res.send(comment)
        // res.send(post.like)
    }
    catch(e)
    {
        res.status(500).send()
    }
}) 
//----------------------------------------View like--------------------------------------------------

router.post('/view-like',async(req,res)=>{

    const _id = req.body.id
    try
    {
        const like=await Like.find({post_id:_id}).populate({path:'user_id',select:'name'}).exec()
        res.send(like)
        // res.send(post.like)
    }
    catch(e)
    {
        res.status(500).send()
    }
}) 

//------------------------------------------Get All Post------------------------------------------------

router.get('/my-post',auth,async(req,res)=>{
        try
        {
            const userPost = await Post.find({user:req.user._id})
            res.send(userPost)
        }
        catch(e)
        {
            res.status(500).send()
        }
})

//----------------------------------------Delete Post--------------------------------------------------

router.delete('/delete-post/:id',async(req,res)=>{

    const _id = req.params.id
    
    try
    {
        const post=await Post.deleteOne({ _id })
        const cmt = await Comment.deleteMany({post_id:_id})
        const like=await Like.deleteMany({post_id:_id})
        res.send({post, cmt, like})
    }
    catch(e)
    {
        res.status(500).send()
    }


})




module.exports=router