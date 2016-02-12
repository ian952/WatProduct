/*
 * Module dependencies
 */
var express = require('express')
  , fs = require('fs')
  , stylus = require('stylus')
  , nib = require('nib')
  , http = require('http')
  , path = require('path');
var keyword = 'Surface';
var links = [];
var total_score = 0;
var total_weight = 0;
var NUM_KEYWORD = 1;
var NUM_LINKS = 5;
var score = 0;
var watson = require('watson-developer-cloud');
var params = {
  start: 'now-1d',
  end: 'now',
  //set number of entries returned
  count: NUM_LINKS,
  'q.enriched.url.enrichedTitle.keywords.keyword.text':keyword,
  return: 'enriched.url.url,enriched.url.title'
};
var events = require('events');
var EventEmitter = events.EventEmitter;
var bodyParser = require('body-parser');


function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

var flowController = new EventEmitter();

var alchemy_data_news = watson.alchemy_data_news({
  api_key: 'b87dde35a90f3c811699dd78c9a78ef86cb255a3'
});
var alchemy_language = watson.alchemy_language({
  //api_key: '437cec71bb1624d205590209fa9b0161e7f4fff4'
  api_key: 'b87dde35a90f3c811699dd78c9a78ef86cb255a3'
});

var app = express()

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.logger('dev'))
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
))
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/', function(req, res) {
    console.log(req.body.product_name); // show the value of the text box
    keyword = req.body.product_name;
});

app.get('/', function (req, res) {
  flowController.emit('news');
  flowController.on ('render',function () {

    var msg;
    if (score > 0.5) {
      msg = 'Overwhelmingly Positive';
    } else if (score > 0.05 && score <= 0.5) {
      msg = 'Positive';
    } else if (score >= -0.05 && score <= 0.05) {
      msg = 'Neutral';
    } else if (score < -0.05 && score >= -0.5) {
      msg = 'Negative';
    } else if (score < -0.5){
      msg = 'Overwhelmingly Negative';
    } else {
      msg = 'Error';
    }

    res.render('index',
    { title : 'Home', product : keyword, scoreout : msg }
    )
  })
})

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
      //console.log('error:', err);
    //console.log (links[a].url);
    }else {
      for (var j = 0; j < NUM_KEYWORD; j++) {

          total_weight += 1;
          if (!(response.results[j].sentiment.type == 'neutral')) {
            total_score += parseFloat(response.results[j].sentiment.score);
          }
          //console.log (JSON.stringify(response, null, 2));

        

        //console.log (links[a].url);
        //console.log (response.results[j].sentiment.score);

        //console.log (total_weight);
        //console.log (total_score);
      }

    }
    flowController.emit('sentiment', a + 1);
  });

});

flowController.on('finished', function () {
    score = total_score / total_weight;
    //console.log (total_score);
    //console.log (total_weight);
    console.log(score);
    flowController.emit('render');
});

app.listen(3000)