//!!! P.S если возникают ошибки с работой fs.rm, значит версия ноды слишком старая

const fs = require('fs');
const path = require('path');
const fsPromises = require('fs').promises;
// укажем путь до папки styles
const stylesPath = path.join(__dirname, 'styles');
// теперь до текущей директории
const thisPath = path.join(__dirname);

// создадим нашу функцию
async function buildPage() {
  // создажим пупку вначале чтобы избежать ошибок
  await fsPromises.mkdir(`${thisPath}/project-dist`, { recursive: true });
  // чистим папку, замем она будет создаваться при создании первого файла
  await fsPromises.rm(`${thisPath}/project-dist`, { recursive: true });
  // заберем данные из нашего template.html
  async function template() {
    let template = await fsPromises.readFile(`${thisPath}/template.html`, 'utf8');
    const templateArr = [];
    // 1 этап, создаем index.html на основе template
    fs.readdir(`${thisPath}/components`, { withFileTypes: true }, (err, files) => {
      for (let file of files) {
        // возьмем наши данные
        let componentsFile = fsPromises.readFile(`${thisPath}/components/${file.name}`, 'utf-8');
        componentsFile = Promise.all([componentsFile]);
        componentsFile.then(([data]) => {
          template = template.replace(`{{${file.name.split('.')[0]}}}`, data);
          templateArr.push(template);
          if (templateArr.length === files.length) {
            const finalTemp = templateArr[templateArr.length - 1];
            fsPromises.writeFile(`${thisPath}/project-dist/index.html`, finalTemp, () => { });
          }
        });
      }
    });
    // 2 этап (если не получится пихай в if)
    bundleStyles();
    // 3 этап
    copyDir();
  }
  template();
}

// используем скрипт из пятого задания для бандла стилей
// создадим нашу функцию 
async function bundleStyles() {
  let stylesArr = [];
  // fsPromises.writeFile(`${thisPath}/project-dist/style.css`, '', () => { });
  fs.readdir(stylesPath, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      if (file.isFile() && path.extname(file.name) === '.css') {
        let fileData = fsPromises.readFile(`${stylesPath}/${file.name}`, 'utf8');
        // Получим кол-во нужных нам файлов (.css)
        const cssCount = files.filter((file) => {
          return path.extname(file.name) === '.css';
        }).length;
        fileData = Promise.all([fileData]);
        fileData.then((data) => {
          stylesArr.push(data);
          // !!! ЕСЛИ В ПАПКЕ STYLES БУДУТ НЕ ТОЛЬКО .css ФАЙЛЫ ТО IF НЕ СРАБОТАЕТ из-за разной длины stylesArr.length, files.length
          // теперь робит так как надо, cssCount спас
          if (stylesArr.length === cssCount) {
            stylesArr = stylesArr.reverse();
            fsPromises.writeFile(`${thisPath}/project-dist/style.css`, stylesArr.join(''), () => { });
          }
        });
      }
    });
  });
}

// используем скрипт из четвертого задания для копирования содержимого папки
async function copyDir() {
  // введем переменные для наших папок
  const thisPath = path.join(__dirname, 'assets');
  const newPath = path.join(`${__dirname}/project-dist`, 'assets');
  // Затем копируем каждый файл из source папки в project-dist
  await fsPromises.mkdir(newPath, { recursive: true });
  fs.readdir(thisPath, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    files.forEach((dir) => {
      if (dir.isDirectory()) {
        fsPromises.mkdir(`${newPath}/${dir.name}`, { recursive: true }, () => { });
      }
      fs.readdir(`${thisPath}/${dir.name}`, { withFileTypes: true }, (err, files) => {
        if (err) throw err;
        files.forEach((file) => {
          fsPromises.copyFile(`${thisPath}/${dir.name}/${file.name}`, `${newPath}/${dir.name}/${file.name}`);
        });
      });
    });
  });
}


buildPage();
// TODO добавить коммы