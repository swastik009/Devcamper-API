const express = require('express');

const { getCourses } = require('../controllers/courses');
const { getCourse } = require('../controllers/courses');
const { addCourse } = require('../controllers/courses');
const { updateCourse } = require('../controllers/courses');
const { deleteCourse } = require('../controllers/courses');
const advancedResults = require('../middleware/advancedResult');
const { protect, authorize } = require('../middleware/auth');
const Course = require('../models/Course');
const router = express.Router({ mergeParams: true });
router
  .route('/')
  .get(
    advancedResults(Course, {
      path: 'bootcamp',
      select: 'name',
    }),
    getCourses
  )
  .post(protect, authorize('publisher', 'admin'), addCourse);

router
  .route('/:id')
  .get(getCourse)
  .put(protect, authorize('publisher', 'admin'), updateCourse)
  .delete(protect, authorize('publisher', 'admin'), deleteCourse);

module.exports = router;
