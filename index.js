require("dotenv").config();
const Telegrambot = require("node-telegram-bot-api");

const token = process.env.TOKEN;
const chats = {};
const bot = new Telegrambot(token, { polling: true });
const gameOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: "1", callback_data: "1" },
        { text: "2", callback_data: "2" },
        { text: "3", callback_data: "3" },
      ],
      [
        { text: "4", callback_data: "4" },
        { text: "5", callback_data: "5" },
        { text: "6", callback_data: "6" },
      ],
      [
        { text: "7", callback_data: "7" },
        { text: "8", callback_data: "8" },
        { text: "9", callback_data: "9" },
      ],
      [{ text: "0", callback_data: "0" }],
    ],
  }),
};
const againOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [[{ text: "Играть еще раз", callback_data: "/again" }]],
  }),
};
const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Hello" },
    { command: "/game", description: "Game" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      bot.sendMessage(chatId, "Welcome");
    }
    if (text === "/game") {
      const random = Math.floor(Math.random() * 10);
      chats[chatId] = random;
      return bot.sendMessage(chatId, "Отгадай цифру от 0 до 9", gameOptions);
    }
    return bot.sendMessage(chatId, "Try again");
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === chats[chatId]) {
      return bot.sendMessage(chatId, "Congradulations!");
    } else {
      return bot.sendMessage(chatId, `Бот загад цифру ${chats[chatId]}`);
    }
  });
};
start();
