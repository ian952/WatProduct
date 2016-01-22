'use strict';

var keyword = 'iPhone';
var links = [];
var total_score = 0;
var total_weight = 0;
var NUM_KEYWORD = 1;
var NUM_LINKS = 20;
var score;
var watson = require('watson-developer-cloud');
var params = {
  start: 'now-1d',
  end: 'now',
  //set number of entries returned
  count: NUM_LINKS,
  'q.enriched.url.enrichedTitle.keywords.keyword.text':keyword,
  return: 'enriched.url.url,enriched.url.title'
};

var alchemy_data_news = watson.alchemy_data_news({
  api_key: 'b87dde35a90f3c811699dd78c9a78ef86cb255a3'
});
var alchemy_language = watson.alchemy_language({
  //api_key: '437cec71bb1624d205590209fa9b0161e7f4fff4'
  api_key: 'b87dde35a90f3c811699dd78c9a78ef86cb255a3'
});

var events = require('events');
var EventEmitter = events.EventEmitter;

var flowController = new EventEmitter();

flowController.on('news', function() {
	alchemy_data_news.getNews(params, function (err, news) {
	  if (err)
	    console.log('error:', err);
	  else {
		for (var i = 0; i < NUM_LINKS; i ++) {
			//console.log(news.result.docs[i].source.enriched.url.url);
			links.push ({targets: keyword, url: news.result.docs[i].source.enriched.url.url});
		}
	  }

	  flowController.emit ('sentiment',0);
	});
});

flowController.on('sentiment', function (a) {
  if (a >= links.length) {
    flowController.emit('finished');
    return;
  }

  alchemy_language.sentiment(links[a], function (err, response) {
	  if (err){
	    console.log('error:', err);
		console.log (links[a].url);
	  }else {
	  	for (var j = 0; j < NUM_KEYWORD; j++) {
		  	total_weight += 1;

		  	total_score += parseFloat(response.results[j].sentiment.score);

		  	console.log (links[a].url);
		  	console.log (response.results[j].sentiment.score);
		  	//console.log (total_weight);
		  	//console.log (total_score);
		  }

	  }
	  flowController.emit('sentiment', a + 1);
	});

});

flowController.on('finished', function () {
  	score = total_score / total_weight;
	console.log(score);
});

flowController.emit('news');




	// //(getNews (answer));
	// for (var i = 0; i < 1;i++) {
	// 	console.log(newsAnalyzed.result.docs[i].source.enriched.url.url);
	// }