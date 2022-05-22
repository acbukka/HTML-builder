const fs = require('fs');
const path = require('path');
// создадим массив вопросиков
let questions = [
  'What is your name?',
  'What is programming language do you prefer?',
  'What is your hobby?'
];
// и функцию генерации рандомного вопроса
const generateAsk = () => Math.floor(Math.random() * 3);
// вызываем эту функцию при запуске скрипта
function ask() {
  // create file when function is calling
  fs.appendFile(path.join(__dirname, 'reply.txt'), '', () => { });
  process.stdout.write(`${questions[generateAsk()]}`);
  process.stdout.write('  >  ');
}
// когда юзер что-то вводит в терминал, мы получаем data event и вызываем функцию
process.stdin.on('data', function (data) {
  // и записываем полученную дату в нужный файл, в нужном формате
  const newText = data.toString().trim() + '\n';
  fs.appendFile(path.join(__dirname, 'reply.txt'), newText, () => {
    console.log('Check this out!');
  });
  // выводим прощальную фразу при вводе exit и обрываем процесс
  if (newText.trim() === 'exit') {
    console.log('Bye Bye');
    process.exit();
  }
});
// выводим прощальную фразу при комбинации клавиш ctrl + c и обрываем процесс
process.on('SIGINT', () => {
  console.log('\nBye Bye');
  process.exit();
});
// вызываем функцию по умолчанию
ask();
