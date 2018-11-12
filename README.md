# 🍉 MelonBot

## About

This bot is used to make organzing Melon Patch Movie Night's easier.  Anyone can submit movies to the movie database so there can be a wide variety of movies and polls can be made in one easy command.

## Usage

This bot was specifcally built for Melon Patch needs but you could modify for your own uses

## Setup

`npm install && npm start`

This bot does use a `.env` file in the `src` directory

The `.env` variables you will need to supply are

| Name            | Use                                            |
|-----------------|------------------------------------------------|
| `TOKEN`         | Your discord bot token                         |
| `API_KEY`       | Your API Key for OMDb                          |
| `MONGO_URL`     | The URL to your MongoDB database               |
| `MONGO_DB`      | The database name in MongoDB you'll be using   |
| `MONGO_COL`     | The collection in the database you'll be using |

## Built with

* [Discord.js](https://discord.js.org)
* [Discord.js-commando](https://github.com/discordjs/Commando)