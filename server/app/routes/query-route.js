var request = require('request');
var fs = require("fs")

module.exports = function (router, connection, mysql) {
  router.route('/sql/:query_id')
    .get(function (req, res) {
        fs.readFile("../assets/sql/"+req.params.query_id+".sql", function(err, query){
            if(err){
                res.status(400).send(err);
            } else {
                connection.query(query, callBackLogs)
            }
        })
        function callBackLogs(err, result){
            if (err) {
                res.status(400).send(err);
            } else {
                res.send(result);
            }
        }
        function writeLogs(){
            fs.readFile("../assets/count", function(err, res){
                if(err){console.log(res)}
                var count = Number(res.split("\n")[0])
                fs.writeFile('../assets/logs/logs-'+count, query, function(err){
                    if(err){console.log(err)}
                })
                    count++;
                    fs.writeFile("../assets/logs/logs-"+count, count, function(err){
                        if(err){console.log(err)}
                    }
                )
            })
        }
    })

}
