import path from 'path'
import child_process from 'child_process'
import fs from 'fs'
import semafor from 'semafor'
import request from 'request'
import syncRequest from 'sync-request'
import md5 from 'md5'

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

  let logger = semafor()
  if(settings.verbose)
    logger.log("Uploding app to Sauce Labs, this may take a while!")

  if(!sync) {
    postRequest(settings, (err, response) => {
      handleCallback(err, response, cb);
    });
    return
  }

  let [err1, response1] = syncPostRequest(settings)
  return handleCallback(err1, response1, null)
}

function getRequestOptions(settings) {
  let auth = "Basic "+ new Buffer([settings.user, settings.access_key].join(":")).toString('base64')
  let bin  = fs.readFileSync(settings.app_path)
  let req  = {
    url: getCurlUrl(settings),
    method: "POST",
    headers : {
      "Authorization" : auth,
      "Content-Type" : "application/octet-stream"
    },
    body : bin
  }
  return req
}

function syncPostRequest(settings) {
  let req = getRequestOptions(settings)
  let md5_hash = md5(req.body)
  var json = {}, err = null, res;
  try {
    res = syncRequest('POST', getCurlUrl(settings), req)
    if(res.statusCode != 200)
      err = new Error("API responded with code "+res.statusCode)
    try { 
      json = JSON.parse(res.body+"") 
      if(md5_hash != json.d5) 
        err = new Error("Error veryfing uploaded file hash, expected: "+md5_file+" actual:"+json.md5)
    }catch(e){}
  }catch(e){
    err = e
  }
  return [err, json]
}

function postRequest(settings, cb) {
  let req = getRequestOptions(settings)
  let md5_hash = md5(req.body)
  request(req, (err, response, body) => {
    let json = body
    try { 
      json = JSON.parse(body) 
    }catch(e){}
    cb(err, json)
  })
}

export default {
  uploadSync: uploadSync,
  upload: upload,
  getCurlUrl: getCurlUrl,
  api_endpoint: api_endpoint
}
