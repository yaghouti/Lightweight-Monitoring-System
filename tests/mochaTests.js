// Hint: To generate mochawesome report, execute mocha mochaTest.js --reporter mochawesome
const assert = require('chai').assert;
const axios = require('axios');
const serverUrl = 'http://localhost:3000/api/v1';

describe('User Group', function () {
  it('Should add a user group', async() => {
    try {
      let response = await axios.post(
        serverUrl + '/userGroups',
        {
          "name": "testUserGroupName",
          "emails": [
            "majid.yaghouti@gmail.com"
          ]
        });
      assert.deepEqual(response.data, {
        "message": "User group 'testUserGroupName' created."
      });
    }
    catch (e) {
      throw new Error(e);
    }
  });

  it('Should get user groups', async() => {
    try {
      let response = await axios.get(serverUrl + '/userGroups');
      assert.typeOf(response.data.groups, 'array');
      response.data.groups.forEach(group => {
        assert.hasAllKeys(group, [
          'name', 'emails'
        ]);
      });
    }
    catch (e) {
      throw new Error(e);
    }
  });
});

describe('Tracker', function () {
  it('Should add a tracker', async() => {
    try {
      let response = await axios.post(
        serverUrl + '/trackers',
        {
          "url": "https://www.google.com",
          "interval": 20,
          "loadingTimeThreshold": 300,
          "userGroups": [
            "testUserGroupName"
          ]
        });
      assert.deepEqual(response.data, {
        "message": "Tracker for URL: 'https://www.google.com' created."
      });
    }
    catch (e) {
      throw new Error(e);
    }
  });

  it('Should get trackers', async() => {
    try {
      let response = await axios.get(serverUrl + '/trackers');
      assert.typeOf(response.data.trackers, 'array');
      response.data.trackers.forEach(tracker => {
        assert.hasAllKeys(tracker, [
          'url', 'interval', 'loadingTimeThreshold', 'userGroups'
        ]);
      });
    }
    catch (e) {
      throw new Error(e);
    }
  });

  it('Should get tracking data', async() => {
    try {
      let response = await axios.get(serverUrl + '/trackers/data');
      assert.typeOf(response.data, 'array');
      response.data.forEach(tracker => {
        assert.hasAllKeys(tracker, [
          'url', 'time', 'loadingTime', 'statusCode'
        ]);
      });
    }
    catch (e) {
      throw new Error(e);
    }
  });
});