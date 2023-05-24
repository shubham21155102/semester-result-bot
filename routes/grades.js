const {Router}=require("express");
const router=Router();
const gradesModel=require('../models/grades');
router.post('/addgrades',async(req,res)=>{
    try{
        var {roll,sem_year,subjects,grades,overall}=req.body;
        const data=new gradesModel({
            roll:roll,
            sem_year:sem_year,
            subjects:subjects,
            grades:grades,
            overall:overall,
        })
        console.log(data);
        await data.save();
        res.send({message:"grades added successfully."})
    }catch(err){
        console.log(err);
    }
}
);
module.exports=router;