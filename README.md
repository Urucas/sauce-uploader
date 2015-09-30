# sauce-updaloder [![Build Status](https://travis-ci.org/Urucas/sauce-updaloder.svg)](https://travis-ci.org/Urucas/sauce-updaloder)

Are yu planning to run some Appium tests on Sauce Labs ? Make sure you upload
your app first. Use sauce-uploader, let him handle it for you.

#Install
```bash
npm install --save sauce-uploader
```

#Usage
** API **
```javascript
import uploader from 'sauce-uploader'
uploader.upload({user:user, access_key:access_key, app_path:app_path}, (err, response) {
});

// sync
let [err, response] = uploader.uploadSync({});
```

