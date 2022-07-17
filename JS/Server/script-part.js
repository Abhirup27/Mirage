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
