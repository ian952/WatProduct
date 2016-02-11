/*
 * Module dependencies
 */
var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')


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

app.get('/', function (req, res) {
  res.render('index',
  { title : 'Home' }
  )
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
