const utils = require('../utils');
const errors = require('../configs/errors');
const modelsController = require('../controllers/c1');
const createModelSchema = require('../schema/createModel.json');
const getModelsSchema = require('../schema/getModels.json');

module.exports = [
  {method: 'post', route: '/api/v1/models', schema: {body: createModelSchema}, handler: createModel},
  {method: 'get', route: '/api/v1/models', schema: {query: getModelsSchema}, handler: getModels}
];

/**
 * Controller for creating a model
 * @param req
 * @param res
 */
async function createModel(req, res) {
  let data = null;
  try {
    data = req.body.data;
    await modelsController.createModel(data);
    res.status(200).json({message: `Model created.`});
  }
  catch (error) {
    switch (error.code) {
      case errors.modelAlreadyExists.code:
        res.status(409).send({error: error});
        break;
      case errors.createModelError.code:
        res.status(500).send({error: error});
        break;
      default:
        utils.log(errors.internalServerError, error);
        res.status(500).send({error: errors.internalServerError});
    }
  }
}

/**
 * Controller for getting models
 * @param req
 * @param res
 */
async function getModels(req, res) {
  try {
    const models = await modelsController.getAllModels();
    res.status(200).json({models});
  }
  catch (error) {
    switch (error.code) {
      case errors.getModelsError.code:
        res.status(500).send({error: error});
        break;
      default:
        utils.log(errors.internalServerError, error);
        res.status(500).send({error: errors.internalServerError});
    }
  }
}