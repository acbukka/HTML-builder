const fs = require('fs');
const path = require('path');
const fsPromises = require('fs').promises;
// укажем путь до папки styles
const stylesPath = path.join(__dirname, 'styles');
const thisPath = path.join(__dirname);
// 
// создадим нашу функцию 
async function bundleStyles() {
  let stylesArr = [];
  // await fsPromises.writeFile(`${thisPath}/project-dist/bundle.css`, stylesArr.join(''), () => { });
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
        // как только получим промис пушим данные из файла в массив
        fileData.then((data) => {
          stylesArr.push(data);
          if (stylesArr.length === cssCount) {
            // и просто перезаписываем файл содержимым массива
            fsPromises.writeFile(`${thisPath}/project-dist/bundle.css`, stylesArr.join(''), () => { });
          }
        });
      }
    });
  });
}
bundleStyles();
