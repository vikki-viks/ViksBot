require("dotenv").config();
const Telegrambot = require("node-telegram-bot-api");

const token = process.env.TOKEN;
const chats = {};
const bot = new Telegrambot(token, { polling: true });
const { gameOptions, againOptions } = require("./options");

const startGame = async (chatId) => {
  const random = Math.floor(Math.random() * 10);
  chats[chatId] = random;
  await bot.sendMessage(chatId, "Отгадай цифру от 0 до 9", gameOptions);
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
      return bot.sendMessage(chatId, "Добро пожаловать!");
    }
    if (text === "/game") {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, "Я Вас не понимаю");
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === "/again") {
      return startGame(chatId);
    }
    if (data === chats[chatId]) {
      return bot.sendMessage(chatId, "Поздравляю!", againOptions);
    } else {
      return bot.sendMessage(
        chatId,
        `Бот загад цифру ${chats[chatId]}`,
        againOptions
      );
    }
  });
};
start();
