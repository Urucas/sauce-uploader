import uploader from "../lib/"
import path from 'path'
import fs from 'fs'
import isPlain from 'is-plain-obj'

describe("Test sauce-uploader", () => {

  it("should throw an error on empty settings", (done) => {
    let [err, response] = uploader.uploadSync();
    if(err == null)
      throw new Error("method should have thrown an error on empty settings");
    if(err.message != "Undefined settings")
      throw new Error("method should have thrown an error with message \"Undefined settings\", actual: "+err.message)
    done();
  })

  it("should throw an error on empty user", (done) => {
    let [err, response] = uploader.uploadSync({});
    if(err == null)
      throw new Error("method should have thrown an error on empty user");
    if(err.message != "Undefined user")
      throw new Error("method should have thrown an error with message \"Undefined user\", actual: "+err.message)
    done();
  })

  it("should throw an error on empty access_key", (done) => {
    let [err, response] = uploader.uploadSync({user:"user"});
    if(err == null)
      throw new Error("method should have thrown an error on empty access_key");
    if(err.message != "Undefined access_key")
      throw new Error("method should have thrown an error with message \"Undefined access_key\", actual: "+err.message)
    done();
  })

  it("should throw an error on empty app_path", (done) => {
    let [err, response] = uploader.uploadSync({user:"user", access_key:"access_key"});
    if(err == null)
      throw new Error("method should have thrown an error on empty app_path");
    if(err.message != "Undefined app_path")
      throw new Error("method should have thrown an error with message \"Undefined app_path\", actual: "+err.message)
    done();
  })

  it("should throw an error on missing app_path file", (done) => {
    let [err, response] = uploader.uploadSync({user:"user", access_key:"access_key", app_path:"tmp.apk"});
    if(err == null)
      throw new Error("method should have thrown an error on missing app_path file");
    done();
  })

  it("should handle callback", (done) => {
    let settings = {user: "user1"}
    uploader.upload(settings, (err, response) => {
      done();
    });
  })

  it("should create the correct curl_url", (done) => {
    let settings = {
      user: "user1",
      access_key: "acccess_key1",
      app_path: "tmp1.apk"
    }
    let curl_url = uploader.getCurlUrl(settings)
    let regex = new RegExp("ˆ"+uploader.api_endpoint)
    if(regex.test(curl_url))
      throw new Error("curl url should start with api_endpoint, "+curl_url)

    let app_name = path.basename(settings.app_path)
    if(curl_url.indexOf([settings.user,app_name].join("/")) == -1)
       throw new Error("curl url missing user/app_name, "+ curl_url)

    done();
  })

  it("should create the correct curl_url params", (done) => {
    let settings = {
      user: "user1",
      access_key: "acccess_key1",
      app_path: "tmp1.apk"
    }
    let curl_url = uploader.getCurlUrl(settings)
    let params   = uploader.getParams(settings, curl_url)

    let must_params = [
      "-u", settings.user+":"+settings.access_key, "-X",
      "POST", "-H", "Content-Type: application/octet-stream",
      curl_url,  "--data-binary", "@"+settings.app_path

    ]
    for(let key in must_params) {
      if(params.indexOf(must_params[key]) == -1)
        throw new Error("Missing param, "+must_params[key])
    }
    done();
  })

  it("should return a destructure response [err, response]", (done) => {
    // create tmp file
    let tmp = path.join(process.cwd(), "tests", "tmp.apk")
    fs.closeSync(fs.openSync(tmp,'w+'))
    let settings = {
      user: "user1",
      access_key: "acccess_key1",
      app_path: tmp
    }
    let [err, response] = uploader.uploadSync(settings);
    if(err != null && err.constructor.name != "Error")
      throw new Error("error returned should be null or instance of Error");
    if(response != null && !isPlain(response))
       throw new Error("response returned should be null or plain object")
    done();
  })
})
