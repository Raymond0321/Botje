const discord = require("discord.js");
const botConfig = require("./config.json");

const client = new discord.Client();

client.login(process.env.token);

client.on("ready", async () => {

    console.log(`${client.user.username} is online.`);

    client.user.setActivity("RayTopia Real Life!", { type: "PLAYING" });

});

client.on("message", async message => {

    if (message.author.bot) return;

    if (message.channel.type === "dm") return;

    var prefix = botConfig.prefix;

    var messageArray = message.content.split(" ");

    var command = messageArray[0];


    if (command === `${prefix}info`) {
        var botEmbed = new discord.MessageEmbed()
            .setTitle('Info Botje')
            .setDescription("Ik ben Botje de Discord Bot")
            .setColor("#0099ff")
            .addField("Developer","RAYMOND#5754")
            .addField("Help command:", "!help")
            .setThumbnail('https://imgur.com/pbZa52b.png')
            .setFooter("Botje V1.1.1", "https://imgur.com/pbZa52b.png");
        return message.channel.send(botEmbed);
    }

    if (command === `${prefix}help`) {
        var botEmbed = new discord.MessageEmbed()
            .setTitle('Help commands')
            .setColor("#FF0000")
            .addField("!info", "Toont de Info over de bot")
            .addField("!wetboek", "Link van Wetboek RayTopia")
            .addField("!resourcepack", "Downloadlink van de Resource pack")
            .setThumbnail('https://imgur.com/pbZa52b.png')
            .setFooter("Botje V1.1.1", "https://imgur.com/pbZa52b.png");

        return message.channel.send(botEmbed);
    }

    if (command === `${prefix}resourcepack`) {
        var botEmbed = new discord.MessageEmbed()
            .setTitle('Resourcepack Download')
            .setColor("#FF0000")
            .addField("Downloadlink van de Resource pack", "https://www.mediafire.com/file/200t5dluhj3d7nf/RTRL_Pack_V1.2.2.mcpack/file")
            .addField("Pack Versie", "V1.2.2")
            .setThumbnail('https://imgur.com/pbZa52b.png')
            .setFooter("Botje V1.1.1", "https://imgur.com/pbZa52b.png");

        return message.channel.send(botEmbed);
    }

    if (command === `${prefix}wetboek`) {
        var botEmbed = new discord.MessageEmbed()
            .setTitle('Wetboek Download')
            .setColor("#FF0000")
            .addField("Link van Wetboek:", "WORD NOG ADDED")
            .addField("Datum van upload", "ADDED WANNEER WETBOEK ADDED")
            .setThumbnail('https://imgur.com/pbZa52b.png')
            .setFooter("Botje V1.1.1", "https://imgur.com/pbZa52b.png");

        return message.channel.send(botEmbed);
    }

    if (command === `${prefix}kick`) {

        const args = message.content.slice(prefix.length).split(/ +/);

        if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply("sorry jij kan dit niet");

        if (!message.guild.me.hasPermission("KICK_MEMBERS")) return message.reply("Geen permissions");

        if (!args[1]) return message.reply("Geen gebruiker opgegeven.");

        if (!args[2]) return message.reply("Gelieve een redenen op te geven.");

        var kickUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[1]));

        var reason = args.slice(2).join(" ");

        if (!kickUser) return message.reply("Kan de gebruiker niet vinden.");

        var embedPrompt = new discord.MessageEmbed()
            .setColor("GREEN")
            .setAuthor("Gelieve te reageren binnen 30 sec.")
            .setDescription(`Wil je ${kickUser} kicken?`);

        var embed = new discord.MessageEmbed()
            .setColor("#ff0000")
            .setThumbnail(kickUser.user.displayAvatarURL)
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setTimestamp()
            .setDescription(`** KICKED:** ${kickUser} (${kickUser.id})
            **Gekickt door:** ${message.author}
            **Reden: ** ${reason}`);

        message.channel.send(embedPrompt).then(async msg => {

            var emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            if (emoji === "✅") {

                msg.delete();

                kickUser.kick(reason).catch(err => {
                    if (err) return message.reply("Oh nee! er is iets fout gegaan");
                });

                message.channel.send(embed);

            } else if (emoji === "❌") {

                msg.delete();

                message.reply("Actie geannuleerd").then(m => m.delete(5000));


            }

        })

    }

    if (command === `${prefix}ban`) {

        const args = message.content.slice(prefix.length).split(/ +/);

        if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply("sorry jij kan dit niet");

        if (!message.guild.me.hasPermission("KICK_MEMBERS")) return message.reply("Geen permissions");

        if (!args[1]) return message.reply("Geen gebruiker opgegeven.");

        if (!args[2]) return message.reply("Gelieve een redenen op te geven.");

        var banUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[1]));

        var reason = args.slice(2).join(" ");

        if (!banUser) return message.reply("Kan de gebruiker niet vinden.");

        var embedPrompt = new discord.MessageEmbed()
            .setColor("GREEN")
            .setAuthor("Gelieve te reageren binnen 30 sec.")
            .setDescription(`Wil je ${banUser} Bannen?`);

        var embed = new discord.MessageEmbed()
            .setColor("#ff0000")
            .setThumbnail(banUser.user.displayAvatarURL)
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setTimestamp()
            .setDescription(`** BANNED:** ${banUser} (${banUser.id})
            **BANNED door:** ${message.author}
            **Reden: ** ${reason}`);

        message.channel.send(embedPrompt).then(async msg => {

            var emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            if (emoji === "✅") {

                msg.delete();

                banUser.ban(reason).catch(err => {
                    if (err) return message.reply("Jammer man! hier heb ik niet zo veel zin in :P");
                });

                message.channel.send(embed);

            } else if (emoji === "❌") {

                msg.delete();

                message.reply("Actie geannuleerd").then(m => m.delete(5000));


            }

        })

    }


});

async function promptMessage(message, author, time, reactions) {
    time *= 1000;

    for (const reaction of reactions) {
        await message.react(reaction);
    }

    const filter = (reaction, user) => reactions.includes(reaction.emoji.name) && user.id === author.id;

    return message.awaitReactions(filter, { max: 1, time: time }).then(collected => collected.first() && collected.first().emoji.name);
}
