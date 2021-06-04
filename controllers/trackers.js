const errors = require("../configs/errors");
const utils = require("../utils");
const Tracker = require("../models/Tracker");
const UserGroup = require("../models/UserGroup");

/**
 * Controller for creating a tracker
 * @param url
 * @param interval
 * @param loadingTimeThreshold
 * @param userGroups
 */
exports.createTracker = async(url, interval, loadingTimeThreshold, userGroups) => {
  try {
    await checkIfTrackerExists(url);
    await checkIfUserGroupsExist(userGroups);
    let tracker = new Tracker(url, interval, loadingTimeThreshold, userGroups);
    await tracker.save();
  }
  catch (error) {
    utils.log(error, {url});
    throw error;
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
    utils.log(error);
    throw error;
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
    utils.log(error);
    throw error;
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