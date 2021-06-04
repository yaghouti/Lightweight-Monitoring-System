const fs = require('fs');
const axios = require('axios');
const express = require('express');
let bodyParser = require('body-parser');
let {Validator, ValidationError} = require("express-json-validator-middleware");
const {validate} = new Validator();
let logger = require('morgan');
const config = require('./configs')();
const app = express();

start();

async function start() {
  app.use(logger('dev'));
  app.use(bodyParser.json({limit: '10mb'}));
  app.use(bodyParser.urlencoded({extended: true, limit: '10mb'}));
  app.use(express.static(__dirname + '/views'));
  await loadRoutes();

  /**
   * Error handler middleware for validation errors.
   */
  app.use((error, request, response, next) => {
    console.log('------------', error);
    // Check the error is a validation error
    if (error instanceof ValidationError) {
      // Handle the error
      response.status(400).send(error.validationErrors);
      next();
    }
    else {
      // Pass error on if not a validation error
      next(error);
    }
  });
  app.listen(config.server.port, () => {
    console.log(`Server is listening on port ${config.server.port}!`);
    startTracking();
  });

}

function loadRoutes() {
  return new Promise(function (resolve, reject) {
    fs.readdir('./routes', function (error, files) {
      if (error) {
        console.log('Error while loading routes!');
        reject(error);
      }

      files.forEach(function (file) {
        let routesList = require('./routes/' + file);
        routesList.forEach(function (routeObj) {
          if (routeObj.hasOwnProperty('schema')) {
            app[routeObj.method](routeObj.route, validate(routeObj.schema), routeObj.handler);
          }
          else {
            app[routeObj.method](routeObj.route, routeObj.handler);
          }
        });
      });

      resolve();
    });
  })
}

async function startTracking() {
  try{
    await axios.get(`http://localhost:${config.server.port}/api/v1/trackers/starter`);
  }
  catch (e){
    console.log(e);
  }
}