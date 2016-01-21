'use strict';
var watson = require('watson-developer-cloud');
 
var alchemy_language = watson.alchemy_language({
  api_key: '437cec71bb1624d205590209fa9b0161e7f4fff4'
});
 
var params = {
  //can add more parameters from the alchemy language sentiment documentation
  targets: 'apple|person',
  url: 'http://www.engadget.com/2014/12/11/apple-22-on-glassdoors-2015-best-places-to-work-list/'
};
 
alchemy_language.sentiment(params, function (err, response) {
  if (err)
    console.log('error:', err);
  else
    console.log(JSON.stringify(response, null, 2));
});
