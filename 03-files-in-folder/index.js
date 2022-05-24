const fs = require('fs');
const path = require('path');
// используем readdir для навигации по файлам в папке
fs.readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true }, (err, files) => {
  files.forEach((file) => {
    // создадим массив для текущих данных
    const arrInfo = [];
    // введем условия для игнорирования "не файлов"
    if (file.isDirectory() === true) return;
    // получим имя файла
    const fileName = file.name.split('.')[0];
    // получим расширение
    const ext = path.extname(file.name).split('.')[1];
    // определим путь до файла и запишем в переменную
    const thisPath = path.join(`${__dirname}/secret-folder`, `${file.name}`);
    // используем stat для получения размера файла
    fs.stat(thisPath, (err, stats) => {
      // получим разбер файла в kb
      const sizeInKb = `${(stats.size / 1024).toFixed(1)}kb`;
      // запушим все полученные ранее данные в массив
      arrInfo.push(fileName, ext, sizeInKb);
      const result = arrInfo.join(' - ');
      // и выведем в консоль
      console.log(result);
    });
  });
});
