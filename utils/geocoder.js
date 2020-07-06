const NodeGeoCoder = require('node-geocoder');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });
const options = {
  provider: process.env.GEOCODE_PROVIDER,
  httpAdapter: 'https',
  apiKey: process.env.GEOCODE_API_KEY,
  formatter: null, // 'gpx', 'string', ...
};

const geocoder = NodeGeoCoder(options);

module.exports = geocoder;
