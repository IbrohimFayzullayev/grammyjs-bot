require("dotenv").config();
const { Bot, HttpError, GrammyError, Keyboard } = require("grammy");

const bot = new Bot(process.env.BOT_API_KEY);

bot.on([":media", "::url"], async (ctx) => {
  await ctx.reply("Получил ссылку: ");
});

// bot.on("msg", async (ctx) => {
//   console.log(ctx.msg);
// });

// bot.on("msg").filter(
//   (ctx) => {
//     return ctx.from.id === 996202808;
//   },
//   async (ctx) => {
//     await ctx.reply("Привет, создатель!");
//   }
// );

bot.api.setMyCommands([
  { command: "start", description: "Запуск бота" },
  { command: "mood", description: "Оценить настроение" },
  { command: "share", description: "Поделиться данными" },
]);

bot.command("say_hello", async (ctx) => {
  await ctx.reply("Hello!");
});

bot.command("start", async (ctx) => {
  await ctx.react("⚡");
  await ctx.reply(
    "Привет \\! Я бот\\. Тг канал: [это ссылка](https://t.me/IbrokhimFayzullayev)",
    {
      parse_mode: "MarkdownV2",
      disable_web_page_preview: true,
    }
  );
});

bot.command("mood", async (ctx) => {
  //   const moodKeyboard = new Keyboard().text("Хорошо").row().text("Нормально").row().text("Плохо").resized().oneTime();
  const moodLabels = ["Хорошо", "Нормально", "Плохо"];
  const rows = moodLabels.map((label) => {
    return [Keyboard.text(label)];
  });

  const moodKeyboard2 = Keyboard.from(rows).resized();

  await ctx.reply("Как ваше настроение?", {
    reply_markup: moodKeyboard2,
  });
});

bot.command("share", async (ctx) => {
  const shareKeyboard = new Keyboard()
    .requestLocation("Локация")
    .requestContact("Контакт")
    .requestPoll("Опрос")
    .placeholder("Укажи данные...")
    .resized();

  await ctx.reply("Чем хочешь поделиться?", {
    reply_markup: shareKeyboard,
  });
});

bot.on(":contact", async (ctx) => {
  console.log(ctx.update.message);
  await ctx.reply(`Спасибо за контакт!`);
});

bot.hears("Хорошо", async (ctx) => {
  await ctx.reply("Отлично!", {
    reply_markup: { remove_keyboard: true },
  });
});

// bot.command("start", async (ctx) => {
//   await ctx.reply("Привет! Я бот.");
// });

bot.hears("ID", async (ctx) => {
  await ctx.reply(`Ваш ID: ${ctx.from.id}`);
});

// bot.hears("пинг", async (ctx) => {
//   await ctx.reply("Понг!");
// });

bot.hears(/пипец/, async (ctx) => {
  await ctx.reply("Пипец какой-то!");
});

// bot.command("site", (msg) => {
//   const chatId = msg.chat.id;

//   bot.sendMessage(chatId, "Welcome! Click the button to open the web app.", {
//     reply_markup: {
//       inline_keyboard: [
//         [
//           {
//             text: "Open Web App",
//             web_app: { url: "https://tuoling.netlify.app/" }, // Replace with your web app URL
//           },
//         ],
//       ],
//     },
//   });
// });

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;

  if (err instanceof GrammyError) {
    console.error(`Error in request: ${e.description}`);
  } else if (err instanceof HttpError) {
    console.error("Could not contact Telegram:" + e);
  } else {
    console.error("Unknown error:" + e);
  }
});

bot.start();
