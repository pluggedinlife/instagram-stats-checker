const { Telegraf } = require("telegraf");
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_KEY);

bot.command("test", (ctx) => {
  console.log("test command deployed");
  ctx.reply("test command deployed");
});

bot.launch();
console.log(`bot is running`);

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
