var ButtonSubmit =document.getElementById('LoginSubmit');
var username = document.getElementById('userN');
var passwd = document.getElementById('passwd');

var messageUserName_Field = document.getElementById('messageUserName');
var messagePasswd_Field = document.getElementById('messagePasswd');

var userDetails=[];
//   let cacheName = 'userData';
//
// let url=  '/api/get/userdata/abhirup2892/ABHIrup_27?sessid=NX2DVoEQkK'
//   caches.open(cacheName).then(cache => {
//     cache.match(url).then(settings => {
//       console.log(settings);
//     })
//   });
console.log("test inside login");
function myFunction() {
  var x = document.getElementById("passwd");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}

ButtonSubmit.onclick = function()
{
  messageUserName_Field.innerHTML = '';
  messagePasswd_Field.innerHTML = '';
userDetails.push(username.value,passwd.value);
console.log(userDetails);
  var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance

xmlhttp.open("POST", "/Login-Submit");
xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
xmlhttp.onreadystatechange = function() {

          if (this.readyState == 4 && this.status == 200) {
            //document.getElementById("demo").innerHTML = this.responseText;     // This will be inside  the select loop
            //console.log(this.status);
            //console.log(this.response);
            //console.log(this.responseType)
            console.log(this.getResponseHeader("Content-Type"));
            if(this.getResponseHeader("Content-Type") == 'application/json; charset=utf-8')
            {
              const regisData = JSON.parse(this.responseText);
              if(regisData.username != undefined)
            {
              messageUserName_Field.innerHTML = regisData.username;

            messagePasswd_Field.innerHTML = regisData.passwd;
          }
          }
          else{
            const loginData = JSON.parse(this.responseText)
            console.log(loginData.correct)
            //alert(this.responseText);
            if(loginData.correct ==1)
            {
            // let isCacheSupported = 'caches' in window;
            //   console.log(loginData.userID)
            // let cacheName = 'userData';
            // let url = `/api/get/userdata/${username.value}/${passwd.value}?sessid=${loginData.sessionID}`;
            // caches.open(cacheName).then( cache => {   cache.add(url).then( () => {
            // console.log("Data cached ")

            localStorage.setItem("uID", loginData.userID);
            localStorage.setItem("passwd",loginData.passwd)
            localStorage.setItem("sessionID",loginData.sessionID)
            redirect();
          // });
          //
          //   });
          }


          }
            userDetails = [];

            //location.reload();
          }
        }
xmlhttp.send(JSON.stringify(userDetails));
// var result = await makeGetRequest('http://127.0.0.1:3000/Register-Submit');
// console.log(result.result);
// console.log('Statement 2');


}

function redirect()
{
  var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
  var user= localStorage.getItem("uID")
  var sID = localStorage.getItem("sessionID")
  var userDetails= {
    userID: user,
    sessID: sID
  }
xmlhttp.open("POST", `/Dashboard/${user}?sessID=${sID}`);
xmlhttp.setRequestHeader('content-type','text/html;');
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    //console.log(this)
    //console.log(this.responseText)
 //    fetch(`/Dashboard/${user}?sessID=${sID}`)
 // .then(response=> response.text())
 // .then(text=> document.getElementById('homePage').innerHTML = text);

 window.location.href = `/Dashboard/${user}?sessID=${sID}` ;

  }

}

xmlhttp.send(JSON.stringify(userDetails));
}
