const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const semesterSchema = new Schema({
    semesters: [{
        semester:{
            type: Number,
            required: true,
        },
        roll:String,
        id: String,
        name: Array,
        subjects: Array,
        grades: Array,
        overall: Array,            
    }]
});
const semesterModel = mongoose.model('semester', semesterSchema);
module.exports = semesterModel;