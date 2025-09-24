export const listCommand = async (bot: any) => {
  await bot.api.setMyCommands([
    { command: "start", description: "Запустить бота" },
    { command: "helpme", description: "Показать текст для справки" },
    { command: "test", description: "Тестовая команда" },
    { command: "crypto", description: "Курс криптовалют" },
    { command: "hunger", description: "Показать уровень голода" },
  ]);
};
