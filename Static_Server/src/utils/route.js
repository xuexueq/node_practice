const fs = require('fs');

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
      // fs.readFile(filePath, (data) => {
      //   res.end(data);
      // }); 相应较慢 需要读完所有的内容才会返回结果，而不是像流一样，读到一部分就输出这部分结果
      fs.createReadStream(filePath).pipe(res);
    } else if(stats.isDirectory()) {
      fs.readdir(filePath, (err, files) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end(files.join(','));
      });
    }
  });
};
