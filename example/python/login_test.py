import os
from time import sleep

import unittest
import argparse
import json
import re
import subprocess
from appium import webdriver
import sys

PATH = lambda p: os.path.abspath(
    os.path.join(os.path.dirname(__file__), p)
)

class SauceUploadTests(unittest.TestCase):

    def setUp(self):
        app_path  = PATH("../mocha/app-debug.apk")
        keys_path = PATH("../mocha/keys.json")
        with open(keys_path) as data:
            keys = json.load(data)

        # upload ap using sauce-uploader cli
        result = subprocess.check_output(["sauce-uploader", keys["user"], keys["accessKey"], app_path])
        response = json.loads(result)
        try:
            filename = response["filename"]
        except Exception, e:
            print e
            print result
            self.driver.quit()

        desired_caps =  {
            "deviceName":"Android",
            "host":"ondemand.saucelabs.com",
            "port":80,
            "app" : "sauce-storage:%s" % filename,
            "username" : keys["user"],
            "accessKey": keys["accessKey"],
            "app-package":"com.urucas.kriket",
            "appWaitActivity": "com.urucas.kriket.activities.LoginActivity",
            "browserName" : "",
            "platformName":"Android",
            "deviceName": "Android Emulator",
            "platformVersion": "5.0",
            "appium-version" : "1.4.7"
        }
        self.driver = webdriver.Remote("http://ondemand.saucelabs.com:80/wd/hub", desired_caps)

    def tearDown(self):
        # end the session
        self.driver.quit()

    def test_login(self):
        sleep(.5)
        el = self.driver.find_element_by_id("userEmail")
        self.assertIsNotNone(el)
        self.assertTrue(el.is_displayed())
        el.send_keys('test@test.com')
        text = el.get_attribute("text")
        self.assertEqual('test@test.com', text)

        el = self.driver.find_element_by_id("userPass")
        self.assertIsNotNone(el)
        self.assertTrue(el.is_displayed())

        el = self.driver.find_element_by_id("loginBtt")
        self.assertIsNotNone(el)
        self.assertTrue(el.is_displayed())


if __name__ == '__main__':
    # run test
    suite = unittest.TestLoader().loadTestsFromTestCase(SauceUploadTests)
    unittest.TextTestRunner(verbosity=2).run(suite)

