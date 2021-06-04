const MongoClient = require('mongodb').MongoClient;
const config = require('../configs/index')();
let errors = require("../configs/errors");

// Connection URL
const url = `mongodb://${config.mongo.host}:${config.mongo.port}`;

// Database Name
const dbName = config.mongo.database;

let client;

exports.mongodb = {
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