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