'use strict';

var watson = require('watson-developer-cloud');

var alchemy_data_news = watson.alchemy_data_news({
  api_key: '437cec71bb1624d205590209fa9b0161e7f4fff4'
});

var params = {
  start: 'now-1d',
  end: 'now',
  //set number of entries returned
  count: 10,
  'q.enriched.url.enrichedTitle.relations.relation': '|action.verb.text=acquire,object.entities.entity.type=Company|',
  return: 'enriched.url.title,enriched.url.url'
};

alchemy_data_news.getNews(params, function (err, news) {
  if (err)
    console.log('error:', err);
  else {
	
	//include parsing functions here

  }
});