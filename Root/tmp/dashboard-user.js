const btn= document.getElementById('uploadBtn');
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


 async function uploadFile(name, form){
  //let imageBlob = await new Promise(resolve => image.toBlob(resolve, 'image/png'));
//console.log(name)
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/upload");
  //xhr.setRequestHeader("Content-Type", "multipart/form-data; boundary=--BbC04y");
  xhr.upload.addEventListener("progress", ({loaded, total}) =>{
    let fileLoaded = Math.floor((loaded / total) * 100);
    let fileTotal = Math.floor(total / 1000);
    let fileSize;
    (fileTotal < 1024) ? fileSize = fileTotal + " KB" : fileSize = (loaded / (1024*1024)).toFixed(2) + " MB";
    let progressHTML = `<li class="row">
                          <i class="fas fa-file-alt"></i>
                          <div class="content">
                            <div class="details">
                              <span class="name">${name} • Uploading</span>
                              <span class="percent">${fileLoaded}%</span>
                            </div>
                            <div class="progress-bar">
                              <div class="progress" style="width: ${fileLoaded}%""></div>
                            </div>
                          </div>
                        </li>`;
    uploadedArea.classList.add("onprogress");
    progressArea.innerHTML = progressHTML;

    if(loaded == total){
      progressArea.innerHTML = "";
      let uploadedHTML = `<li class="row">
                            <div class="content upload">
                              <i class="fas fa-file-alt"></i>
                              <div class="details">
                                <span class="name">${name} • Uploaded</span>
                                <span class="size">${fileSize}</span>
                              </div>
                            </div>
                            <i class="fas fa-check"></i>
                          </li>`;
      uploadedArea.classList.remove("onprogress");
      uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML);
    }
  });
  let data = new FormData(form);
//   for(var pair of data.entries()) {
//    console.log(pair[0]+ ', '+ pair[1]);
// }
  data.append('uID', localStorage.getItem('uID'))
  data.append('passwd', localStorage.getItem('passwd'))
  data.append('sessionID', localStorage.getItem('sessionID'))
  data.append('visible','1')
  //data.append('image', imageBlob, file)
  xhr.send(data);
}
