//List of what we're requiring to run the function, all packages are available to install.
var request = require("request");
var twitter = require("twitter");
var twitterKeys = require("./keys.js");
var twitterclient = new twitter({
  consumer_key: twitterKeys.consumer_key,
  consumer_secret: twitterKeys.consumer_secret,
  access_token_key: twitterKeys.access_token_key,
  access_token_secret: twitterKeys.access_token_secret
});
var spotify = require("node-spotify-api");
var spotifyClient = new spotify({
	id: "8acc70f1b35f476dbe4a19604a639a12",
  	secret: "f5a34c486099444c9833dbfb6341b8cf"
});
	var fs = require ("fs");

	var nodeArgs = process.argv;
	var liristring = ""

	var liriCommand = nodeArgs[2];
	for (var i = 3; i < nodeArgs.length; i++) {

  if (i > 3 && i < nodeArgs.length) {

    liristring = liristring + "+" + nodeArgs[i];

  }

  else {

    liristring += nodeArgs[i];

  }
	}
	function runLIRI(){
	if (liriCommand === "my-tweets"){
	twitterclient.get('statuses/user_timeline', function(error, tweets, response) {
 	 if(error) throw error;
 	 for (var i = 0; i < tweets.length; i++){
 	 console.log ("Tweet Number " + (i+1))
 	 console.log(tweets[i].created_at); 
 	 console.log(tweets[i].text);
 	 console.log("-----------------")
 	}
	});
	}
	else if (liriCommand === "spotify-this-song"){
	if(liristring === ""){
		liristring = "Ace of Base";
		console.log(liristring);
	}



	spotifyClient.search({ type: 'track', query: liristring, limit: 1 }, function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  }
  else{
  	var songInfo = data.tracks.items[0];
    	console.log("Name of the Artist: " + songInfo.artists[0].name);
        console.log("Name of the Song: " + songInfo.name);
        console.log("Link to the Song on Spotify: " + songInfo.external_urls.spotify);
        console.log("Name of the Album: " + songInfo.album.name);
 	 }
	});
	}
	else if (liriCommand === "movie-this"){
	if(liristring === ""){
		liristring = "Mr. Nobody";
		console.log("If You Haven't Watched Mr. Nobody, Then You Should:  http://www.imdb.com/title/tt0485947/");
		console.log("It's on Netflix");
	}
	else{
		var queryUrl = "http://www.omdbapi.com/?t=" + liristring + "&y=&plot=short&apikey=40e9cece";
		request(queryUrl, function(error, response, body) {

  		// If the request is successful
 		 if (!error && response.statusCode === 200) {
   		 console.log("Title: " + JSON.parse(body).Title);
   		 console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
   		 console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
   		 console.log("Country: " + JSON.parse(body).Country);
   		 console.log("Language: " + JSON.parse(body).Language);
   		 console.log("Plot: " + JSON.parse(body).Plot);
   		 console.log("Actors: " + JSON.parse(body).Actors);
  		}
		});
		}
	}
	else if (liriCommand === "do-what-it-says"){
		fs.readFile("random.txt", "utf8", function(err, data) {
 		 if (err) {
   		 return console.log(err);
  		}

  	var output = data.split(",");
  	liriCommand = output[0];
  	liristring = output[1];
	runLIRI();
	});
	}
}

runLIRI();