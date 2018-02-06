// modules
const {Client, Collection, RichEmbed} = require("discord.js");
const {readdir} = require ("fs");
const http = require("http");
const express = require("express");
const request = require('request');

// enmap
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");

const pointProvider = new EnmapLevel({name: "points"}),
      prefixProvider = new EnmapLevel({name: "prefixes"})


// constructors
const client = new Client();
const app = express();

client.points = new Enmap({provider: pointProvider});
client.prefixes = new Enmap({provider: prefixProvider});

// defines
client.config = require("./config.js").data;
client.Discord = require("discord.js");
client.request = require("request");
client.fs = require("fs");
client.tabletojson = require("tabletojson")
client.capFL = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const color = [0xF44336, 0xE91E63, 0x9C27B0, 0x673AB7, 0x3F51B5, 0x2196F3, 0x03A9F4, 0x00BCD4, 0x009688, 0x4CAF50, 0x8BC34A, 0xCDDC39, 0xFFEB3B, 0xFFC107, 0xFF9800, 0xFF5722, 0x795548, 0x9E9E9E, 0x607D8B, 0x000000, 0xFFFFFF];
const num = Math.floor(Math.random()*color.length);
client.randomColor = color[num];

const events = require("./events/eventLoader.js")

// login
client.login(client.config.token);

// collections
client.commands = new Collection();
client.aliases = new Collection();

// ping
app.get("/", (request, response) => { 
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200); 
}); 
app.listen(process.env.PORT); 
setInterval(() => { 
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`); 
                                                }, 280000);

// events
client.on ('ready', () => {
  console.log("I am ready to destroy Discord.");
  client.user.setActivity(client.config.game + " | " + client.config.prefix + " Prefix", {type: client.config.gametype});
  client.user.setStatus(client.config.status.toLowerCase());
});

client.on ('message', (msg) => require ("./events/message.js").run(client, msg));

client.on('guildCreate', (guild) => events.guildCreate(guild, client));
client.on('guildDelete', (guild) => events.guildDelete(guild, client));

client.on ('error', (err) => {
  console.error(err);
});

client.on ('warn', (warn) => {
  console.warn(warn);
});

client.on("debug", (e) => console.info (e));

// intialize

  readdir('./commands/', (err, files) => {
    if (err) console.error (err);
    console.log("Loading " + files.length + " commands.");
    files.forEach(f => {
      let props = require("./commands/" + f);
     console.log("Loading command: " + props.help.name);
      client.commands.set(props.help.name, props);
     props.conf.aliases.forEach(alias => { client.aliases.set(alias, props.help.name);
                                       });
    });
 });

this.client = client;