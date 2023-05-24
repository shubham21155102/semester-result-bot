
const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
const { Markup } = require('telegraf');
const env=require("dotenv").config();
const bot = new Telegraf(process.env.TOKEN);
// bot.use((ctx,next)=>{
//     ctx.state.buah=45;
//         ctx.reply("hewooo");
//         next(ctx);
// })
function givePdf(id){
  const puppeter=require("puppeteer");
      const link="http://localhost:4000/";
      (async () => {
          const browser = await puppeter.launch({
            // headless:false,
            defaultViewport:null,
            args:["--start-maximized"]
          });
          const page = await browser.newPage();
          await page.goto(link);
          await page.type("#roll",id);
          await page.click("#submit");
           const filePath = path.join("/home/shubham/iitbhu/pdf", `${id}.pdf`);
  
      // Check if the file exists
      if (fs.existsSync(filePath)) {
        // Send the PDF to the user
        ctx.replyWithDocument({
          source: filePath,
          filename: "result.pdf",
        });
          await browser.close();
      } 
        
      })();
}
function userinfo(id, callback) {
    const https = require("https");
    const options = {
      method: "GET",
      hostname: "codeforces.com",
      port: null,
      path: `/api/user.info?handles=${id}`,
      headers: {
        Accept: "*/*",
      },
    };
  
    const req = https.request(options, function (res) {
      const chunks = [];
  
      res.on("data", function (chunk) {
        chunks.push(chunk);
      });
  
      res.on("end", function () {
        const body = Buffer.concat(chunks);
        const n = body.toString();
        const k = JSON.parse(n);
        callback(k.result); // Pass the result to the callback function
      });
    });
  
    req.end();
  }
function questions(id, callback) {
    const https = require("https");
  
    const options = {
      method: "GET",
      hostname: "codeforces.com",
      port: null,
      path: `/api/user.status?handle=${id}`,
      headers: {
        Accept: "*/*",
      },
    };
  
    const req = https.request(options, function (res) {
      const chunks = [];
  
      res.on("data", function (chunk) {
        chunks.push(chunk);
      });
  
      res.on("end", function () {
        const body = Buffer.concat(chunks);
        const n = body.toString();
        const k = JSON.parse(n);
        callback(k.result); // Pass the result to the callback function
      });
    });
  
    req.end();
  }
  
bot.start((ctx) => {
    ctx.reply("Welcome " + ctx.from.first_name);

})

bot.command("show", (ctx) => {
    ctx.reply("This is show command");
})
bot.hears("my name", (ctx) => {
    ctx.reply(ctx.from.first_name);
})
bot.command("questions", (ctx) => {
    ctx.reply("Please enter your ID to get your completed questions: ");
  
    bot.on("text", (ctx) => {
      const userId = ctx.message.text;
  
      ctx.reply("Your Codeforces ID is " + userId);
  
      questions(userId, (result) => {
        // Handle the result here
        result.forEach((i)=>{
            if(i.verdict=="OK"){
                ctx.reply(i.problem.name +" " +i.problem.rating );
            }
        })
        // ctx.reply("Completed questions: " + JSON.stringify(result));
      });
    });
  });
  bot.command("userinfo", (ctx) => {
    ctx.reply("Please enter your ID to get your user info: ");
  
    bot.on("text", (ctx) => {
      const userId = ctx.message.text;
  
      ctx.reply("Your Codeforces ID is " + userId);
  
      userinfo(userId, (result) => {
        // Handle the result here
        ctx.reply("User info: " + JSON.stringify(result));
        // ctx.reply(`User info: \nHandle: ${result.handle}\nCurrent Status: ${result.rank}\nCurrent Rating: ${result.rating}\nMaximum Rating: ${result.maxRating}\nHighest Status: ${result.maxRank}`);
      });
    });
  });
  const path = require("path");

  const fs = require("fs");

  bot.command("getresult", (ctx) => {
    ctx.reply("Please enter your Roll Number to get the Result.");
  
    bot.on("text", (ctx) => {
      const roll = ctx.message.text;
      ctx.reply("Your Roll Number is " + roll);

      // Assuming you have the path to the PDF file
      const filePath = path.join("/home/shubham/iitbhu/pdf", `${roll}.pdf`);
  
      // Check if the file exists
      if (fs.existsSync(filePath)) {
        // Send the PDF to the user
        ctx.replyWithDocument({
          source: filePath,
          filename: "result.pdf",
        });
      } else { 
          givePdf(roll);
        ctx.reply("Please Forgive Me I am working to fix this issue please try again under 2 minnutes.");
      }
    });
  });

bot.command("restart", (ctx) => {
  ctx.reply("Restarting the server...");

  // Restart the server using pm2
  const exec = require('child_process').exec;
  const restartCommand = 'pm2 restart bot.js';
  
  // Check if the server is already restarting
  if (ctx.session.restarting) {
    ctx.reply("The server is already restarting. Please wait.");
  } else {
    ctx.session.restarting = true;
    
    exec(restartCommand, (error, stdout, stderr) => {
      ctx.session.restarting = false; // Reset the restarting flag
      
      if (error) {
        console.error(`Failed to restart server: ${error}`);
        ctx.reply("Failed to restart the server.");
      } else {
        console.log(`Server restarted: ${stdout}`);
        ctx.reply("Server restarted successfully.");
      }
    });
  }
});

  
  
bot.on('photo', (ctx) => {
    console.log(ctx.message)
    return ctx.reply('Cool!')
})
console.log("Bot is running");
bot.launch();
