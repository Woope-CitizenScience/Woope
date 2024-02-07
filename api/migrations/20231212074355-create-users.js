'use strict';

var dbm;
var type;
var seed;
var fs = require('fs');
var path = require('path');
var Promise;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
  Promise = options.Promise;
};

exports.up = function(db) {
  var basePath = path.join(__dirname, 'sqls');
  var files = [
    '20231212074355-create-users-up.sql',
    '20240126-create-post-comments-up.sql',
    '20240204-create-weather-up.sql'
  ];

  var promises = files.map(function(file) {
    var filePath = path.join(basePath, file);
    return new Promise(function(resolve, reject) {
      fs.readFile(filePath, {encoding: 'utf-8'}, function(err, data) {
        if (err) return reject(err);
        console.log('Received data from file: ' + file);
        resolve(data);
      });
    })
    .then(function(data) {
      return db.runSql(data);
    });
  });

  return Promise.all(promises);
};

exports.down = function(db) {
  var basePath = path.join(__dirname, 'sqls');
  // List files in the reverse order they were applied in up migration
  var files = [
    '20240204-create-weather-down.sql',
    '20240126-create-post-comments-down.sql',
    '20231212074355-create-users-down.sql'
  ];

  var promiseChain = files.reduce((promise, file) => {
    var filePath = path.join(basePath, file);
    return promise.then(() => {
      return new Promise((resolve, reject) => {
        fs.readFile(filePath, {encoding: 'utf-8'}, function(err, data) {
          if (err) return reject(err);
          console.log('Received data from file: ' + file);
          db.runSql(data).then(resolve).catch(reject);
        });
      });
    });
  }, Promise.resolve()); // Start with a resolved promise to kick off the chain

  return promiseChain.then(() => console.log('All down migrations executed successfully.'));
};

exports._meta = {
  "version": 1
};
