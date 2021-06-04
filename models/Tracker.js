const axios = require('axios');
const utils = require("../utils");
const errors = require("../configs/errors");
const config = require('../configs')();
const mongodb = require('../utils').mongodb;

const TRACKERS_COLLECTION_NAME = 'trackers';
const TRACKING_DATA_COLLECTION_NAME = 'tracking_data';
const intervals = [];

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
  
  static async getTrackingData(urls) {
    try {
      let dbObj = await mongodb.getDbObject();
      let projection = {_id: 0};
      let query = {};
      if (urls) {
        query.url = {$in: urls};
      }
      return await dbObj.collection(TRACKING_DATA_COLLECTION_NAME).find(query).project(projection).toArray();
    }
    catch (e) {
      utils.handleError(errors.getTrackingDataError, {e});
    }
  }
  
  async track() {
    let self = this;
    if (intervals.hasOwnProperty(self._url)) {
      clearInterval(intervals[self._url].intervalId);
    }
    let intervalId = setInterval(async function _checkUrl() {
        let startTime;
        let endTime;
        let response;
        let trackingData = {url: self._url};
        try {
          startTime = new Date().getTime();
          trackingData.time = startTime;
          response = await axios.get(self._url);
          endTime = new Date().getTime();
          trackingData.loadingTime = endTime - startTime;
          trackingData.statusCode = response.status;
        }
        catch (e) {
          endTime = new Date().getTime();
          trackingData.loadingTime = endTime - startTime;
          trackingData.statusCode = 500;
        }
        finally {
          self._storeTrackingData(trackingData);
          self._informUserGroups(trackingData);
        }
      },
      this._interval);

    intervals[self._url] = {
      intervalId
    }
  }

  async _storeTrackingData(trackingData) {
    try {
      console.log(`Storing tracked data for ${trackingData.url}`);
      let dbObj = await mongodb.getDbObject();
      await dbObj.collection(TRACKING_DATA_COLLECTION_NAME).insertOne(trackingData);
    }
    catch (e) {
      utils.log(errors.storeTrackingDataError, {e});
    }
  }

  async _informUserGroups(trackingData) {
    try {
      this._checkLoadingTimeThreshold(trackingData);
      this._checkStatusCodeChange(trackingData);
    }
    catch (e) {
      this._sendEmail(e.message);
    }
    finally {
      intervals[this._url].lastLoadingTime = trackingData.loadingTime;
      intervals[this._url].lastStatusCode = trackingData.statusCode;
    }
  }

  _checkLoadingTimeThreshold(trackingData) {
    const lastLoadingTime = intervals[this._url].lastLoadingTime || null;
    if (lastLoadingTime && Math.abs(lastLoadingTime - trackingData.loadingTime) > this._loadingTimeThreshold) {
      let error = utils.cloneObject(errors.loadingTimeChange);
      error.message = `Changes in URL: ${this._url} detected\n` +
        `Previous Loading time: ${lastLoadingTime}\n` +
        `Current Loading Time: ${trackingData.loadingTime}`;
      throw error;
    }
  }

  _checkStatusCodeChange(trackingData) {
    const lastStatusCode = intervals[this._url].lastStatusCode || null;
    if (lastStatusCode && lastStatusCode !== trackingData.statusCode) {
      let error = utils.cloneObject(errors.statusCodeChange);
      error.message = `Changes in URL: ${this._url} detected\n` +
        `Previous Status Code: ${lastStatusCode}\n` +
        `Current Status Code: ${trackingData.statusCode}`;
      throw error;
    }
  }

  async _sendEmail(content) {
    await axios.get('https://httpstat.us/201');
    // This is where the email notification gets sent.
    console.log(`Emails sent to ${this._userGroups}`);
    console.log(content);
  }
}

module.exports = Tracker;