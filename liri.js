// Global variables/npm package import
//============================================================================
var request = require('request');
var keys = require("./key.js");
var Twitter = require('twitter');
var inquirer = require("inquirer");
var spotify = require("spotify");
var omdb = require("omdb");
var fs = require("fs");
var userSong = "";
var userMovie = "";

// declaring command variables
var action = process.argv[2];
// either the name of a song, or movie

// switch case for whatever command the user enters
switch(action){
    case 'my-tweets':
        getTweets();
    break;
};
switch(action){
    case 'spotify-this-song':
        chooseSong();
    break;
};
switch(action){
    case 'movie-this':
        chooseMovie();
    break;
};
switch(action){
    case 'do-what-it-says':
        DoWhatItSays();
    break;
};




// Function Declarations
//============================================================================
function getTweets() {

  var client = new Twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
  });

  var params = {
    screen_name: "BobbyBTest"
  };

  client.get('statuses/user_timeline', params, function(error, tweets, response){
    for (var i = 0; i < tweets.length; i++) {
      if(!error) {
        console.log(tweets[i].text);
        console.log(tweets[i].created_at);
      }
    }
  });
}

function chooseSong() {
inquirer.prompt([
  {
    type: "input",
    message: "Please enter song title!",
    name: "favoriteSong"
  }
]).then(function(data) {
  userSong = data.favoriteSong;
  spotifyThis();


function spotifyThis() {

  spotify.search({ type:'track', query: userSong}, function(err, data) {
    //console.log(data);
    if (data.tracks.items.length > 0) {
      console.log(data);
      console.log("Artist: " + data.tracks.items[0].artists[0].name);
      console.log("Song name:: " + data.tracks.items[0].name);
      console.log("Link Preview: " + data.tracks.items[0].preview_url);
      console.log("Album: " + data.tracks.items[0].album.name);

    }
    //this error code doesn't work for me. I tried. But no enchilada. 
    else {
      spotify.search({ type:'track', query: "ace base The Sign"}, function(err, data) {
      console.log(data);
      console.log("Artist: " + data.tracks.items[0].artists[0].name);
      console.log("Song name:: " + data.tracks.items[0].name);
      console.log("Link Preview: " + data.tracks.items[0].preview_url);
      console.log("Album: " + data.tracks.items[0].album.name);
    });
    };
  });
}
});
};


function chooseMovie() {
inquirer.prompt([
  {
    type: "input",
    message: "Please enter movie title!",
    name: "favoriteMovie"
  },
]).then(function(data) {
  userMovie = data.favoriteMovie;
  movieThis();


function movieThis() {
  // omdb API retrieving movie specificied by title, false = shortened plot returned
    request('http://www.omdbapi.com/?t=' + userMovie + '&tomatoes=true', function(error, response, body) {
        var movie = JSON.parse(body);
        if(!error && response.statusCode === 200 && movie.Title != undefined) {
        
        //console.log(movie)
        console.log('Title: ' + movie.Title);
        console.log('Year: ' + movie.Year);
        console.log('IMDB Rating: ' + movie.imdbRating);
        console.log('Country: ' + movie.Country);
        console.log('Language: ' + movie.Language);
        console.log('Plot: ' + movie.Plot);
        console.log('Actors: ' + movie.Actors);
        console.log('Rotten Tomatoes: ' + movie.tomatoURL);
        }  
        else { 

        request('http://www.omdbapi.com/?t=Mr+Nobody&tomatoes=true', function(error, response, body) {
                      var movie = JSON.parse(body);
        //console.log(movie)
        console.log('Title: ' + movie.Title);
        console.log('Year: ' + movie.Year);
        console.log('IMDB Rating: ' + movie.imdbRating);
        console.log('Country: ' + movie.Country);
        console.log('Language: ' + movie.Language);
        console.log('Plot: ' + movie.Plot);
        console.log('Actors: ' + movie.Actors);
        console.log('Rotten Tomatoes: ' + movie.tomatoURL);
        });
        };
    });
};
});
};

function DoWhatItSays() {
fs.readFile("random.txt", "utf8", function(error, data){  
  var array = data.split(",");
  action = array[0];
  detail = array[1];
  userSong = detail;
    spotify.search({ type:'track', query: userSong}, function(err, data) {
    if(!err) {
      // console.log(data.tracks.items[0]);
      console.log("Artist: " + data.tracks.items[0].artists[0].name);
      console.log("Song name: " + data.tracks.items[0].name);
      console.log("Link Preview: " + data.tracks.items[0].preview_url);
      console.log("Album: " + data.tracks.items[0].album.name);

    }
    else if (!data){
      console.log("'The Sign' by Ace of Base");
    }
  });
});
}; 