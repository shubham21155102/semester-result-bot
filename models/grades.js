const mongoose=require("mongoose");
const gradesSchema=new mongoose.Schema({
    roll:{
        type:String,
        required:true,
        // unique:true,
    },
    sem_year:{
        type:String,
        // required:true,
    },
    name:{
        type:Array,
        // required:true,
    },
    subjects:{
        type:Array,
        // required:true,
    },
    grades:{
        type:Array,
        // required:true,
    },
    overall:{
        type:Array,
        // required:true,
    },
});
const gradesModel=mongoose.model('grades',gradesSchema);
module.exports=gradesModel;
