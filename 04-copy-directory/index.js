//!!! P.S если возникают ошибки с работой fs.rm, значит версия ноды слишком старая

const fs = require('fs');
const path = require('path');
const fsPromises = require('fs').promises;

const thisPath = path.join(__dirname, 'files');
const newPath = path.join(__dirname, 'files-copy');

async function copyDir(src, dest) {
  // нужно если папка существует - ее удалить и потом создать и потом пройтись, если существует 
  let isFolderExist;
  // введем переменные для наших папок
  await fsPromises.access(dest)
    .then(() => isFolderExist = true)
    .catch(() => isFolderExist = false);
  // 
  if (isFolderExist) {
    await fsPromises.rm(dest, { recursive: true });
    copyDir(src, dest);
  } else {
    await fsPromises.mkdir(dest, { recursive: true });
    fs.readdir(src, { withFileTypes: true }, (err, files) => {
      if (err) throw err;
      files.forEach((dir) => {
        if (dir.isDirectory()) {
          fs.mkdir(`${dest}/${dir.name}`, { recursive: true }, () => {
            if (err) throw err;
          });
          copyDir(`${src}/${dir.name}`, `${dest}/${dir.name}`);
        } else {
          fsPromises.copyFile(`${src}/${dir.name}`, `${dest}/${dir.name}`);
        }
      });
    });
  }
}
copyDir(thisPath, newPath);

// TODO добавить коммы


// PREVIOUS CODE:

// создадим нашу функцию
// async function copyDir() {
//   // введем переменные для наших папок
//   const thisPath = path.join(__dirname, 'files');
//   const newPath = path.join(__dirname, 'files-copy');
//   await fsPromises.mkdir(newPath, { recursive: true });
//   await fsPromises.rm(newPath, { recursive: true });
//   await fsPromises.mkdir(newPath, { recursive: true });
//   // Затем копируем каждый файл из source папки в project-dist
//   fs.readdir(thisPath, { withFileTypes: true }, (err, files) => {
//     if (err) throw err;
//     files.forEach((dir) => {
//       if (dir.isDirectory()) {
//         fsPromises.mkdir(`${newPath}/${dir.name}`, { recursive: true }, () => { });
//         fs.readdir(`${thisPath}/${dir.name}`, { withFileTypes: true }, (err, files) => {
//           if (err) throw err;
//           files.forEach((file) => {
//             fsPromises.copyFile(`${thisPath}/${dir.name}/${file.name}`, `${newPath}/${dir.name}/${file.name}`);
//           });
//         });
//       } else {
//         fsPromises.copyFile(`${thisPath}/${dir.name}`, `${newPath}/${dir.name}`);
//       }
//     });
//   });
// }
// copyDir();