'use strict';

var watson = require('watson-developer-cloud');

var alchemy_data_news = watson.alchemy_data_news({
  api_key: '437cec71bb1624d205590209fa9b0161e7f4fff4'
});

//insert keyword here
var keyWord = '';

var params = {
  start: 'now-1d',
  end: 'now',
  //set number of entries returned
  count: 10,
  'q.enriched.url.enrichedTitle.keywords.keyword.text':keyWord,
  return: 'enriched.url.url,enriched.url.title'
};

alchemy_data_news.getNews(params, function (err, news) {
  if (err)
    console.log('error:', err);
  else {
	//Insert function here
	console.log(JSON.stringify(news, null, 2));

  }
});