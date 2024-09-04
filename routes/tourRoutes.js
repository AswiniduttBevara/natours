const express = require('express');

const tourController = require('../controller/tourController');
const authController = require('./../controller/authController');

const router = express.Router();

////////////////////////////////////////////
// Running the application using json files on folder

// router.param('id', tourController.checkId)
// router.route('/').get(tourController.getTours).post(tourController.checkBody, tourController.createTour);
router.route('/top-5-tours').get(tourController.aliasTopTour, tourController.getAllTours);
router.route('/tour-stats').get(tourController.getTourStats);
router.route('/yearPlan/:year').get(tourController.yearlyPlan);
router.route('/').get(authController.protect, tourController.getAllTours).post(tourController.createTour);
router.route('/:id').get(tourController.getTour).patch(tourController.updateTour).delete(authController.protect, authController.restrict('admin','lead-guide'), tourController.deleteTour);

module.exports = router;