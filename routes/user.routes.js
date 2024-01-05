const express=require("express")
const UserModel = require("../model/user.model")
const bcrypt=require("bcrypt")
const jwt = require('jsonwebtoken');

const userRouter=express.Router()

userRouter.post("/signup",async(req,res)=>{
    const {name ,email, password}=req.body
    try {
        const user= await UserModel.findOne({email:email})
        if(user){
            res.status(200).json({msg:"User Already Exist!!"})
        }else{
            bcrypt.hash(password, 3, async(err, hash)=>{
                // Store hash in your password DB.
                if(err){
                    res.status(400).json({error:err.message})
                }else{
                    const newUser= new UserModel({name,email,password:hash})
                    await newUser.save()
                    res.status(200).json({msg:"User Added Successfully!!"})
                }
            });
        }
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})


userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body
    try {
        const user=await UserModel.findOne({email:email})
        if(!user){
            res.status(200).json({msg:"please signup first"})
        }else{
            bcrypt.compare(password, user.password, async(err, result)=>{
                if(result){
                    const token = jwt.sign({ foo: 'bar' }, 'shhhhh');
                    res.status(200).json({msg:"Login Successfull",token:token})
                }else{
                    res.status(200).json({msg:"Please check your Password"})
                }
            });
        }
    } catch (error) {
        res.status(400).json({error:error.message}) 
    }
})

userRouter.get("/",async(req,res)=>{
    try {
        const users=await UserModel.find()
        res.status(200).json({msg:users})
    } catch (error) {
        res.status(400).json({msg:error.message})
    }
})

userRouter.patch("/update/:id",async(req,res)=>{
    const payload=req.body
    const userId=req.params.id
    try {
        await UserModel.findByIdAndUpdate(userId,payload)
        res.status(200).json({msg:"User has been Updated!!"})
    } catch (error) {
        res.status(400).json({msg:error.message})
    }
})

userRouter.delete("/delete/:id",async(req,res)=>{
    const userId=req.params.id
    try {
        await UserModel.findByIdAndDelete(userId)
        res.status(200).json({msg:"User has been Deleted!!"})
    } catch (error) {
        res.status(400).json({msg:error.message})
    }
})

module.exports=userRouter