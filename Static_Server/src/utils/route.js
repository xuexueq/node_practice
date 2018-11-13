const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const config = require('../config/defaultConfig');
const mime = require('./mime');

// 在引入文件时，除了 require()中一般使用相对路径，其他情况尽量使用绝对路径；
const tplPath = path.join(__dirname, '../index.html');
const source = fs.readFileSync(tplPath); // buffer 同步读文件，因为拿到模板文件是下面的前提，同时又可以利用缓存，不用每次都读取模板文件
const template =  Handlebars.compile(source.toString());

/**
 * 根据路由判断指向的内容是一个文件 or 文件夹
*/
module.exports = function route(filePath, req, res) {
  fs.stat(filePath, (err, stats) => {
    if(err) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end(`${filePath} is not a directory or file`);
      return; //
    }

    if(stats.isFile()) {
      res.statusCode = 200;
      res.setHeader('Content-Type', mime(filePath));
      // fs.readFile(filePath, (data) => {
      //   res.end(data);
      // }); 相应较慢 需要读完所有的内容才会返回结果，而不是像流一样，读到一部分就输出这部分结果
      fs.createReadStream(filePath).pipe(res);
    } else if(stats.isDirectory()) {
      fs.readdir(filePath, (err, files) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        const dir = path.relative(config.root, filePath);
        const data = {
          files: files.map((file) => {
            return {
              icon: mime(file),
              file: file
            }
          }),
          dir: dir ? `/${dir}` : '', // 注意需要加上根路径/ 表示相对于根路径的绝对路径
          title: path.basename(filePath)
        };
        res.end(template(data));
      });
    }
  });
};
