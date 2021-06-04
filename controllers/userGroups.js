const utils = require("../utils");
const errors = require("../configs/errors");
const UserGroup = require("../models/UserGroup");

/**
 * Controller for creating a user group
 * @param name
 * @param emailsList
 */
exports.createUserGroup = async (name, emailsList) => {
  try {
    await checkIfUserGroupExists(name);
    let userGroup = new UserGroup(name, emailsList);
    await userGroup.save();
  }
  catch (error) {
    utils.handleError(error, {name});
  }
};


/**
 * Controller for getting user groups
 */
exports.getUserGroups = async () => {
  try {
    return await UserGroup.getAll();
  }
  catch (error) {
    utils.handleError(error);
  }
};

/**
 * Controller for getting user groups by name
 * @param name
 */
exports.getUserGroupsByName = async (name) => {
  try {
    const userGroups = await UserGroup.getByName(name);
    if (!userGroups) {
      throw errors.userGroupNotFound;
    }

    return userGroups;
  }
  catch (error) {
    utils.handleError(error);
  }
};

async function checkIfUserGroupExists(name) {
  let userGroup = await UserGroup.getByName(name);
  if (userGroup) {
    throw errors.userGroupAlreadyExists;
  }
}