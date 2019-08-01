const { Client } = require("discord.js-commando");
const path = require("path");
const chalk = require("chalk");
const config = require("./config");

const statuses = [
  "with Puck",
  "with Ethik",
  "with Virus",
  "with Death",
  "with Infms",
  "with Fakes",
  "with HoodieThief",
  "with Sepa",
  "with Jefe",
  "with melons"
];

const client = new Client({
  owner: [
    "135554522616561664", // puckzxz#2080
    "190220855609917442" // Ethik#3764
  ],
  commandPrefix: "$",
  disableEveryone: true
});

client
  .on("error", err => {
    console.log(chalk.red(err));
  })
  .on("warn", wrn => {
    console.log(chalk.yellow(wrn));
  })
  .on("debug", dbg => {
    console.log(chalk.gray(dbg));
  })
  .on("ready", () => {
    console.log(
      chalk.green(
        `Client logged in\nLogged in as ${client.user.username}#${
          client.user.discriminator
        } - ${client.user.id}`
      )
    );
    setInterval(() => {
      const index = Math.floor(Math.random() * statuses.length);
      client.user.setActivity(statuses[index]);
    }, 30000); // run every 30 seconds
  })
  .on("disconnect", () => {
    console.log(chalk.yellow("Client disconnected!"));
  })
  .on("reconnecting", () => {
    console.log(chalk.yellow("Client attempting to reconnect..."));
  });

client.registry
  .registerGroup("movienight", "MovieNight")
  .registerGroup("admin", "Administration")
  .registerGroup("react", "ReactRole")
  .registerDefaults()
  .registerCommandsIn(path.join(__dirname, "commands"));

const events = {
  MESSAGE_REACTION_ADD: "messageReactionAdd",
  MESSAGE_REACTION_REMOVE: "messageReactionRemove"
};

client.on("raw", async event => {
  if (!events.hasOwnProperty(event.t)) return;

  const { d: data } = event;
  const user = client.users.get(data.user_id);
  const channel =
    client.channels.get(data.channel_id) || (await user.createDM());

  if (channel.messages.has(data.message_id)) return;

  const message = await channel.fetchMessage(data.message_id);
  const emojiKey = data.emoji.id
    ? `${data.emoji.name}:${data.emoji.id}`
    : data.emoji.name;
  let reaction = message.reactions.get(emojiKey);

  if (!reaction) {
    const emoji = new Discord.Emoji(
      client.guilds.get(data.guild_id),
      data.emoji
    );
    reaction = new Discord.MessageReaction(
      message,
      emoji,
      1,
      data.user_id === client.user.id
    );
  }

  client.emit(events[event.t], reaction, user);
});

client.on("messageReactionAdd", (reaction, user) => {
  let guildUser = reaction.message.guild.member(user);
  let role = reaction.message.guild.roles.find(
    role => role.name === config.ReactMessageRole
  );
  if (
    reaction.message.id === config.ReactMessageID &&
    reaction.emoji.name === config.ReactMessageEmoji
  ) {
    if (!guildUser.roles.has(role.id)) {
      guildUser.addRole(role);
    }
  }
});

config.DEBUG ? client.login(config.TOKEN_DEV) : client.login(config.TOKEN);
