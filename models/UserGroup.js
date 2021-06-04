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
      await this._checkUserGroupExistence(dbObj);
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

  static async getByName(name) {
    try {
      let dbObj = await mongodb.getDbObject();
      const userGroup = await this._fetchUserGroups(dbObj, name);
      if (!userGroup.length) {
        return null;
      }
      return userGroup[0];
    }
    catch (e) {
      if (e.hasOwnProperty('code') && e.code === errors.getUserGroupsError.code) {
        throw e;
      }
      utils.handleError(errors.getUserGroupsError, {e});
    }
  }

  static async _fetchUserGroups(dbObj, name) {
    try {
      let projection = {_id: 0};
      let query = {};
      if (name) {
        query.name = name;
      }
      return await dbObj.collection(USER_GROUP_COLLECTION_NAME).find(query).project(projection).toArray();
    }
    catch (e) {
      utils.handleError(errors.getUserGroupsError, {e});
    }
  }

  async _checkUserGroupExistence(dbObj) {
    let existingGroup = await dbObj.collection(USER_GROUP_COLLECTION_NAME).findOne({name: this._name});
    if (existingGroup) {
      throw errors.userGroupAlreadyExists;
    }
  }
}

module.exports = UserGroup;