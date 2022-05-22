const fs = require('fs');
const path = require('path');
const fsPromises = require('fs').promises;

// создадим нашу функцию
async function copyDir() {
  // введем переменные для наших папок
  const thisPath = path.join(__dirname, 'files');
  const newPath = path.join(__dirname, 'files-copy');
  await fsPromises.mkdir(newPath, { recursive: true });
  await fsPromises.rm(newPath, { recursive: true });
  await fsPromises.mkdir(newPath, { recursive: true });
  // Затем копируем каждый файл из source папки в project-dist
  fs.readdir(thisPath, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    files.forEach((dir) => {
      if (dir.isDirectory()) {
        fsPromises.mkdir(`${newPath}/${dir.name}`, { recursive: true }, () => { });
        fs.readdir(`${thisPath}/${dir.name}`, { withFileTypes: true }, (err, files) => {
          if (err) throw err;
          files.forEach((file) => {
            fsPromises.copyFile(`${thisPath}/${dir.name}/${file.name}`, `${newPath}/${dir.name}/${file.name}`);
          });
        });
      } else {
        fsPromises.copyFile(`${thisPath}/${dir.name}`, `${newPath}/${dir.name}`);
      }
    });
  });
}
copyDir();
// TODO добавить коммы