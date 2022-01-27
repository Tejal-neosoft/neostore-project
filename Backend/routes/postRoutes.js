import  express from 'express';
import registerModel from '../db/RegisterSchema.js'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import multer from 'multer'
const saltRounds = 10
const jwtSecret="asd889asds5656asdas887";
const router = express.Router();

//directory for storing images
const DIR = '../neostore-frontend/public/images/';
//storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null,"user" + '-' + fileName)
    }
});

//multer
var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

//for email 
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tejal123supe@gmail.com',
        pass: '02512602072'
  }
});

//registeration
router.post("/addpost", async (req, res) => {
     req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
     // checking if email alredy exists
    registerModel.findOne({email:req.body.email}, (err,data)=>{
        if(err){
            res.json({"err":1, "msg":"Something went wrong in checking data"})
        }
        else if(data== null){
            // adding data in register model
            let ins = new registerModel({ firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, contact: req.body.contact,  password: req.body.password,gender:req.body.gender})
            ins.save((e) => {
                if (e) {
                    res.json({"err":1, "msg":"Something went wrong in adding data"})
                }
                else {
                    res.json({"err":0, "msg":"New User added"})
                }
            })
        }
       else{   
        res.json({"err":0,"msg":"User already exist"})
       }
    })
})
//login route
router.post("/login", (req,res)=>{

    let hashbcrypt = false
    registerModel.find({}, (err, data)=>{
        if(err){
            console.log(err)
        }
        else{
            //checks if the email is present in the db matches with the req email and then compares the password
            data.map(ele=>{
                if(ele.email === req.body.email){
                   hashbcrypt = bcrypt.compareSync(req.body.password, ele.password) 
                    if(hashbcrypt){
                        const token = encryptData(ele);
                        res.json({"err":0,"msg":"Login Success","token":token})
                    }
                }
            })
            if(!hashbcrypt){
                res.json({"err":1, "msg":"Email or Password does not Match"})
            }
        }
    })
})

//forget password
router.post("/forgetservice",(req,res)=>{

    registerModel.findOne({email:req.body.email},(err,data)=>{
        if(err) throw err;
        else if(data===null){
            res.json({"err":1,"msg":"User Not Found"})
        }
        else{
            // generate otp
            let otp = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
              // send otp to mail
            let mailOptions= {
                from:"tejal123supe@gmail.com",
                to:req.body.email,
                subject:" Password reset",
                html:  `<!DOCTYPE html>
                <html>
                <head>
                <style>
                .ot{
                    color:red;
                    font-weight: bold;
                }
                .n{
                    font-weight: bold;
                    font-size: 20px;
                }
                .ot1{
                    font-weight: bold;
                    color:red;
                    font-size: 25px;
                }
                </style>
                </head>
                <body>
                <h1>Neo<span class="ot1">STORE</span></h1>
                <hr/>
                Hello <span class="n"> ${data.firstname+' '+ data.lastname} </span>,
                <div>A password reset for your account was requested.</div>
               <div> Your OTP for Neo<span class="ot">STORE</span> password reset is <span class="ot1">${otp}</span> </div>
               <div>Note that this OTP is valid for 24 hours. After the time limit has expired, you will have to resubmit the request for a password reset.</div> <br/>
               <div>If you did not make this request, please Contact Us. </div>
                </body>
    </html>`
            }
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            res.json({"err":0,"otp":otp})
            


        }
    })

})
//reser password
router.post("/resetpass",(req,res)=>{
    req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
    //finding email in db and reset the password
    registerModel.updateOne({email:req.body.email},{$set:{password:req.body.password}} ,(err,data)=>{ 
        if(err) throw err;
        else{
            res.json({"err":0,"msg":"Reset Password Successful"})

        }
    })
})


//editing profile data
router.post("/profileeditService",(req,res) =>{
    registerModel.findOneAndUpdate({email: req.body.originalEmail}, 
    {$set: {
        firstname:req.body.firstname,
        lastname:req.body.lastname, 
        gender:req.body.gender, 
        contact:req.body.contact, 
        email: req.body.email}},{new:true},(err,data)=>{
            if(err) throw err;
            else{
                const token = encryptData(data);
                res.json({"err":0,"msg":"Address added","token":token,"values":data})
            }
        }) 
})
//for changing profile pic
router.post("/profilePicService", upload.single('profileImg'), (req,res) =>{
    registerModel.findOneAndUpdate({email: req.body.email}, 
    {$set: {
        profilepic: req.file.filename}},{new:true},(err,data)=>{
            if(err) throw err;
            else{
               
                const token = encryptData(data);
                res.json({"err":0,"msg":"Profile Pic Updated","token":token, "values":data})
            }
        }) 
})

//adding address
router.post("/addAddressService",(req,res)=>{
   
    // let useremail = req.params.email
   registerModel.findOneAndUpdate({email:req.body.email}, {$set:{addresses:req.body.data}},{new:true}, (err,data)=>{

        if(err){
            console.log(err)
        }
        else{
            const token = encryptData(data);
            res.json({"err":0,"msg":"Address added","token":token})
        }
    })
})
//for changing password
router.post("/changepass",(req,res)=>{
    req.body.password = bcrypt.hashSync(req.body.password, saltRounds); 
    registerModel.findOneAndUpdate({email:req.body.email}, {$set:{password:req.body.password}},{new:true},(err, data)=>{
        if(err){
            res.json({"err":1, "msg":"Something went wrong in checking data"})
        }
        else{
            const token = encryptData(data);
            res.json({"err":0,"msg":"Password updated successfully!!","token":token})
        }
        
    })
})
//for email subscription
router.post("/emailSubscribeService", (req, res) => { 
    
            let mailOptions = {
                from:'tejal123supe@gmail.com',
                to:req.body.email,
                subject:"Subscription",
                text:"Thankyou for Subscribing!!!!!"
            }
            transporter.sendMail(mailOptions, function(error,info){
                if(error) {
                    console.log(error)
                }
                else{
                    console.log('Email sent: '+info.response); 
                }
            })
            res.json({"err":0, "msg":"Email Send successfully"})
      
   
})
//for adding products in  cart 
router.post("/cartSaveService",(req,res)=>{
    
   registerModel.findOneAndUpdate({email:req.body.email}, {$set:{cart:req.body.data}},{new:true}, (err,data)=>{

        if(err){
            res.json({"err":1,"msg":err})

        }
        else{
   
            const token = encryptData(data);
            res.json({"err":0,"msg":"cart added","token":token})
        }
  
    })
})



const encryptData = (data) => {
    let pay={
        ...data._doc
    }
    const token= jwt.sign(pay, jwtSecret,{expiresIn:360000})
    return token;
}

export default router