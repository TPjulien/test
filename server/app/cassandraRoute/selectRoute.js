var builder = require('../functions/builder.js');

module.exports = function(router, client) {
  router.route('/select/:table')
  .post(function(req, res) {
   var getRequest = builder.selectBuilder(req.params.table, req.body.selected, req.body.parameters);
    client.execute(getRequest.query, getRequest.values, function(err, result) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.send(result.rows);
      }
    })
  })
  router.route('/general/:table?')
  .put(function(req, res) {
    var request = "INSERT INTO click.table1 (type, key, id, js_data) VALUES (?,?,?,?)";
    console.log(request);
    client.execute(request, req.body.values_tab, function(err) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send("Ok !");
      }
    })
  })
  .post(function(req, res) {
    var request = "INSERT INTO click." + req.params.table + " " + req.body.columns + " VALUES " + req.body.values;
    console.log(request);
    client.execute(request, req.body.values_tab, {prepare: true}, function(err) {
      if (err) {
        res.status(400).send(err);
	console.log(err);
      } else {
        res.status(200).send("Ok !");
      }
    })
  })
  router.route('/multipleSelect')
  .post(function(req, res) {
    var tabIn    = req.body.tabIn;
    var values   = req.body.values;
    var request  = "SELECT js_data, id FROM click.table1 WHERE type=? AND key=? AND id IN (";
    var table = []
    for (var keyTab in tabIn) {
      if (tabIn.hasOwnProperty(keyTab)) {
        table.push("'" + tabIn[keyTab] + "'", ",");
      }
    }
    table.pop()
    table.push(")");
    table = request + " " + table.join(' ');
    client.execute(table, values, function(err, result) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.json(result.rows);
      }
    })
  })
  router.route('/delete')
  .post(function(req, res) {
    var values = req.body.values_tab;
    var table =  []
    var request = "DELETE FROM click." + req.body.table_name + " WHERE ";
    for (var key in values) {
      if (values.hasOwnProperty(key)) {
        table.push(key + "=? ", "AND");
      }
    }
    table.pop();
    table = request + " " + table.join(' ');
    console.log(table);
    client.execute(table, values, function(err) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send("Ok !");
      }
    })
  })
  function truncate (result) {
    if (result.length != 0) {
      var i = 0;
      while (result[i] == '0' && i < result.length - 1) {
        i++
      }
      if (result[i] == "0"){
        return ""
      } else {
        return result.substring(i)
      }
    }else {
      return ""
    }
  }

  function compareListOr(listA, listB) {
    var range  = Math.max.apply(Math, [listA.length, listB.length]);
    var lstOpt = [];
    for (i = 0; i < range;  i++) {
      if (i<Math.min.apply(Math, [listA.length, listB.length])){
        lstOpt.push(listA[i] + listB[i]);
      } else {
        if (i>=listA.length){
          lstOpt.push(listB[i]);
        }else {
          lstOpt.push(listA[i]);
        }
      }
    }
    return lstOpt;
  }
    function compareListAnd(listA, listB) {
	var range  = Math.min.apply(Math, [listA.length, listB.length]);
    var lstOpt = [];
    for (i = 0; i < range;  i++) {
      lstOpt.push(listA[i] & listB[i]);
    }
    return lstOpt;
  }

  function bitmaskCreate(embeds) {
    var maxEmbed = Math.max.apply(Math, embeds);
    var myStr = "";
    var myLst = [];
    var bitmasks = [];
    var base = 32;
    for (i = 1; i < maxEmbed + 2;  i++) {
      if ((i+1)%base == 0) {
        if (embeds.indexOf(i) != -1) {
          myStr = "1"+myStr;
        } else {
          myStr = "0"+myStr;
        }
        myLst.push(myStr)
        myStr = "";
      } else {
        if (embeds.indexOf(i) != -1) {
          myStr = "1"+myStr;
        } else {
          myStr = "0"+myStr;
        }
      }
    }
    myStr = truncate(myStr)
    if (myStr != "") {
      myLst.push(myStr)
    }
    for (var el in myLst){
      if (el != ""){
        bitmasks.push(parseInt(myLst[el], 2))
      }
    }
    return bitmasks
  }

  router.route('/getUserBitmask/:site_id')
  .post(function(req, res) {
    // tableau de role
    var roles    = req.body.roles;
    var bitmasks = [];
    var table    = [];
    var bitmasks = [];
    // ajouter le role_id plus tard
    var query    = "SELECT bitmasks, role_id FROM click.role WHERE site_id=?"
    client.execute(query, [req.params.site_id], function(err, result) {
      if (err) {
        res.status(400).send(err);
      } else {
        for (var row in result.rows) {
          if (roles.indexOf(result.rows[row].role_id) != -1) {
            var getLength = bitmasks.length;
            if (getLength == "0") {
              bitmasks = result.rows[row].bitmasks;
            } else {
              bitmasks = compareListOr(bitmasks, result.rows[row].bitmasks);
            }
          }
        }
        res.json({ "bitmask": bitmasks });
      }
    })
  })

  // permet d'ajouter les roles en bitmask
  router.route('/addEmbedToRole/:site_id')
  .post (function(req, res) {
    var base     = 32;
    var role_id  = req.body.role_id;
    var embeds   = req.body.embeds;
    var bitmasks = bitmaskCreate(embeds);
    res.send(bitmasks);
  })
  router.route('/role/:site_id/:role_id')
    .get(function(req, res) {
	var query = "SELECT * FROM click.role WHERE site_id=? AND role_id=?";
	client.execute(query, [req.params.site_id,req.params.role_id], function(err, result) {
	    if (err) {
		res.status(400).send(err);
	    } else {
		res.json(result.rows);
	    }
	})
    })
}
