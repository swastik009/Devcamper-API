const express = require('express');
const courseRouter = require('./courses');
const reviewRouter = require('./reviews');

const {
  getBootCamps,
  getBootCamp,
  createBootCamp,
  updateBootCamp,
  deleteBootCamp,
  getBootCampsRadius,
  bootcampPhotoUpload,
} = require('../controllers/bootcamps');

const advancedResults = require('../middleware/advancedResult');
const Bootcamp = require('../models/Bootcamp');

const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

//Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootCamps)
  .post(protect, authorize('publisher', 'admin'), createBootCamp);
router
  .route('/:id')
  .get(getBootCamp)
  .put(protect, authorize('publisher', 'admin'), updateBootCamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootCamp);
router
  .route(protect, authorize('publisher', 'admin'), '/:id/photo')
  .put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);
router.route('/:zipcode/:distance').get(getBootCampsRadius);
module.exports = router;
