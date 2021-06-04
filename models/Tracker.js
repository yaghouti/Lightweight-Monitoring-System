const utils = require("../utils");
const errors = require("../configs/errors");
const config = require('../configs')();
const mongodb = require('../utils').mongodb;

const TRACKERS_COLLECTION_NAME = 'trackers';

mongodb.setConfig(config.mongodb);

class Tracker {

  constructor(url, interval, loadingTimeThreshold, userGroups) {
    this._url = url;
    this._interval = interval;
    this._loadingTimeThreshold = loadingTimeThreshold;
    this._userGroups = userGroups;
  }

  async save() {
    try {
      let dbObj = await mongodb.getDbObject();
      let query = {
        url: this._url,
        interval: this._interval,
        loadingTimeThreshold: this._loadingTimeThreshold,
        userGroups: this._userGroups
      };
      await dbObj.collection(TRACKERS_COLLECTION_NAME).insertOne(query);
    }
    catch (e) {
      if (e.hasOwnProperty('code') && e.code === errors.trackerAlreadyExists.code) {
        throw e;
      }
      utils.handleError(errors.createTrackerError, {e});
    }
  }

  static async getAll() {
    try {
      let dbObj = await mongodb.getDbObject();
      return await this._fetchTrackers(dbObj);
    }
    catch (e) {
      if (e.hasOwnProperty('code') && e.code === errors.getTrackersError.code) {
        throw e;
      }
      utils.handleError(errors.getTrackersError, {e});
    }
  }

  static async getByUrl(urls) {
    try {
      let dbObj = await mongodb.getDbObject();
      const trackers = await this._fetchTrackers(dbObj, urls);
      if (urls.length === 1) {
        if (!trackers.length) {
          return null;
        }
        return trackers[0];
      }
      else {
        return trackers;
      }
    }
    catch (e) {
      if (e.hasOwnProperty('code') && e.code === errors.getTrackersError.code) {
        throw e;
      }
      utils.handleError(errors.trackerNotFound, {e});
    }
  }
  
  static async _fetchTrackers(dbObj, urls) {
    try {
      let projection = {_id: 0};
      let query = {};
      if (urls) {
        query.url = {$in: urls};
      }
      return await dbObj.collection(TRACKERS_COLLECTION_NAME).find(query).project(projection).toArray();
    }
    catch (e) {
      utils.handleError(errors.getTrackersError, {e});
    }
  }
}

module.exports = Tracker;