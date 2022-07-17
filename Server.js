const express = require('express');
const bodyParser = require('body-parser')
const util = require('util')
const fs =require('fs').promises;
var nodemailer = require('nodemailer');
const app = express();
var PORT=3000;
const mariadb = require('mariadb');
const bcrypt = require('bcrypt');
const multer = require('multer');
var formidable = require('formidable');
var mv = require('mv');

const delay = ms => new Promise(res => setTimeout(res, ms));
var transporter = nodemailer.createTransport({
  service: 'outlook',
  auth: {
    user: 'abhirup27022001@outlook.com',
    pass: 'ABHIrup_27'
  }
});

const pool = mariadb.createPool({
     host: '127.0.0.1',
     user:'root',
     password: '',
     connectionLimit: 5
});
var Verifywaiting= {
  userID: '',
  flag: 1,
  deleteEntry: async function ()
  {
    await delay(180000);

    let conn2;

    conn2 = await pool.getConnection();
    await conn2.query("USE IMAGE_SITE;")
      const check = await conn2.query("SELECT VERIFIED FROM USERS WHERE NAME_ID = '"+ this.userID+"';");
      console.log(check[0].VERIFIED);
        conn2.end();
    if(this.flag==1 && check[0].VERIFIED == false )
    {
        console.log("deleted after 90 seconds");
      await deleteUser(this.userID);
    Verifytimer.splice(Verifytimer.findIndex(a=>a.id === this.userID))
  }

    return Verifytimer.find(({ userID }) => userID === this.userID)
  },

}

var sessionData = {
    userID: '',
    sessID: '',
    timeInit: ''
}
var Verifytimer= []
var SessionList = []

let que = "USE NEW1; CREATE TABLE students3(ID INT PRIMARY KEY,Fname VARCHAR(25),Course VARCHAR(20)); INSERT INTO students3 VALUES(0003,'Abhirup2','CS22');SELECT * FROM students3; ";
let conn;
let conn3;
//asyncFunction();
async function asyncFunction(username, passwd, email) {
  //username= toString(username)
  //console.log(String(username))
  //console.log(`${String(username)}`)
  console.log(username);
  try {
	conn = await pool.getConnection();
	const rows = await conn.query("USE IMAGE_SITE");
  //console.log(rows); //[ {val: 1}, meta: ... ]
	//const res = await conn.query(`SELECT ${username} FROM USERS;`);

  const check = await conn.query("SELECT NAME_ID,EMAIL FROM USERS WHERE NAME_ID ="+ username +  "OR EMAIL = "+email + ";");
  //const check = await conn.query("SELECT CASE WHEN EXISTS(SELECT * FROM users WHERE NAME_ID ="+username+ ") THEN CAST(1 AS binary) ELSE CAST(0 AS binary) END");
  console.log(check);
  //const res = await conn.query("INSERT INTO  users(NAME_ID, PASSWD,EMAIL) VALUES("+username+","+passwd+","+email +");");
//  console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }

  } catch (err) {
	throw err;
  } finally {
	if (conn) return conn.end();
  }
}

async function checkUsername(username)
{
  try {
	conn = await pool.getConnection();
	const rows = await conn.query("USE IMAGE_SITE");
  const check = await conn.query("SELECT CASE WHEN EXISTS(SELECT * FROM USERS WHERE NAME_ID = '"+username +"') THEN CAST(1 AS INT) ELSE CAST(0 AS INT) END AS FOUND");
  //console.log(check[0].FOUND);
  if(check[0].FOUND == 1){

    return 1;
  }
  }
  catch (err) {
	throw err;
  } finally {
	if (check) return conn.end();
  }
}

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use(express.json())
//--REQUESTS FROM INDEX.HTML--//

