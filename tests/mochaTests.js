// Hint: To generate mochawesome report, execute mocha mochaTest.js --reporter mochawesome
const assert = require('chai').assert;
const axios = require('axios');
const serverUrl = 'http://localhost:3000/api/v1';

describe('Model', function () {
  it('Should add a model', async() => {
    try {
      let response = await axios.post(
        serverUrl + '/models',
        {
          
        });
      assert.deepEqual(response.data, {
        
      });
    }
    catch (e) {
      throw new Error(e);
    }
  });

  it('Should get models', async() => {
    try {
      let response = await axios.get(serverUrl + '/models');
      assert.typeOf(response.data.models, 'array');
      response.data.models.forEach(model => {
        assert.hasAllKeys(model, [
          'key1', 'key2'
        ]);
      });
    }
    catch (e) {
      throw new Error(e);
    }
  });
});