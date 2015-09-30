# sauce-updaloder [![Build Status](https://travis-ci.org/Urucas/sauce-updaloder.svg)](https://travis-ci.org/Urucas/sauce-updaloder)

Are yu planning to run some Appium tests on Sauce Labs ? Make sure you upload
your app first. Use sauce-uploader, let him handle it for you.

#Install
```bash
npm install --save sauce-uploader
```

#Usage
**API**
```javascript
import uploader from 'sauce-uploader'
let settings = {user:"user", access_key:"access_key", app_path:"full_path_to_app"}
uploader.upload(settings, (err, response) {
   // handle callback
});

// sync
let [err, response] = uploader.uploadSync(settings);
```
Voila! Now run your appium test on Sauce Labs cloud!


#Requirements
* curl
