'use strict'; //ECMA5の堅い文法モードになる。最近はとりあえず付けておく。
​
var glob = require('glob'); // Cの #include に相当
var path = require('path');
var fs = require('fs');
​
/**
 * Node.jsでは、コールバックは第１引数にerrを渡す、というのがデファクトスタンダード
 *
 * var callback = function (err, result) {
 *   if (err) {
 *     console.error('エラー発生');
 *     return
 *   }
 *
 *   console.log('正常終了：結果 >> ' result);
 * }
 *
 */
​
function fetchReadmeList(baseDir, cb) {
    glob('node_modules/**/README.md', {
        cwd: baseDir
    }, function(err, matches) {
        if (err) {
            cb(err, null);
            return;
        }
​
        cb(null, matches.map(function(filename) {
            var split = path.dirname(filename).split(path.sep),
                modNames = [];
​
            for (var i = split.length - 1; i >= 0; i--) {
                if (split[i] === 'node_modules') break;
                modNames.push(split[i]);
            }
​
            return {
                filepath: path.join(baseDir, filename),
                moduleName: modNames.join('/')
            };
        }));
    });
}
​
function getAsText(filename) {
    return fs.readFileSync(filename, 'utf-8');
}
​
//最後にまとめてエクスポートするほうがなんとなく好き
module.exports = {
    fetchReadmeList: fetchReadmeList,
    getAsText: getAsText
};