app.get('/', function(req,res){
    console.log(__dirname)
    res.sendFile(__dirname +'/index.html');


});
app.get('/index.css', function(req,res)
{
  res.sendFile(__dirname + '/CSS/index.css')
})
app.get('/dashboard.js', function(req, res){
  res.sendFile(__dirname + 'JS/Client/dashboard.js')

})
app.get('/dashboard-user.js', function(req, res)
{
  //console.log(req.query.sess)
  res.sendFile(__dirname + `/Root/tmp/dashboard-user.js`)

})
app.get('/dashboard.css', function(req, res)
{
  res.sendFile(__dirname+"/CSS/dashboard.css")
})
app.get('/index.JS', function(req,res){
    res.sendFile(__dirname + '/JS/Client/index.js')

})
app.get('/register.js', function(req,res){
    res.sendFile(__dirname + '/JS/Client/register.js')

})
app.get('/register.css' , function(req,res){
  res.sendFile(__dirname + '/CSS/register.css')
})
app.post('/Login', function(req,res)
{
   res.sendFile(__dirname + '/Pages/login.html');
}
);
app.get('/login.css',function(req,res)
{
  res.sendFile(__dirname + '/CSS/login.css')
})
app.get('/register.css',function(req,res)
{
  res.sendFile(__dirname+"/CSS/register.css")
})
app.get('/login.js', function(req,res){
    res.sendFile(__dirname + '/JS/Client/login.js')

})
app.post('/Login-Submit', async function(req, res) {

  var flag=0;
  var loginData = {
    correct: '',
    userID: '',
    passwd:'',
    sessionID:''

  }
  var reduntantData = {
    username :'' ,
    passwd :''
  }

console.log(req.ip);
console.log("in login")

const SpecialChars = /[!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]+/;
  const PassChars = /[!#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]+/;
const SpaceCharacter = /\u0020+/;

console.log( req.body[0][0])

if(SpecialChars.test(req.body[0]) || SpaceCharacter.test(req.body[0]))
{
  console.log("Found special character or a space!");
  reduntantData.username= 'Found special character or a space! Must only contain _ , alphabets,numbers!';
  flag=1;
}
else {
  console.log("did not find special character!");
}
if(req.body[1].length<10 || req.body[1].length > 18)
{
  console.log("Password must be more than 10 characters and less than 18 characters.");
  reduntantData.passwd = 'Password must be more than 10 characters and less than 18 characters.';
  flag=1;
}
if(PassChars.test(req.body[1]) || SpaceCharacter.test(req.body[1]))
{
  console.log("Passwords can ONLY have @ _ aplhabhets and numbers!");
  reduntantData.passwd = reduntantData.passwd + 'Passwords can ONLY have @ _ aplhabhets and numbers!' ;
  flag=1;
}
if(flag !=1)
{
conn = await pool.getConnection();
const query = util.promisify(conn.query).bind(conn);
const rows = await conn.query("USE IMAGE_SITE"); // CHECK USERNAME IF IT EXISTS IN DATABASE
var checkUserID= await conn.query("SELECT CASE WHEN EXISTS(SELECT * FROM USERS WHERE NAME_ID = '"+req.body[0] +"') THEN CAST(1 AS INT) ELSE CAST(0 AS INT) END AS FOUND");
//var checkEmail= await conn.query("SELECT CASE WHEN EXISTS(SELECT * FROM users WHERE EMAIL = '"+req.body[2] +"') THEN CAST(1 AS INT) ELSE CAST(0 AS INT) END AS FOUND");
console.log(checkUserID[0].FOUND);
console.log(req.body[0])
//console.log(checkEmail[0].FOUND);
conn.end();
if(checkUserID[0].FOUND)
{
  conn = await pool.getConnection();
  await conn.query("USE IMAGE_SITE");
  const storedPasswd = await conn.query("SELECT PASSWD FROM USERS WHERE NAME_ID= '"+req.body[0]+"'")
  //var checkPasswd = await conn.query("SELECT CASE WHEN EXISTS(SELECT PASSWD WHERE NAME_ID = '"+ req.body[0]+"')THEN CAST(1 AS INT) ELSE CAST(0 AS INT) END AS FOUND");
  conn.end();
  console.log(storedPasswd[0].PASSWD)
  // if(req.body[1]== storedPasswd[0].PASSWD)
  // {
  //
  // }
  bcrypt.compare(req.body[1], storedPasswd[0].PASSWD).then(async function(result) {
    // result == true
    let time = new Date();
    if(result== true)
    {
      //generate sessionID, store in Session Object and send client a js script to recieve the key and store it in cookies
      var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
      var b;
      for (var i=0; i<10; i++) {
          var j = (Math.random() * (a.length-1)).toFixed(0);
          if(i==0)
          {b= a[j];
          }
          else {
            b+=a[j]
          }
          //console.log(b);
      }
      sessionData.userID = req.body[0]
      sessionData.sessID = b;
      sessionData.timeInit= time.getTime();
      SessionList.push(sessionData);
      //console.log(time.getTime())

      conn = await pool.getConnection();
      await conn.query("USE IMAGE_SITE");
      const check = await conn.query("UPDATE USERS SET L_IP = '"+req.ip+"' WHERE NAME_ID ='"+ req.body[0]+ "';");
      conn.end();
      //res.sendFile(__dirname +"/JS/Client/storeToken.js")
      res.setHeader('content-type', 'text/plain');
      console.log(SessionList[0].sessID)
      loginData.userID=req.body[0];
      loginData.passwd=req.body[1];
      loginData.sessionID = sessionData.sessID;
      loginData.correct = 1;
      res.send(JSON.stringify(loginData));
        }
    else {
      {
        //tell client wrong passwd or user not found.
      }
    }
  });
  }
}
  else {
    res.setHeader('content-type', 'application/json');
    res.type('application/json');
  res.send(JSON.stringify(reduntantData));
  }


})
app.post('/Register', function(req,res)
{
    res.sendFile(__dirname + '/Pages/register.html');
}
);
app.post('/Register-Submit', async function(req,res)
{
  var flag=0;
  var reduntantData = {
    username :'' ,
    email :'' ,
    passwd :''
  }
  const SpecialChars = /[!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]+/;
    const PassChars = /[!#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]+/;
  const SpaceCharacter = /\u0020+/;

  console.log( req.body[0][0])
  // for(var i =0; i<=req.body[0].length;i++)
  //   {
  //     if(req.body[0][i] )
  //     {
  //
  //     }
  //   }
  if(SpecialChars.test(req.body[0]) || SpaceCharacter.test(req.body[0]))
  {
    console.log("Found special character or a space!");
    reduntantData.username= 'Found special character or a space! Must only contain _ , alphabets,numbers!';
    flag=1
  }
  else {
    console.log("did not find special character!");
  }
  if(req.body[1].length<10 || req.body[1].length > 18)
  {
    console.log("Password must be more than 10 characters and less than 18 characters.");
    reduntantData.passwd = 'Password must be more than 10 characters and less than 18 characters.';
    flag=1
  }
  if(PassChars.test(req.body[1]) || SpaceCharacter.test(req.body[1]))
  {
    console.log("Passwords can ONLY have @ _ aplhabhets and numbers!");
    reduntantData.passwd = reduntantData.passwd + 'Passwords can ONLY have @ _ aplhabhets and numbers!' ;
    flag=1
  }


    //res.sendFile(__dirname + '/Pages/register.html');
  //  console.log(req.body[2]);
    //asyncFunction(JSON.stringify(req.body[0]),JSON.stringify(req.body[1]),JSON.stringify(req.body[2]));
  // checkUsername(req.body[0]);
  if(flag==0){

   conn = await pool.getConnection();
   //const query = util.promisify(conn.query).bind(conn);
   const rows = await conn.query("USE IMAGE_SITE"); // CHECK USERNAME IF IT EXISTS IN DATABASE
   var checkUserID= await conn.query("SELECT CASE WHEN EXISTS(SELECT * FROM USERS WHERE NAME_ID = '"+req.body[0] +"') THEN CAST(1 AS INT) ELSE CAST(0 AS INT) END AS FOUND");
   //var checkEmail= await conn.query("SELECT CASE WHEN EXISTS(SELECT ￼﻿﻿* FROM USERS WHERE EMAIL = '"+req.body[2] +"') THEN CAST(1 AS INT) ELSE CAST(0 AS INT) END AS FOUND");
   var checkEmail= await conn.query("SELECT CASE WHEN EXISTS(SELECT * FROM USERS WHERE EMAIL = '"+req.body[2] +"') THEN CAST(1 AS INT) ELSE CAST(0 AS INT) END AS FOUND");
  console.log(checkUserID[0].FOUND);
  console.log(checkEmail[0].FOUND);
  conn.end();
  if(checkUserID[0].FOUND == 1 ||checkEmail[0].FOUND==1 )
  {
    if(checkUserID[0].FOUND == 1)
    {
    reduntantData.username = 'The name already exists!';
    }
    if(checkEmail[0].FOUND==1)
    {
      reduntantData.email = 'The Email is already registered!';
    }
  //  res.status(200).send("The name already exists!");
  }
  else {
    try{
    const salt = await bcrypt.genSalt();
    const hashedPasswd = await bcrypt.hash(req.body[1] , salt);
    console.log(hashedPasswd);
    //console.log("haha what a joke this is!")
    conn3 = await pool.getConnection();
    console.log(String(req.body[0]) + req.body[1] + req.body[2])
    await conn3.query("USE IMAGE_SITE");
    let dateObj = new Date();
    let month = String(dateObj.getMonth() + 1).padStart(2, '0');
    let year = dateObj.getFullYear();
    let day = String(dateObj.getDate()).padStart(2, '0');
    let date= year+'-'+month+'-'+day;
    var storeUser = await conn3.query("INSERT INTO USERS(NAME_ID, PASSWD,EMAIL,DOJ) VALUES('"+req.body[0]+"','"+hashedPasswd+"','"+req.body[2] +"','"+date + "');");

    conn3.end();
    console.log(storeUser);

    Verifywaiting.userID = req.body[0];
    Verifywaiting.passkey = sendToken(16, req.body[2], req.body[0]);
    Verifywaiting.flag = 1;
    console.log(Verifywaiting)
    Verifytimer.push(Verifywaiting);
    res.setHeader('content-type', 'text/plain');
    res.status(200).send('registered succesfully!');
    console.log(await Verifywaiting.deleteEntry());
    }
    catch{
      res.setHeader('content-type', 'text/plain');
      res.type('text');
      res.status(500).send('Server Error, please try again.');
    }
  }

  }
  if(!res.headersSent){
    console.log("ran it!")
    res.setHeader('content-type', 'application/json');
    res.type('application/json');
  res.send(JSON.stringify(reduntantData));
}


}
);

app.get('/api/get/userdata/:userID/:passwd', async function(req,res){
  console.log("Cache request recieve")
  console.log(req.params.userID)
  if(SessionList.find(({userID}) => userID == req.params.userID) != undefined)
  {
    console.log("Cache 1")
    var index = SessionList.findIndex(a=>a.id === this.userID);
    console.log("this is the session ID for the user: " + SessionList[index].sessID)

    conn = await pool.getConnection();
    await conn.query("USE IMAGE_SITE");
    const storedPasswd = await conn.query("SELECT PASSWD FROM USERS WHERE NAME_ID= '"+req.params.userID+"'")
    conn.end()
    bcrypt.compare(req.params.passwd, storedPasswd[0].PASSWD).then(async function(result) {
      if(result==true)
      {
        console.log("Cache 1")
        if(SessionList[index].sessID == req.query.sessid)
        {
          console.log("Cache 2")
          res.set('cache-control: public, max-age=3000')
          res.setHeader('content-type', 'application/json')
          res.send(JSON.stringify(SessionList[index]))
        }
      }


    });

  }

})

app.get('/u/verify/:userId', async function(req, res){
  if( Verifytimer.find(({ userID }) => userID == req.params.userId) != undefined)
  {

    var index = Verifytimer.findIndex(a=>a.id === this.userID);
    console.log("this is the index passkey: " + Verifytimer[index])
    if(Verifytimer[index].passkey == req.query.key)
    {

      Verifytimer[index].flag = 0;

      setVerified(req.params.userId);

      res.send("Email Verified "+ req.params.userId + " with key " + req.query.key);
    }
    else {
      res.send("Email not verified username "+ req.params.userId + " or key " + req.query.key + "is invalid");
    }
  }
  else {
    console.log("Username not found!")
  }

});
// app.get('/u/:userId?key=', async function(req, res){
//     res.send("Email Verified "+ req.params.userId + "with key" + req.params.key);
//
// });

app.get('/Dashboard/:user', async function(req,res)
{
  res.setHeader('content-type','text/html;')
  //res.sendFile(__dirname+"/Pages/dashboard.html")

  res.sendFile(__dirname + String(await dynamicHTML(req.params.user, req.query.sessID)))
  //res.sendFile(__dirname + "/Root/tmp/tmp.html")


})
app.post('/Dashboard/:user', async function(req,res)
{
  res.setHeader('content-type','text/html;')
  res.sendFile(__dirname+"/Pages/dashboard.html")
})

app.listen(PORT,function(){
    console.log(`Server started at port: ${PORT}`);

});


function sendToken(length, toEmail, userID)
{

  //edit the token allowed characters
    var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    var b = [];
    for (var i=0; i<length; i++) {
        var j = (Math.random() * (a.length-1)).toFixed(0);
        b[i] = a[j];
    }
    var mailOptions = {
    from: 'abhirup27022001@outlook.com',
    to: toEmail,
    subject: 'Email Verification for Image Hosting',
    text: ` http://192.168.1.163:3000/u/verify/${userID}?key=${b.join("")}  `
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  //Call the waiting to verify timer
  console.log("passkey generated:" + b.join(""))
    return b.join("");
}

async function deleteUser(user)
{
  let conn2
  console.log(user);
  try {
	conn2 = await pool.getConnection();
  await conn2.query("USE IMAGE_SITE");
  const check = await conn2.query("DELETE FROM USERS WHERE NAME_ID ='"+ user+ "';");

  console.log(check);

  } catch (err) {
	throw err;
  } finally {
	if (conn2) return conn2.end();
  }
}

async function setVerified(user)
{
  let conn2
  console.log(user);
  try {
	conn2 = await pool.getConnection();
  await conn2.query("USE IMAGE_SITE");
  const check = await conn2.query("UPDATE USERS SET VERIFIED = true WHERE NAME_ID ='"+ user+ "';");

  console.log(check);

  } catch (err) {
	throw err;
  } finally {
	if (conn2) return conn2.end();
  }
}

dynamicHTML("abhirup2892", "randomSessionID")
// EDITING HTML //


async function dynamicHTML(userID, sessID){
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
conn2 = await pool.getConnection();
await conn2.query("USE IMAGE_SITE");
const check = await conn2.query("SELECT CASE WHEN EXISTS(SELECT * FROM USERS WHERE NAME_ID = '"+userID +"') THEN CAST(1 AS INT) ELSE CAST(0 AS INT) END AS FOUND");
conn2.end();
if(check[0].FOUND ==1)
{
  if(SessionList.find(({userID}) => userID == userID) != undefined)
  {
    var index = SessionList.findIndex(a=>a.id === this.userID);
    console.log(SessionList[index].sessID);
  conn2 = await pool.getConnection();
  await conn2.query("USE IMAGE_SITE");
  const userData = await conn2.query("SELECT * FROM USERS WHERE NAME_ID='"+userID+"'");
  conn2.end();
  //console.log(userData[0]);

await  JSDOM.fromFile(__dirname+ "/Pages/dashboard.html").then(async dom => {
  //console.log(dom.serialize());
  var userN= dom.window.document.getElementById('username')
  var profImage= dom.window.document.getElementById('proImg')
  var joinD= dom.window.document.getElementById('joined')
  userN.innerHTML=userData[0].NAME_ID;
  joinD.innerHTML=userData[0].DOJ;
  profImage.setAttribute("src","/img/"+userData[0].PRO_IMG);

  if(SessionList[index].sessID == sessID)
  {
    const access1= dom.window.document.getElementById('uploadB');
    const uploadBtn = access1.appendChild(dom.window.document.createElement('Button'));
    const editBtn = access1.appendChild(dom.window.document.createElement('Button'));
    editBtn.innerHTML="EDIT";
    editBtn.setAttribute("disabled","true")
    uploadBtn.innerHTML= "UPLOAD";
    uploadBtn.setAttribute("id","uploadBtn")
    editBtn.setAttribute("id","editBtn")
    const script = dom.window.document.getElementById("required");
    script.setAttribute("src", `/dashboard-user.js`);
    await fs.writeFile(__dirname+`/Root/tmp/dashboard-user.js`,

      `const btn= document.getElementById('uploadBtn');
      const upArea= document.getElementById('uploadB');
      const form = document.querySelector(".form");
      var fileInput = document.querySelector(".file-input");
      var progressArea = document.querySelector(".progress-area");
      var uploadedArea = document.querySelector(".uploaded-area");
      var img //= form.appendChild(document.createElement('img'))
    //  img.setAttribute('id','image')
      btn.onclick = function(){

      const area= upArea.appendChild(document.createElement('div'));
      area.setAttribute('class', 'wrapper');
      const form = area.appendChild(document.createElement('form'));
      form.setAttribute('action','/upload');
      form.setAttribute('class','form')
      form.setAttribute('enctype','multipart/form-data')
      const input= form.appendChild(document.createElement('input'))
      input.setAttribute('id','images')
      input.setAttribute('name','images')
      input.setAttribute('class','file-input')
      input.setAttribute('type','file')
      input.setAttribute('name','file')
      input.setAttribute('hidden', 'true')
      input.setAttribute('multiple', 'true')
       img = form.appendChild(document.createElement('img'))
      img.setAttribute('id','image')
      const i= form.appendChild(document.createElement('i'))
      i.setAttribute('class','fas fa-cloud-upload-alt')
      const para= form.appendChild(document.createElement('p'));
      para.innerHTML= 'Browse or Drag Images.';
      const sec1= area.appendChild(document.createElement('section'))
      const sec2= area.appendChild(document.createElement('section'))
      sec1.setAttribute('class','progress-area');
      sec2.setAttribute('class','uploaded-area');
       area.setAttribute('ondrop','dropHandler(event);');
        area.setAttribute('ondragover','dragOverHandler(event)');

        fileInput = document.querySelector(".file-input"),
        progressArea = document.querySelector(".progress-area"),
        uploadedArea = document.querySelector(".uploaded-area");

        form.addEventListener("click", () =>{
          fileInput.click();
        });

        fileInput.onchange = ({target})=>{
          for(var i=0; i<=target.files.length; i++)
          {
          let file = target.files[i];
          if(file){
            let fileName = file.name;
            console.log(fileName)
            if(fileName.length >= 12){
              let splitName = fileName.split('.');
              console.log(splitName)
              fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
            }
            console.log(fileName);
            uploadFile(fileName ,form);
          }
        }
      }
          }

        function dropHandler(ev) {
  console.log('File(s) dropped');

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.items.length; i++) {
      // If dropped items aren't files, reject them
      if (ev.dataTransfer.items[i].kind === 'file') {
        var file = ev.dataTransfer.items[i].getAsFile();
        console.log('... file[' + i + '].name = ' + file.name);
        let fileName = file.name;
        if(fileName.length >= 12){
          let splitName = fileName.split('.');
          console.log(splitName)
          fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
          console.log(fileName)
        }
        //fileInput.files = ev.dataTransfer.files;
        img.src= URL.createObjectURL(ev.dataTransfer.files[i])
        img.file = fileName;
        //fileName= fileInput.files[i]
        console.log(img.src)
        console.log(ev.dataTransfer.files[0])


        uploadFile(fileInput, form)
      }
    }
  } else {
    // Use DataTransfer interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.files.length; i++) {
      console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
    }
  }
}
function dragOverHandler(ev) {
  console.log('File(s) in drop zone');

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
}


 `)

const scriptpart=  await fs.readFile(__dirname + "/JS/Server/script-part.js", { encoding: 'utf8' })
await fs.appendFile(__dirname+`/Root/tmp/dashboard-user.js`, scriptpart)
    var rows=1;
    const table = dom.window.document.getElementById('tableImages');

    conn2 = await pool.getConnection();
    await conn2.query("USE IMAGE_SITE");
    const imageData = await conn2.query("SELECT * FROM IMAGES WHERE U_ID='"+userID+"'");
    conn2.end();
    console.log(imageData.length)

    var tr= table.appendChild(dom.window.document.createElement('tr'))
    tr.setAttribute("id",`r${rows}`);
    var coll=0;
     for(var i=0; i<= imageData.length -1; i++)
    {

      var td= tr.appendChild(dom.window.document.createElement('td'));

      const editBtn = dom.window.document.getElementById('editBtn');
      editBtn.removeAttribute("disabled")
      td.setAttribute("id",`c${rows}${coll}`);
      coll++;
      var img= td.appendChild(dom.window.document.createElement('img'));
      img.setAttribute("id",`i${i}`);
      img.setAttribute("src",`/img/${imageData[i].I_ID}`);
      //img.setAttribute()
      if(coll==3)
      {
        tr= table.appendChild(dom.window.document.createElement('tr'))
        rows++;
        tr.setAttribute("id",`r${rows}`);
        coll=0;
      }
    }

  }

  await fs.writeFile(__dirname +"/Root/tmp/tmp.html", await dom.serialize())
  //console.log(dom.serialize());
  //return (String("/Pages/dashboard.html"))
});
  return (String("/Root/tmp/tmp.html"))
}
else {
  return (String("/Pages/dashboardInvalid.html"))
}
}
else {
  return (String("/Pages/dashboardInvalid.html"))
}
}


app.get('/img/:image', async function(req,res){
  conn2 = await pool.getConnection();
  await conn2.query("USE IMAGE_SITE");
  const check = await conn2.query("SELECT CASE WHEN EXISTS(SELECT * FROM IMAGES WHERE I_ID = '"+ req.params.image +"') THEN CAST(1 AS INT) ELSE CAST(0 AS INT) END AS FOUND");
  conn2.end();
  if(check[0].FOUND ==1)
  {
    res.sendFile(__dirname + "/Root/Images/"+req.params.image)
  }
  else {
    res.sendFile(__dirname + "/Root/Images/DummyPic.png")
  }

})
// const upload = multer({
// dest: __dirname+'/Root/Images',
// limits: {
// fileSize: 1000000,
// },
// fileFilter(req, file, cb) {
// if (!file.originalname.match(/\.(png|jpg|jpeg)$/)){
// cb(new Error('Please upload an image.'))
// }
// cb(undefined, true)
// }
// })

app.post('/upload', async function(req,res)
{
  var form = new formidable.IncomingForm();
  //form.uploadDir =__dirname+'/Root/Images/';
  form.multiples = true;
    form.maxFileSize = 60 * 1024 * 1024; // 6MB
    //console.log(form);
    const uploadFolder= __dirname+'/Root/Images/';
    form.parse(req, async (err, fields, files) => {
    //  console.log(fields);
    try{
      conn2 = await pool.getConnection();
      await conn2.query("USE IMAGE_SITE");
      const check = await conn2.query("SELECT CASE WHEN EXISTS(SELECT * FROM USERS WHERE NAME_ID = '"+ fields.uID +"') THEN CAST(1 AS INT) ELSE CAST(0 AS INT) END AS FOUND");
      conn2.end();
      if(check[0].FOUND==0)
      {
        throw new Error(`1`);
      }
      else {
        if(SessionList.find(({userID}) => userID == fields.uID) != undefined)
        {
          var index = SessionList.findIndex(a=>a.id === this.userID);
          console.log(SessionList[index].sessID);
          if(fields.sessionID == SessionList[index].sessID)
        {
          if (!files.length) {
      //Single file

      const file = files.file;
    //console.log(Object.values(file))
      // for (const [key, value] of Object.entries(Object.values(file))) {
      //   console.log(`${key}: ${value}`);
      // }


    //  console.log(file)
      // checks if the file is valid
      const isValid = isFileValid(Object.values(file)[6]);
      const origName =String(Object.values(file)[6]);
      const oldPath =  String(Object.values(Object.values(file)[10])[1]);
      console.log(oldPath)
      // creates a valid name by removing spaces
      const fileName = String(Object.values(file)[5]);
      const fileSize = String(Object.values(file)[9]);

      if (!isValid) {
        // throes error if file isn't valid
        return res.status(400).json({
          status: "Fail",
          message: "The file type is not a valid type",
        });
      }
       try {
        // renames the file in the directory
        mv(oldPath, uploadFolder+fileName, async function(err) {
          // done. it tried fs.rename first, and then falls back to
          // piping the source file to the dest file and then unlinking
          // the source file.
          conn2 = await pool.getConnection();
        await conn2.query("USE IMAGE_SITE");
        const userDetail = await conn2.query("SELECT * FROM USERS WHERE NAME_ID = '"+fields.uID +"'");

        const tempDate= Object.values(file)[3]
        const date = tempDate.toString().split("T")[0];
        const visible= fields.visible
          console.log(date)
        const uploadImgDB = await conn2.query("INSERT INTO IMAGES(I_ID, SIZE, ADDATE ,VISIBLE, I_NAME, U_ID) VALUES('"+fileName+"','"+fileSize+"','"+date+"','"+visible+"','"+origName+"','"+userDetail[0].NAME_ID+"')")
        conn2.end();
          console.log("copied to dest")
        });

        //fs.rename(oldPath, uploadFolder+ fileName);
      } catch (error) {
        console.log(error);
      }

      try {
        // stores the fileName in the database
        const newFile = await File.create({
          name: `files/${fileName}`,
        });
        return res.status(200).json({
          status: "success",
          message: "File created successfully!!",
        });
      } catch (error) {
        res.json({
          error,
        });
      }
    } else {
      // Multiple files
    }



      }
      else{
        throw new Error('3');
      }

      }
      else{
        throw new Error('2');
      }
      }
    } catch(e)
    {
      console.log(e);
      if(e=='1')
      {
      return res.status(400).json({
        status: "Fail",
        message: `No username ${fields.uID} exist in the Database, please login again`,
        error: e
      });
    }
    if(e=='2')
    {
      return res.status(400).json({
        status: "Fail",
        message: `Session ID ${fields.sessionID} exist in the server. Server may have restarted.please login again`,
        error: e
      });
    }
    if(e=='3')
    {
      return res.status(400).json({
        status: "Fail",
        message: `Session ID ${fields.sessionID} does not match with user ID ${fields.uID}.please login again in a new Tab`,
        error: e
      });
    }
    }
    //  console.log(files);
      if (err) {
        console.log("Error parsing the files");
        console.log(err)
        return res.status(400).json({
          status: "Fail",
          message: "There was an error parsing the files",
          error: err,
        });
      }


    });
  console.log(req.readyState)
}
)


const isFileValid = (file) => {
  //const f= file
  console.log(file)
  const type = file.toString().split("/").pop();
    console.log(type)
  const validTypes = ["jpg", "jpeg", "png" ,"gif"];
  for(var i=0; i<= validTypes.length; i++)
  {
  if (type.indexOf(validTypes[i]) != -1) {
    console.log("found")
    return true;
  }
  if(i==validTypes.length){
  return false;
}
}
};
