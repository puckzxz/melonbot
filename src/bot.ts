import chalk from "chalk";
import { Emoji, MessageReaction, Role } from "discord.js";
import { CommandoClient } from "discord.js-commando";
import path from "path";
import { DEBUG, TOKEN, TOKEN_DEV } from "./config";
import { Reaction } from "./entity/Reaction";
import db from "./util/db";

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
    "with melons",
];

const client = new CommandoClient({
    commandPrefix: "$",
    disableEveryone: true,
    owner: [
        "135554522616561664", // puckzxz#2080
        "190220855609917442", // Ethik#3764
    ],
    unknownCommandResponse: false,
});

client
    .on("error", (err) => {
        console.log(chalk.red(err.message));
    })
    .on("warn", (wrn) => {
        console.log(chalk.yellow(wrn));
    })
    .on("debug", (dbg) => {
        console.log(chalk.gray(dbg));
    })
    .on("ready", () => {
        console.log(
            chalk.green(
                `Client logged in\nLogged in as ${client.user.username}#${client.user.discriminator} - ${client.user.id}`,
            ),
        );
        // TODO: Set our activity to watching when someone starts streaming?
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
    .registerGroup("admin", "Administration")
    .registerGroup("reactroles", "ReactRoles")
    .registerGroup("movienight", "MovieNight")
    .registerDefaults()
    .registerCommandsIn(path.join(__dirname, "commands"));

const events: any = {
    MESSAGE_REACTION_ADD: "messageReactionAdd",
    MESSAGE_REACTION_REMOVE: "messageReactionRemove",
};

client.on("raw", async (event: any) => {
    if (!events.hasOwnProperty(event.t)) {
        return;
    }

    const { d: data } = event;
    const user = client.users.get(data.user_id);
    const channel: any =
        client.channels.get(data.channel_id) || (await user!.createDM());

    if (channel.messages.has(data.message_id)) {
        return;
    }

    const message = await channel.fetchMessage(data.message_id);
    const emojiKey = data.emoji.id
        ? `${data.emoji.name}:${data.emoji.id}`
        : data.emoji.name;
    let reaction = message.reactions.get(emojiKey);

    if (!reaction) {
        const emoji = new Emoji(client.guilds.get(data.guild_id)!, data.emoji);
        reaction = new MessageReaction(
            message,
            emoji,
            1,
            data.user_id === client.user.id,
        );
    }

    (client as any).emit(events[event.t], reaction, user);
});

client.on("messageReactionAdd", async (reaction, user) => {
    const guildMember = reaction.message.guild.member(user);
    if (guildMember.id === client.user.id) {
        return;
    }
    const reactMsg = await db.GetMessage(reaction.message.id);
    if (!reactMsg) {
        return;
    }
    const reactRole = reactMsg.reactions.find(
        (x: Reaction) => {
            if (x.emoji.includes(":")) {
                return x.emoji === reaction.emoji.identifier;
            } else {
                return x.emoji === reaction.emoji.name;
            }
        },
    );
    const guildRole = reaction.message.guild.roles.find(
        (x: Role) => x.name === reactRole.role,
    );
    if (!guildMember.roles.has(guildRole.id)) {
        guildMember.addRole(guildRole);
    }
});

client.on("messageReactionRemove", async (reaction, user) => {
    const guildMember = reaction.message.guild.member(user);
    if (guildMember.id === client.user.id) {
        return;
    }
    const reactMsg = await db.GetMessage(reaction.message.id);
    if (!reactMsg) {
        return;
    }
    const reactRole = reactMsg.reactions.find(
        (x: Reaction) => {
            if (x.emoji.includes(":")) {
                return x.emoji === reaction.emoji.identifier;
            } else {
                return x.emoji === reaction.emoji.name;
            }
        },
    );
    const guildRole = reaction.message.guild.roles.find(
        (x: Role) => x.name === reactRole.role,
    );
    if (guildMember.roles.has(guildRole.id)) {
        guildMember.removeRole(guildRole);
    }
});

DEBUG ? client.login(TOKEN_DEV) : client.login(TOKEN);
