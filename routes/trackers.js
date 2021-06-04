const utils = require('../utils');
const errors = require('../configs/errors');
const trackersController = require('../controllers/trackers');
const createTrackerSchema = require('../schema/createTracker.json');
const getTrackersSchema = require('../schema/getTrackers.json');

module.exports = [
  {method: 'post', route: '/api/v1/trackers', schema: {body: createTrackerSchema}, handler: createTracker},
  {method: 'get', route: '/api/v1/trackers', schema: {query: getTrackersSchema}, handler: getTrackers}
];

/**
 * Route handler for creating a tracker
 * @param req
 * @param res
 */
async function createTracker(req, res) {
  let url = null;
  let interval = null;
  let loadingTimeThreshold = null;
  let userGroups = null;
  try {
    url = req.body.url;
    interval = req.body.interval * 1000;
    loadingTimeThreshold = req.body.loadingTimeThreshold;
    userGroups = req.body.userGroups;
    await trackersController.createTracker(url, interval, loadingTimeThreshold, userGroups);
    res.status(200).json({message: `Tracker for URL: '${url}' created.`});
  }
  catch (error) {
    switch (error.code) {
      case errors.trackerAlreadyExists.code:
        res.status(409).send({error: error});
        break;
      case errors.userGroupNotFound.code:
        res.status(404).send({error: error});
        break;
      case errors.createTrackerError.code:
        res.status(500).send({error: error});
        break;
      default:
        utils.log(errors.internalServerError, error);
        res.status(500).send({error: errors.internalServerError});
    }
  }
}

/**
 * Route handler for getting trackers
 * @param req
 * @param res
 */
async function getTrackers(req, res) {
  try {
    if (req.query && req.query.hasOwnProperty('url')) {
      const tracker = await trackersController.getTrackersByUrl(req.query.url);
      res.status(200).json(tracker);
    }
    else {
      const trackers = await trackersController.getAllTrackers();
      res.status(200).json({trackers});
    }
  }
  catch (error) {
    switch (error.code) {
      case errors.getTrackersError.code:
        res.status(500).send({error: error});
        break;
      default:
        utils.log(errors.internalServerError, error);
        res.status(500).send({error: errors.internalServerError});
    }
  }
}