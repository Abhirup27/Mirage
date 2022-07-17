var ButtonSubmit =document.getElementById('RegisterSubmit');
var username = document.getElementById('userN');
var passwd = document.getElementById('passwd');
var email = document.getElementById('Email');
var messageUserName_Field = document.getElementById('messageUserName');
var messageEmail_Field = document.getElementById('messageEmail');
var messagePasswd_Field = document.getElementById('messagePasswd');

var userDetails=[];

console.log("test inside register");
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
  messageEmail_Field.innerHTML = '';
  messagePasswd_Field.innerHTML = '';
userDetails.push(username.value,passwd.value,email.value);
console.log(userDetails);
  var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance

xmlhttp.open("POST", "/Register-Submit");
xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
xmlhttp.onreadystatechange = function() {

          if (this.readyState == 4 && this.status == 200) {
            //document.getElementById("demo").innerHTML = this.responseText;     // This will be inside  the select loop
            //console.log(this.status);
            //console.log(this.response);
            //console.log(this.responseType)
            console.log(this.getResponseHeader("Content-Type"));
            if(this.getResponseHeader("Content-Type") == 'application/json; charset=utf-8'){
              const regisData = JSON.parse(this.responseText);
            messageUserName_Field.innerHTML = regisData.username;
            messageEmail_Field.innerHTML = regisData.email;
            messagePasswd_Field.innerHTML = regisData.passwd;
          }
          else{
            alert(this.responseText);
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
