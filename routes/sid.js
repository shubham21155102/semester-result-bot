const {Router}=require("express");
const express=require("express");
const router=express.Router();
const sidModel=require("../models/sid");
router.post('/add',async(req,res)=>{
    try{
      var {roll,sid}=req.body;
      const data=new sidModel({
        roll:roll,
        sid:sid
      })
      await data.save();
      res.send({message:"user added successfully."})
    }catch(err){
        console.log(err);
        console.log("Hii")
    }
})
router.post('/sendresult',async(req,res)=>{
    var roll=req.body.roll;
    const data=await sidModel.findOne({
        roll:roll,
    })
    // console.log(data.sid);
    // var sid=(data.sid);
    // res.send(data);
    // res.redirect('/');
    res.render('hidden',{
        // sid:sid,
        roll:roll,
    })
})
module.exports=router;