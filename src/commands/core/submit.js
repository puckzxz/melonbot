const { Command } = require("discord.js-commando");
const { RichEmbed } = require("discord.js");
const chalk = require("chalk");
const XMLHttpRequest = require("xmlhttprequest");
const path = require("path");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config({
  path: path.join(__dirname, ".env")
});
let xmlHttp = new XMLHttpRequest.XMLHttpRequest();
let mongoURL = process.env.MONGO_URL;

module.exports = class SubmitCommand extends Command {
  constructor(client) {
    super(client, {
      name: "submit",
      group: "core",
      memberName: "submit",
      description: "Adds a movie to the Melon Patch Movie Database",
      examples: ["submit <IMDB URL>"],
      guildOnly: true,
      args: [
        {
          key: "imdbURL",
          prompt: "What IMDB URL would you like to submit?",
          type: "string"
        }
      ]
    });
  }

  async run(msg, args) {
    let imdbID = getIMDBID(args.imdbURL);
    let movieData = getMovieData(imdbID);
    addMovieToDB(movieData);
    const embed = new RichEmbed()
      .setTitle(movieData.Title)
      .setDescription(movieData.Plot)
      .setThumbnail(movieData.Poster)
      .setURL(args.imdbURL)
      .addField("Genre", movieData.Genre)
      .addField("Rated", movieData.Rated, true)
      .addField("Rating", movieData.Rating, true)
      .addField("Runtime", movieData.Runtime, true)
      .addField("Released", movieData.Year, true)
      .setColor(0x00ff00);
    return msg.embed(embed);
  }
};

function getIMDBID(imdbURL) {
  imdbURL = imdbURL.split("title/")[1];
  if (!imdbURL.endsWith("/")) {
    imdbURL = imdbURL.split("/?")[0];
  }
  if (imdbURL.endsWith("/")) {
    imdbURL = imdbURL.slice(0, -1);
  }
  return imdbURL;
}

function getMovieData(imdbID) {
  xmlHttp.open(
    "GET",
    `http://www.omdbapi.com/?i=${imdbID}&apikey=${process.env.API_KEY}`,
    false
  );
  xmlHttp.send(null);
  let respJSON = JSON.parse(xmlHttp.responseText);
  let genreList = respJSON.Genre.split(", ");
  return {
    Title: respJSON.Title,
    Year: respJSON.Year,
    Rated: respJSON.Rated,
    Runtime: respJSON.Runtime,
    Genre: respJSON.Genre,
    GenreList: genreList,
    Plot: respJSON.Plot,
    Poster: respJSON.Poster,
    ImdbID: respJSON.imdbID,
    Rating: respJSON.imdbRating
  };
}

function addMovieToDB(movieDetailsJSON) {
  MongoClient.connect(
    mongoURL,
    {
      useNewUrlParser: true
    },
    function(err, db) {
      if (err) {
        return console.log(chalk.red(err));
      }
      var dbo = db.db(process.env.MONGO_DB);
      var movie = {
        Title: movieDetailsJSON.Title,
        Year: movieDetailsJSON.Year,
        Rated: movieDetailsJSON.Rated,
        Runtime: movieDetailsJSON.Runtime,
        Genre: movieDetailsJSON.GenreList,
        Poster: movieDetailsJSON.Poster,
        ImdbID: movieDetailsJSON.ImdbID,
        Rating: movieDetailsJSON.Rating
      };
      dbo.collection(process.env.MONGO_COL).insertOne(movie, function(err) {
        if (err) {
          return console.log(chalk.red(err));
        }
        console.log(chalk.green(`Added ${movie.Title} to the database!`));
        db.close();
      });
    }
  );
}
