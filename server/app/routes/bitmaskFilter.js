module.exports = function(router, client) {
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
      lstOpt.push(listA[i] * listB[i]);
    }
    return lstOpt;
  }

  function bitmaskCreate(embeds) {
    var base = 32
    var maxEmbed = Math.max.apply(Math, embeds);
    var myStr = "";
    var myLst = [];
    var bitmasks = []
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
}
