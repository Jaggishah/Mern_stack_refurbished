const router = require('express').Router();
const { error } = require('console');
const User = require('../models/userModel.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middlwares/authMiddleware.js')

// new user registration

router.post('/register',async(req,res)=>{
    try{
        // check if  user already exists
        const user = await User.findOne({email:req.body.email});
        if(user){
            // return res.send({
            //     success : false,
            //     message : 'User already exits'
            // });
            throw new Error('User already Exists')
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt);
        req.body.password = hashedPassword;

        const newUser = new User(req.body);
        await newUser.save();
        res.send({
            success:true,
            message:"User created successfully",
        });

    }catch(err){
        res.send({
            success:false,
            message : err.message
        })
    }
});

// user login

router.post('/login',async (req,res)=>{
    try{
        // check if user exists
        const user = await User.findOne({email:req.body.email});
        if(!user){
            throw new Error('User not Found');
        }
        // compare password
        const validpassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!validpassword){
            throw new Error("Invalid password");
        }
        // create and assign token

        const token = jwt.sign({userid:user._id},process.env.jwt_secret,{expiresIn:'1d'});
        


        res.send({
            success:true,
            message:"user logged in successfully",
            data : token
        });

    }catch(err) {
        res.send({
            success:false,
            message: err.message,
        })
    }
})

// get current user
router.get('/get-current-user', authMiddleware, async (req,res) => {
    try{
        // get user 
      const user = await User.findById(req.body.userid);
      res.send({
        success:true,
        message:"User Fetched successfully",
        data: user,
      })

    }catch(err){
        res.send({
            success: false,
            message:err.message,
        })
    }
})

module.exports =router;