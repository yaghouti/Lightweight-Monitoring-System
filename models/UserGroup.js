const utils = require("../utils");
const errors = require("../configs/errors");
const config = require('../configs')();
const mongodb = require('../utils').mongodb;

const USER_GROUP_COLLECTION_NAME = 'user_groups';

mongodb.setConfig(config.mongodb);

class UserGroup {
  constructor(name, emails) {
    this._name = name;
    this._emails = emails;
  }

  async save() {
    try {
      let dbObj = await mongodb.getDbObject();
      let query = {name: this._name, emails: this._emails};
      await dbObj.collection(USER_GROUP_COLLECTION_NAME).insertOne(query);
    }
    catch (e) {
      if (e.hasOwnProperty('code') && e.code === errors.userGroupAlreadyExists.code) {
        throw e;
      }
      utils.handleError(errors.createUserGroupError, {e});
    }
  }

  static async getAll() {
    try {
      let dbObj = await mongodb.getDbObject();
      return await this._fetchUserGroups(dbObj);
    }
    catch (e) {
      if (e.hasOwnProperty('code') && e.code === errors.getUserGroupsError.code) {
        throw e;
      }
      utils.handleError(errors.getUserGroupsError, {e});
    }
  }

  static async getByName(names) {
    try {
      let dbObj = await mongodb.getDbObject();
      return await this._fetchUserGroups(dbObj, names);
    }
    catch (e) {
      if (e.hasOwnProperty('code') && e.code === errors.getUserGroupsError.code) {
        throw e;
      }
      utils.handleError(errors.userGroupNotFound, {e});
    }
  }

  static async _fetchUserGroups(dbObj, names) {
    try {
      let projection = {_id: 0};
      let query = {};
      if (names) {
        query.name = {$in: names};
      }
      return await dbObj.collection(USER_GROUP_COLLECTION_NAME).find(query).project(projection).toArray();
    }
    catch (e) {
      utils.handleError(errors.getUserGroupsError, {e});
    }
  }
}

module.exports = UserGroup;