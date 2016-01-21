
	// const readline = require('readline');

	// const rl = readline.createInterface({
	//   input: process.stdin,
	//   output: process.stdout
	// });

	// rl.question('What do you think of Node.js? ', (answer) => {
	//   rl.close();
	// });

	

	var text = '{'+
    '"result": {' +
       ' "docs": [' +
            '{ "id": "MzQ0MDAxMDI5NnwxNDUyODI0MjUw",' +
                '"source": {' +
                    '"enriched": {' +
                        '"url": {' +
                            '"url": "http://www.cnet.com/uk/videos/apple-looks-to-bring-wireless-air-buds-to-the-iphone-7/"'+
                '}}}}]}}';

     var newsAnalyzed = JSON.parse(text);

	//(getNews (answer));
	for (var i = 0; i < 1;i++) {
		console.log(newsAnalyzed.result.docs[i].source.enriched.url.url);
	}
