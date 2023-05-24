const express = require("express");
const app = express();
const fs = require("fs");
const readLine = require("readline");
const { google } = require("googleapis");
const env = require('dotenv').config();
const bodyParser = require("body-parser");
const puppeteer = require("puppeteer");
const cors = require('cors');
const methodOverride = require("method-override");
const nodemailer = require("nodemailer");
app.use(cors());
const sid = require("./routes/sid");
const gradess = require("./routes/grades");
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set('trust proxy', 1);
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(methodOverride('_method'));
app.use(express.static('.'));
app.set('view engine', 'ejs');
app.use(express.static("public"));
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);

mongoose
    .connect(process.env.mongo, {
        useNewUrlParser: true,
        // useUnifiedToplogy:true,
        // useCreateIndex:true
    })
    .then(() => {
        console.log('connected to db');
    })
    .catch((err) => {
        console.log(err.message);
    });
var ss;
const sidModel = require('./models/sid');
const gradesModel = require('./models/grades');
const semesterModel = require('./models/semesters');
let name = [];
let subjects = [];
let grades = [];
let overall = [];
const sem_year = "2022-23-2";
app.use('/api', sid);
app.use('/api', gradess);
app.get('/', (req, res) => {
    // res.sendFile(__dirname + "/iitbhu.html")
    res.render("iit")
});
app.get('/sendresult', (req, res) => {
    res.render("result");
})
app.get('/add', (req, res) => {
    res.render('sid');
})
app.get("/alluser", async (req, res) => {
    try {
        const data = await gradesModel.find({});
        console.log(data);
        res.send(data);
    } catch (err) {
        console.log(err);
    }
})
app.post('/sendresult', async (req, res) => {
    console.log(req.body.roll);
    //  sem_year=req.body.sem;

    console.log("mil gaya " + sem_year);
    if (sem_year == 0) {
        res.redirect("/");
    }

    else {
        console.log(req.body.sem);
        // console.log(req.body.sid);
        // res.redirect("/");
        var sname = req.body.roll;
        // const data=await sidModel.findOne({
        //     roll:sname
        // })
        ss = sname;
        var roll = req.body.roll;
        const data = await sidModel.findOne({
            roll: roll,
        });
        if (data == null) {
            // res.send("Please enter valid roll number.");
            res.render("error");
        }
        else {
            var sid = data.sid;
            console.log(data);
            const studyPortal = process.env.link;
            function waitAndClick(selector, cpage) {
                return new Promise((resolve, reject) => {
                    let waitPromise = cpage.waitForSelector(selector, { visible: true })
                    waitPromise.then(function () {
                        let clickPromise = cpage.click(selector)
                        return clickPromise;
                    }).then(function () {
                        resolve();
                    }).catch(function (err) {
                        reject(err);
                    })
                })
            }
            (async () => {
                const browser = await puppeteer.launch({
                    headless: false,
                    defaultViewport: null,
                    args: ["--start-maximized"]
                });
                const page = await browser.newPage();
                await page.goto(studyPortal);
                await page.waitForSelector("select#year_sem");

                await page.select('select#year_sem', `${sem_year}`);
                // await page.waitForNetworkIdle({ waitUntil: 'load', timeout: 0 });
                // get subjects of a particular student of a particular semester
                subjects = await page.evaluate(() => {
                    subject_elements = document.querySelectorAll("[width='12%']");
                    subject_array = Array.from(subject_elements);
                    return subject_array.map(subject => subject.textContent);
                });
                name = await page.evaluate(() => {
                    name_elements = document.querySelectorAll("[width='50%']");
                    name_array = Array.from(name_elements);
                    return name_array.map(subject => subject.textContent);
                });

                grades = await page.evaluate(() => {
                    grade_elements = document.querySelectorAll(".b3");
                    grade_array = Array.from(grade_elements);
                    return grade_array.map(grade => grade.textContent);
                });
                overall = await page.evaluate(() => {
                    overall_elements = document.querySelectorAll(".b6");
                    overall_array = Array.from(overall_elements);
                    return overall_array.map(overall => overall.textContent);
                });

                // Save the PDF and wait for it to be generated
                await page.pdf({ path: `./pdf/${sname}.pdf`, format: 'A4' });

                await browser.close();

                res.redirect("/");
                res.render("result", {
                    sem_year: sem_year,
                    sname: sname,
                    name: name,
                    subjects: subjects,
                    grades: grades,
                    overall: overall,
                    link: studyPortal,
                });
            })();

            // (async () => {
            //     const browser = await puppeteer.launch({
            //         headless: false,
            //         defaultViewport: null,
            //         args: ["--start-maximized"]
            //     })
            //     const page = await browser.newPage()
            //     await page.goto(studyPortal);
            //     await page.waitForSelector("select#year_sem");

            //     await page.select('select#year_sem', `${sem_year}`);
            //     await page.waitForNetworkIdle({ waitUntil: 'load', timeout: 0 });
            //     // get subjects of a particular student of a particular semester
            //     subjects = await page.evaluate(() => {
            //         subject_elements = document.querySelectorAll("[width='12%']");
            //         subject_array = Array.from(subject_elements);
            //         return subject_array.map(subject => subject.textContent);
            //     });
            //     name = await page.evaluate(() => {
            //         name_elements = document.querySelectorAll("[width='50%']");
            //         name_array = Array.from(name_elements);
            //         return name_array.map(subject => subject.textContent);
            //     });

            //     grades = await page.evaluate(() => {
            //         grade_elements = document.querySelectorAll(".b3");
            //         grade_array = Array.from(grade_elements);
            //         return grade_array.map(grade => grade.textContent);
            //     });
            //     overall = await page.evaluate(() => {
            //         overall_elements = document.querySelectorAll(".b6");
            //         overall_array = Array.from(overall_elements);
            //         return overall_array.map(overall => overall.textContent);
            //     });

            //     //         console.log(name[4]+"====>"+overall[1]);
            //     //     for (let i = 0; i < subjects.length; i++) {
            //     //         console.log(subjects[i]+"-->"+grades[i]);
            //     // }  

            //     await page.screenshot({ path: `./ss/${sname}.jpeg`, fullPage: true });
            //     await page.pdf({ path: `./pdf/${sname}.pdf`, format: 'A4' });
            //     await browser.close();
            // })();

            // res.redirect("/");
            // res.render("result", {
            //     sem_year: sem_year,
            //     sname: sname,
            //     name: name,
            //     subjects: subjects,
            //     grades: grades,
            //     overall: overall,
            //     link: studyPortal,
            // })


        }
    }


})
app.get('/addgrades', (req, res) => {
    res.render("addgrades");
});
app.post('/addgrades', async (req, res) => {

    try {
        var { roll, sem_year } = req.body;
        const data = new gradesModel({
            roll: roll,
            sem_year: sem_year,
            name: name,
            subjects: subjects,
            grades: grades,
            overall: overall,
        })
        console.log(data);
        await data.save();
        res.send({ message: "grades added successfully." })
    } catch (err) {
        console.log(err);
    }


}
)
app.get('/allsemester', (req, res) => {
    res.render("allsemester");
})
// const Schema = mongoose.Schema;
// const semesterSchema = new Schema({
//     semesters: [{
//         semester:{
//             type: Number,
//             required: true,
//         },
//         roll:String,
//         id: String,
//         name: Array,
//         subjects: Array,
//         grades: Array,
//         overall: Array,            
//     }]
// })
// mongoose.model('semester', semesterSchema);
// semesterSchema.methods.add = (params) => {

// }


app.post('/allsemester', async (req, res) => {

    try {
        var { roll, sem_year } = req.body;
        // const data=new semesterModel({

        // })
        this.semesters = this.semesters({
            roll: roll,
            semester: sem_year,
            name: name,
            subjects: subjects,
            grades: grades,
            overall: overall,
        });
        await this.semesters.save();
        res.send({ message: "grades added successfully." })


    }
    catch (err) {
        console.log(err);
    }



})

app.post("/email", (req, res) => {


    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "aishwarytutorial@gmail.com",
            pass: process.env.pass,
        }
    });
    const mailOptions = {
        from: "Shubham",
        to: req.body.email,
        subject: "GradeSheet",
        // text:"GradeSheet",
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body>
          
        </body>
        </html>
            `,
        attachments: [
            {
                filename: `${ss}.pdf`,
                path: `./pdf/${ss}.pdf`
            }
        ]
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.send(error);
        }
        else {
            // res.send("Email Sent.")
            res.redirect("/sendresult");
            console.log("Email sent: " + info.response);

        }


    })


})
app.listen(4000, () => {
    console.log(`listening on port ${process.env.PORT || 3000}`)
});
