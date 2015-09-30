import path from 'path'
import child_process from 'child_process'
import fs from 'fs'
import semafor from 'semafor'

const api_endpoint = "http://saucelabs.com/rest/v1/storage/"

function validSettings(settings) {
  if(!settings) return new Error("Undefined settings")
  if(!settings.user) return new Error("Undefined user")
  if(!settings.access_key) return new Error("Undefined access_key")
  if(!settings.app_path) return new Error("Undefined app_path")
  try {
    let err = fs.accessSync(settings.app_path, fs.R_OK);
    if(err != null)
      return new Error("Cannot access app_path file, "+settings.app_path);
  }catch(e){
    return new Error("Error accesing app_path file, "+settings.app_path+" "+e.message);
  }
  return null;
}

function getCurlUrl(settings) {
  return [
    api_endpoint,
    settings.user,"/",
    path.basename(settings.app_path),
    "?overwrite=true"
  ].join("")
}

function getParams(settings, curl_url) {
  return [
    "-u",
    settings.user+":"+settings.access_key,
    "-X",
    "POST",
    "-H",
    "Content-Type: application/octet-stream",
    curl_url,
    "--data-binary",
    "@"+settings.app_path
  ]
}

function handleCallback(err, response, cb) {
  if(cb) {
    cb(err, response)
    return
  }
  return [err, response]
}

function uploadSync(settings) {
  return upload(settings, null, true);
}

function upload(settings, cb, sync = false) {
  let err = validSettings(settings);
  if(err) return handleCallback(err, null, cb);

  let curl_url = getCurlUrl(settings)
  let params = getParams(settings, curl_url);

  let logger = semafor()
  if(settings.verbose)
    logger.log("Uploding app to Sauce Labs, this may take a while!")

  if(sync) {
    // sync implementation using spawnSync
    let err = null,
      response = null,
      child = child_process.spawnSync("curl", params);

    if(settings.verbose) {
      logger.log(child.stderr+ " ")
      logger.log(child.stdout+ " ")
    }
    if(child.stdout != undefined) {
      response = child.stdout + "";
      try {
        response = JSON.parse(response);
        if(response.error) err = new Error(response.error)
      }catch(e){
        err = e;
      }
    }
    return handleCallback(err, response, cb);
  }

  // async implementation using spawn
  let err1 = null;
  let response = null;
  let child = child_process.spawn("curl", params)
  child.stderr.on("data", (data) => {
    err1 += data+" "
  })
  child.stdout.on("data", (data) => {
    if(settings.verbose) logger.log(data+" ")
    response = data+" "
  })
  child.on("close", (code) => {
    err1 = err1 != null ? new Error(err1) : null;
    try { response = JSON.parse(response) }catch(e){}
    return handleCallback(err1, response, cb)
  })
}

export default {
  uploadSync: uploadSync,
  upload: upload,
  getCurlUrl: getCurlUrl,
  api_endpoint: api_endpoint,
  getParams: getParams
}
