'use strict';
var watson = require('watson-developer-cloud');
 
var alchemy_language = watson.alchemy_language({
  api_key: 'b87dde35a90f3c811699dd78c9a78ef86cb255a3'
});
 
var params = {
  //can add more parameters from the alchemy language sentiment documentation
  targets: 'apple',
  url: 'http://www.cnet.com/uk/how-to/how-to-stream-youtube-audio-on-a-locked-iphone/'
};
 
alchemy_language.sentiment(params, function (err, response) {
  if (err)
    console.log('error:', err);
  else
    console.log(JSON.stringify(response, null, 2));
});
