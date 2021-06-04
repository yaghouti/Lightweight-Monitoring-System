const utils = require('../utils');
const errors = require('../configs/errors');
const userGroupsController = require('../controllers/userGroups');
const createUserGroupSchema = require('../schema/createUserGroup.json');
const getUserGroupsByNameSchema = require('../schema/getUserGroupsByName.json');

module.exports = [
  {method: 'post', route: '/api/v1/userGroups', schema: {body: createUserGroupSchema}, handler: createUserGroup},
  {method: 'get', route: '/api/v1/userGroups', handler: getUserGroups},
  {
    method: 'get',
    route: '/api/v1/userGroups/:name',
    schema: {params: getUserGroupsByNameSchema},
    handler: getUserGroupsByName
  }
];

/**
 * Route handler for creating a user group
 * @param req
 * @param res
 */
async function createUserGroup(req, res) {
  let name = null;
  let emailsList = null;
  try {
    name = req.body.name;
    emailsList = req.body.emails;
    await userGroupsController.createUserGroup(name, emailsList);
    res.status(200).json({message: `User group '${name}' created.`});
  }
  catch (error) {
    switch (error.code) {
      case errors.userGroupAlreadyExists.code:
        res.status(409).send({error: error});
        break;
      case errors.createUserGroupError.code:
        res.status(500).send({error: error});
        break;
      default:
        utils.log(errors.internalServerError, error);
        res.status(500).send({error: errors.internalServerError});
    }
  }
}

/**
 * Route handler for getting user groups
 * @param req
 * @param res
 */
async function getUserGroups(req, res) {
  try {
    const userGroups = await userGroupsController.getUserGroups();
    res.status(200).json({groups: userGroups});
  }
  catch (error) {
    switch (error.code) {
      case errors.getUserGroupsError.code:
        res.status(500).send({error: error});
        break;
      default:
        utils.log(errors.internalServerError, error);
        res.status(500).send({error: errors.internalServerError});
    }
  }
}


/**
 * Route handler for getting user groups by name
 * @param req
 * @param res
 */
async function getUserGroupsByName(req, res) {
  let name = null;
  try {
    name = req.params.name;
    const userGroup = await userGroupsController.getUserGroupsByName(name);
    res.status(200).json(userGroup);
  }
  catch (error) {
    switch (error.code) {
      case errors.getUserGroupsError.code:
        res.status(500).send({error: error});
        break;
      case errors.userGroupNotFound.code:
        res.status(404).send({error: error});
        break;
      default:
        utils.log(errors.internalServerError, error);
        res.status(500).send({error: errors.internalServerError});
    }
  }
}