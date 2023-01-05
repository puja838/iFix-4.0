onmessage = async function (e) {
  let actionResult;
  if (e.data.event === 'slaPercentage') {
    setInterval(async function () {
      actionResult = await getSlaPercentage(e.data);
      postMessage({
        result: actionResult
      });
    },e.data.time)
  }
};

function postData(url,token,postdata) {
  let prom = new Promise(function (resolve, reject) {

    if (XMLHttpRequest) {
      let xhttp = new XMLHttpRequest();
      xhttp.timeout = 5000;

      xhttp.onload = function () {
        //console.log('DONE', this.status, this.readyState, this.responseText);
        if (this.readyState === 4 && (this.status === 200)) {
          resolve(this.responseText);
        }
        reject({
          readyState: this.readyState,
          status: this.status
        });
      };

      xhttp.timeout = function () {
        reject({
          readyState: this.readyState,
          status: this.status
        });
      };

      xhttp.open("POST", url, true);
      xhttp.setRequestHeader("Content-type", "application/json;charset=utf-8");
      xhttp.setRequestHeader("Authorization", token);

      xhttp.send(JSON.stringify(postdata));
    }
  });
  return prom;
};

async function getSlaPercentage(eData) {
  let res = await postData(eData.url,eData.token,eData.postdata).catch(function (e) {
    console.log(e)
  });
  return res;
  // let mdArr = await dbCall(eData.url);
  // return mdArr
}
// async function dbCall(url) {
//   let res = await ajax(url).catch(function (e) {
//     throw new Error(e);
//   });
//   return res;
// }
