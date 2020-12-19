const discord = require("discord.js");
const botConfig = require("./config.json");

const fs = require("fs");

const client = new discord.Client();
bot.commands = new discord.Collection();

fs.readdir("./commands/", (err, files) => {

    if(err) console.log(err);

    var jsfiles = files.filter(f => f.split(".").pop() === "js");

    if(jsfiles.length <=0) {
        console.log("Geen files gevonden");
        return;
    }

    jsfiles.forEach((f, i) => {

        var fileGet = require(`./commands/${f}`);
        console.log(`Het bestand ${f} is geladen`); 
        
        bot.commands.set(fileGet.help.name, fileGet);

    })

});

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

    var arguments = messageArray.slice[1];

    
    var commands = bot.commands.get(command.slice(prefix.length));

    if(commands) commands.run(bot,message, arguments);

    // if (command === `${prefix}info`) {
    //     var botEmbed = new discord.MessageEmbed()
    //         .setTitle('Info Botje')
    //         .setDescription("Ik ben Botje de Discord Bot")
    //         .setColor("#0099ff")
    //         .addField("Developer","RAYMOND#5754")
    //         .addField("Help command:", "!help")
    //         .setThumbnail('https://imgur.com/pbZa52b.png')
    //         .setFooter("Botje V1.0.1", "https://imgur.com/pbZa52b.png");
    //     return message.channel.send(botEmbed);
    // }

    // if (command === `${prefix}resourcepack`) {
    //     var botEmbed = new discord.MessageEmbed()
    //         .setTitle('Resourcepack Download')
    //         .setColor("#FF0000")
    //         .addField("Downloadlink van de Resource pack", "https://www.mediafire.com/file/r6f5r6fuuhq99i9/RayTopiaRL_V1.1.mcpack/file")
    //         .addField("Pack Versie", "V1.1")
    //         .setThumbnail('https://imgur.com/pbZa52b.png')
    //         .setFooter("Botje V1.0.1", "https://imgur.com/pbZa52b.png");

    //     return message.channel.send(botEmbed);
    // }

    if (command === `${prefix}wetboek`) {
        var botEmbed = new discord.MessageEmbed()
            .setTitle('Wetboek Download')
            .setColor("#FF0000")
            .addField("Link van Wetboek:", "WORD NOG ADDED")
            .addField("Datum van upload", "ADDED WANNEER WETBOEK ADDED")
            .setThumbnail('https://imgur.com/pbZa52b.png')
            .setFooter("Botje V1.0.1", "https://imgur.com/pbZa52b.png");

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


});

async function promptMessage(message, author, time, reactions) {
    time *= 1000;

    for (const reaction of reactions) {
        await message.react(reaction);
    }

    const filter = (reaction, user) => reactions.includes(reaction.emoji.name) && user.id === author.id;

    return message.awaitReactions(filter, { max: 1, time: time }).then(collected => collected.first() && collected.first().emoji.name);
}
