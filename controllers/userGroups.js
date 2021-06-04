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
    utils.log(error, {name});
    throw error;
  }
};

async function checkIfUserGroupExists(name) {
  let userGroup = await UserGroup.getByName([name]);
  if (userGroup) {
    throw errors.userGroupAlreadyExists;
  }
}