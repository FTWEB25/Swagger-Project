const express=require("express")
const UserModel = require("../model/user.model")
const bcrypt=require("bcrypt")
const jwt = require('jsonwebtoken');

const userRouter=express.Router()
// General schema starts
  
  
/**
 * @swagger
 * tags:
 *   name: User
 *   description: All routes related to user management
 */

   
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the user.
 *         name:
 *           type: string
 *           description: Name of the user.
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the user.
 *         password:
 *           type: string
 *           format: password
 *           description: Encrypted password of the user.
 *       required:
 *         - name
 *         - email
 *         - password
 */

/**
 * @swagger
 * /user:
 *   get:
 *     tags:
 *       - User
 *     summary: Get all users
 *     description: Retrieve all users.
 *     responses:
 *       '200':
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       '400':
 *         description: Error getting users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 */


userRouter.get("/",async(req,res)=>{
    try {
        const users=await UserModel.find()
        res.status(200).json({msg:users})
    } catch (error) {
        res.status(400).json({msg:error.message})
    }
})


/**
 * @swagger
 * /user/signup:
 *   post:
 *     tags:
 *       - User
 *     summary: Register a new user
 *     description: Create a new user account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: User successfully added.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *       '400':
 *         description: Error adding user or user already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */


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

/**
 * @swagger
 * /user/login:
 *   post:
 *     tags:
 *       - User
 *     summary: Login user
 *     description: Authenticate user credentials and generate a token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       '200':
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 token:
 *                   type: string
 *       '400':
 *         description: Error in login process.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

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

/**
 * @swagger
 * /user/update/{id}:
 *   patch:
 *     tags:
 *       - User
 *     summary: Update user details
 *     description: Update user details by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: User has been updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *       '400':
 *         description: Error updating user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 */


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
/**
 * @swagger
 * /user/delete/{id}:
 *   delete:
 *     tags:
 *       - User
 *     summary: Delete user
 *     description: Delete user by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       '200':
 *         description: User has been deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *       '400':
 *         description: Error deleting user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 */
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