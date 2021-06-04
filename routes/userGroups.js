const utils = require('../utils');
const errors = require('../configs/errors');
const userGroupsController = require('../controllers/userGroups');
const createUserGroupSchema = require('../schema/createUserGroup.json');

module.exports = [
  {method: 'post', route: '/api/v1/userGroups', schema: {body: createUserGroupSchema}, handler: createUserGroup}
];

/**
 * Controller for creating a user group
 * @param req
 * @param res
 */
async function createUserGroup(req, res) {
  let name = null;
  let emailsList = null;
  try {
    name = req.body.name;
    emailsList = req.body.emails;
    userGroupsController.createUserGroup(name, emailsList);
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