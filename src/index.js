const { Telegraf } = require("telegraf");
require("dotenv").config();
const axios = require("axios");
const fs = require("fs");

const host = "instagram-scraper-2022.p.rapidapi.com";
const getUserId = 'https://instagram-scraper-2022.p.rapidapi.com/ig/user_id/';
const getUserFollowers = 'https://instagram-scraper-2022.p.rapidapi.com/ig/followers/';
const getUserFollowings = 'https://instagram-scraper-2022.p.rapidapi.com/ig/following/';
const instagramTag = ''; // Instagram Tag

const bot = new Telegraf(process.env.BOT_KEY);

bot.command("scan", async (ctx) => {
  ctx.reply("scan started");
 await onScan(
    ctx,
    process.env.RAPID_API_KEY
  );
});

bot.launch();
console.log(`bot is running`);

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

async function onScan(ctx, key) {
    console.log("scan started");
  let requests = [
    {
      fileName: "userData",
      options: {
        method: "GET",
        url: getUserId,
        params: { user: instagramTag },
        headers: {
          "X-RapidAPI-Key": key,
          "X-RapidAPI-Host": host,
        },
      },
    },
    {
      fileName: "followers",
      options: {
        method: "GET",
        url: getUserFollowers,
        params: { id_user: null },
        headers: {
          "X-RapidAPI-Key": key,
          "X-RapidAPI-Host": host,
        },
      },
    },
    {
      fileName: "following",
      options: {
        method: "GET",
        url: getUserFollowings,
        params: { id_user: null },
        headers: {
          "X-RapidAPI-Key": key,
          "X-RapidAPI-Host": host,
        },
      },
    },
  ];

  let helper = {
    userId: null,
    followers: null,
    followings: null,
  };

  for (let i = 0; i < requests.length; i++) {
    if(helper.userId!=null){
        requests[i].options.params.id_user = helper.userId
    }
    let {data} = await axios(requests[i].options);
    switch (i) {
      case 0:
        if (helper.userId == null) helper.userId = data.id;
        break;
      case 1:
        if (helper.followers == null) helper.followers = data.users;
        break;
      case 2:
        if (helper.followings == null) helper.followings = data.users;
        break;
      default:
        break;
    }
    fs.writeFile(`./files/${requests[i].fileName}.json`, JSON.stringify(data), (e) => {
      if (e) {
        console.log(`Oops, something went wrong in writeToFile: `, e);
      } else {
        console.log(`Success in: writeToFile`);
      }
    });
  }
  console.log("scan finished");
  ctx.reply("scan finished");
}
