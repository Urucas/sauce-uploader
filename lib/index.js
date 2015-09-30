import path from 'path'
import child_process from 'child_process'
import fs from 'fs'

const api_endpoint = "https://saucelabs.com/rest/v1/storage/"

function validSettings(settings) {
  if(!settings) return new Error("Undefined settings")
  if(!settings.user) return new Error("Undefined user")
  if(!settings.access_key) return new Error("Undefined access_key")
  if(!settings.app_path) return new Error("Undefined app_path")
  try {
    let err = fs.accessSync(settings.app_path, fs.R_OK);
    if(err != null)
      return new Error("Cannt access app_path file, "+settings_app_path);
  }catch(e){
    return new Error("Error accesing app_path file, "+settings_app_path+" "+e.message);
  }
  return null;
}

function uploadSync(settings) {
  return upload(settings, true);
}

function upload(settings, sync = false) {
  let err = validSettings(settings);
  if(err) return [err, null];
}

export default sauceUploader = {
  uploadSync: uploadSync,
  upload: upload
}
