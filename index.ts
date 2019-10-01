const Telegraf = require("telegraf");
import { Constants } from "./constants";
import { ResponseFactory } from "./responseFactory";

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply(Constants.WELCOME_MESSAGE));
bot.on("text", (ctx) => ctx.reply(ResponseFactory.createResponse(ctx.message.text)) );
bot.launch();