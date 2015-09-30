import uploader from "../lib/"

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


})
