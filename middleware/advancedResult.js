const { populate } = require('../models/Course');

const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  //Copy req query
  const reqQuery = { ...req.query };

  //Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  //Loop over removeFields and delete from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  //Create query string
  let queryStr = JSON.stringify(reqQuery);

  //create operators ($gt,$gte,etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  //Finding resource
  query = model.find(JSON.parse(queryStr));

  //Select particular fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query.select(fields);
  }

  //sorting
  if (req.query.sort) {
    const sortBy = req.query.select.split(',').join(' ');
    query.sort(sortBy);
  } else query.sort('-createdAt');

  //Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  //const total = await model.countDocuments(); //get total numbers of documents in Bootcamp collections

  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  //Executing Query
  const results = await query;
  const total = await model.count({}, function (err, count) {
    return count;
  });

  pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      current_page: page,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      current_page: page,
      limit,
    };
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    total,
    data: results,
  };

  next();
};

module.exports = advancedResults;
