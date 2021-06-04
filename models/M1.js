let mongodb = require('../utils').mongodb;
const errors = require("../configs/errors");
const utils = require("../utils");
const MODEL_COLLECTION_NAME = 'Model';

class Model {
  constructor() {
    
  }

  async save() {
    try {
      let dbObj = await mongodb.getDbObject();
      let query = {
        
      };
      await dbObj.collection(MODEL_COLLECTION_NAME).insertOne(query);
    }
    catch (e) {
      if (e.hasOwnProperty('code') && e.code === errors.modelAlreadyExists.code) {
        throw e;
      }
      utils.handleError(errors.createModelError, {e});
    }
  }

  static async getAll() {
    try {
      let dbObj = await mongodb.getDbObject();
      return await this._fetchModels(dbObj);
    }
    catch (e) {
      if (e.hasOwnProperty('code') && e.code === errors.getModelsError.code) {
        throw e;
      }
      utils.handleError(errors.getModelsError, {e});
    }
  }

  static async _fetchModels(dbObj, urls) {
    try {
      let projection = {_id: 0};
      let query = {};
      if (urls) {
        query.url = {$in: urls};
      }
      return await dbObj.collection(MODEL_COLLECTION_NAME).find(query).project(projection).toArray();
    }
    catch (e) {
      utils.handleError(errors.getModelsError, {e});
    }
  }

  static async checkModelExistence(url) {
    let dbObj = await mongodb.getDbObject();
    let existingModel = await dbObj.collection(MODEL_COLLECTION_NAME).findOne({url});
    if (existingModel) {
      throw errors.modelAlreadyExists;
    }
  }
  
}

module.exports = Model;