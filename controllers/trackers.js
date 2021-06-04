const errors = require("../configs/errors");
const utils = require("../utils");
const Tracker = require("../models/Tracker");
const UserGroup = require("../models/UserGroup");

/**
 * Controller for creating a tracker
 * @param {string} url
 * @param {number} interval The interval between two checks of the url
 * @param {number} loadingTimeThreshold A threshold in milliseconds to be considered as a change in loading time
 * @param {string[]} userGroups List of user groups to be informed of changes
 * @return undefined
 */
exports.createTracker = async(url, interval, loadingTimeThreshold, userGroups) => {
  try {
    await checkIfTrackerExists(url);
    await checkIfUserGroupsExist(userGroups);
    let tracker = new Tracker(url, interval, loadingTimeThreshold, userGroups);
    await tracker.save();
    tracker.track();
  }
  catch (error) {
    utils.handleError(error, {url});
  }
};

/**
 * Controller for getting trackers
 */
exports.getAllTrackers = async() => {
  try {
    return await Tracker.getAll();
  }
  catch (error) {
    utils.handleError(error);
  }
};

/**
 * Controller for getting trackers by url
 * @param url
 */
exports.getTrackersByUrl = async(url) => {
  try {
    return await Tracker.getByUrl([url]);
  }
  catch (error) {
    utils.handleError(error);
  }
};

/**
 * Controller to start tracking
 */
exports.startTracking = async() => {
  try {
    const trackersList = await Tracker.getAll();
    trackersList.forEach(trackerData => {
      let tracker = new Tracker(trackerData.url, trackerData.interval, trackerData.userGroups);
      tracker.track();
    });
    return trackersList.length;
  }
  catch (error) {
    utils.handleError(error);
  }
};

/**
 * Controller to get tracking data
 */
exports.getAllTrackingData = async() => {
  try {
    return await Tracker.getTrackingData();
  }
  catch (error) {
    utils.handleError(error);
  }
};

/**
 * Controller to get tracking data by url
 * @param url
 */
exports.getTrackingDataByUrl = async(url) => {
  try {
    return await Tracker.getTrackingData([url]);
  }
  catch (error) {
    utils.handleError(error);
  }
};

async function checkIfUserGroupsExist(userGroups) {
  let existingGroups = await UserGroup.getByName(userGroups);
  let notFounds = [];
  userGroups.forEach(userGroup => {
    if (findInList(existingGroups, userGroup) === -1) {
      notFounds.push(userGroup);
    }
  });
  if (notFounds.length) {
    let error = utils.cloneObject(errors.userGroupNotFound);
    error.notFounds = notFounds;
    throw error;
  }
}

async function checkIfTrackerExists(url) {
  let tracker = await Tracker.getByUrl([url]);
  if (tracker) {
      throw errors.trackerAlreadyExists;
  }
}

function findInList(list, item) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].name === item) {
      return i;
    }
  }
  return -1;
}