var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();
var wd = require('wd');
var path = require('path')
var apk_path = path.join(process.cwd(), "app-debug.apk")
var keys = require(path.join(process.cwd(), 'keys.json'))

// uploading apk to Sauce Labs
console.log("Uploading apk to Sauce Labs, this may take a while!")
var uploader = require("../dist/index.js");
var result = uploader.uploadSync({user:keys["user"], access_key:keys["accessKey"], app_path:apk_path});
if(result[0] != null) {
  console.log(result[0]);
  return;
}
console.log(result[1]);
var app = ["sauce-storage", result[1]["filename"].trim()].join(":")
var caps = {
  "deviceName":"Android",
  "host":"ondemand.saucelabs.com",
  "port":80,
  "app" : app,
  "username" : keys["user"],
  "accessKey": keys["accessKey"],
  "app-package":"com.urucas.kriket",
  "app-wait-activity": "com.urucas.kriket.activities.LoginActivity",
  "browserName" : "",
  "platformName":"Android",
  "deviceName": "Android Emulator",
  "platformVersion": "5.0", 
  "appium-version" : "1.4.7"
}
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

// run appium test
describe('Test kriket login', function() {
  this.timeout(0);

  describe("Checking all elements are displayed", function() {
    var browser;
    
    before(function() {
      browser = wd.promiseChainRemote(caps);
      return browser
        .init(caps);
    });

    after(function() {
      return browser
        .quit();
    });
    
    it("should find email & password edtiText", function(done) {
      browser
      .elementById("userEmail")
      .isDisplayed()
      .then(function(isDisplayed){
        isDisplayed.should.equal(true)
      })
      .elementById("userEmail")
      .sendKeys("tests@test.com")
      .text()
      .then(function(text){
        text.should.equal("tests@test.com")
      })
      .elementById("userPass")
      .isDisplayed()
      .then(function(isDisplayed){
        isDisplayed.should.equal(true)
      })
      .elementById("userPass")
      .type("pass")
      .hideKeyboard()
      .elementById("loginBtt")
      .isDisplayed()
      .then(function(isDisplayed){
        isDisplayed.should.equal(true)
      })
      .nodeify(done);
    });
     
  });

});

