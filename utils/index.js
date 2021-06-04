const MongoClient = require('mongodb').MongoClient;
let errors = require("../configs/errors");

// Connection URL
let url = `mongodb://localhost:27017`;

// Database Name
let dbName = 'default';

let client;

exports.mongodb = {
  setConfig(config){
    url = `mongodb://${config.host}:${config.port}`;
    dbName = config.database;
  },
  getDbObject: async function () {
    if (client && client.isConnected()) {
      return client.db(dbName);
    }

    try {
      // Use connect method to connect to the server
      client = await MongoClient.connect(url, {useUnifiedTopology: true, useNewUrlParser: true});
      return client.db(dbName);
    }
    catch (e) {
      handleError(errors.mongoConnError, {e});
    }
  },
  close: function () {
    client.close();
  }
};

function handleError(errorObj, additionalInfo) {
  log(errorObj, additionalInfo);
  throw errorObj;
}

function log(errorObj, additionalInfo) {
  let time = new Date() + '';
  console.error(time, errorObj.code, errorObj.message, additionalInfo ? '\n  |_ Additional Info:' : '', additionalInfo ? additionalInfo : '');
}

function cloneObject(obj) {
  return JSON.parse(JSON.stringify(obj));
}

exports.handleError = handleError;
exports.log = log;
exports.cloneObject = cloneObject;