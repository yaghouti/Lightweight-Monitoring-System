const errors = require("../configs/errors");
const utils = require("../utils");
const M1 = require("../models/M1");

/**
 * Controller for creating model
 */
exports.createModel = async(data) => {
  try {
    let m1 = await new M1(data);
    await m1.save();
  }
  catch (error) {
    utils.log(error, {url});
    throw error;
  }
};

/**
 * Controller for getting all models
 */
exports.getAllModels = async() => {
  try {
    return M1.getAll();
  }
  catch (error) {
    utils.log(error, {url});
    throw error;
  }
};