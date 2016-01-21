'use strict';

var keyword = 'apple';
var links = [{
  //can add more parameters from the alchemy language sentiment documentation
  targets: keyword,
  url: "http://www.engadget.com/2014/12/11/apple-22-on-glassdoors-2015-best-places-to-work-list/"
}];
var total_score = 0.0;
var total_weight = 0;
var NUM_KEYWORD = 1;
var score;
var watson = require('watson-developer-cloud');
var params;

var alchemy_data_news = watson.alchemy_data_news({
  api_key: '437cec71bb1624d205590209fa9b0161e7f4fff4'
});
var alchemy_language = watson.alchemy_language({
  api_key: '437cec71bb1624d205590209fa9b0161e7f4fff4'
});

var events = require('events');
var EventEmitter = events.EventEmitter;

var flowController = new EventEmitter();

flowController.on('doWork', function (a) {
  if (a >= links.length) {
    flowController.emit('finished');
    return;
  }

  alchemy_language.sentiment(links[a], function (err, response) {
		  	
	  if (err)
	    console.log('error:', err);
	  else {
	  	for (var j = 0; j < NUM_KEYWORD; j++) {
		  	total_weight += 1;
		  	total_score += response.results[j].sentiment.score;
		  	//console.log (total_score);
		  }

	  }
	  flowController.emit('doWork', a + 1);
	});

});

flowController.on('finished', function () {
  	score = total_score / total_weight;
	console.log(score);
});

flowController.emit('doWork', 0);




	// var text = '{'+
 //    '"result": {' +
 //       ' "docs": [' +
 //            '{ "id": "MzQ0MDAxMDI5NnwxNDUyODI0MjUw",' +
 //                '"source": {' +
 //                    '"enriched": {' +
 //                        '"url": {' +
 //                            '"url": "http://www.cnet.com/uk/videos/apple-looks-to-bring-wireless-air-buds-to-the-iphone-7/"'+
 //                '}}}}]}}';

 //     var newsAnalyzed = JSON.parse(text);

	// //(getNews (answer));
	// for (var i = 0; i < 1;i++) {
	// 	console.log(newsAnalyzed.result.docs[i].source.enriched.url.url);
	// }