var http_post = require('http-post');
var request   = require('request');

module.exports = function(router, connection, mysql) {
  router.route('/getBulletFilter')
  .post (function(req, res) {
    if (req.body.schema == undefined || req.body.table == undefined || req.body.column_name) {
      res.status(201).send("");
    } else {
      var table = req.body.schema + '.' + req.body.table
      var query_bullet = "SELECT DISTINCT(??) FROM ??";
      var table_bullet = [req.body.column_name, table];
      query_bullet = mysql.format(query_bullet, table_bullet);
      connection.query(query_bullet, function(err, result_bullet) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.json(result_bullet);
        }
      })
    }
  })
  router.route('/getDatatable')
  .post(function(req, res) {
    var max        = req.body.max;
    var min        = req.body.min;
    var datas      = req.body.datas;
    var columns    = datas.list_columns;
    var table_name = datas.table_name;
    var filters    = req.body.filters;
    var query      = "SELECT `";
    for (var key in columns) {
      if (columns.hasOwnProperty(key)) {
        query += columns[key].column_name + "`,`";
      }
    }
    query = query.slice(0, -2);

    query += " FROM " + table_name;
    if (filters.length != 0) {
      query += " WHERE ";
      for (var key in filters) {
        if (filters[key].value.length == 2)
        query += "`" + filters[key].column_name + "` BETWEEN '" + filters[key].value[0] + "' AND '" + filters[key].value[1] + "' AND ";
        else
        query += "`" + filters[key].column_name + "` LIKE '%" + filters[key].value[0] + "%' AND ";
      }
      query = query.slice(0, -4);
    }
    query += " LIMIT " + min + "," + max;
    connection.query(query, function(err, result) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.send(result);
      }
    })
  })
  router.route('/downloadBlob')
  .post(function(req, res) {
    var query = "SELECT ?? AS pdf FROM ?? WHERE";
    table = ['BLOB', req.body.schema + '.' + req.body.table];
    for(var key in req.body.values[0]) {
      if (req.body.values[0].hasOwnProperty(key)) {
        query += " ?? = ? AND";
        table.push(key, req.body.values[0][key]);
      }
    }
    query = query.slice(0, -3);
    query = mysql.format(query, table);
    connection.query(query, function(err, result) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.send(new Buffer(result[0].pdf, 'binary'));
      }
    })
  })
};
