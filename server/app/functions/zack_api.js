modules.exports = {
   returnOptions: function (query, database, decrypt_table) {
    var options = {
      url: 'http://api-interne.travelplanet.fr/api/ReadDatabase/selectMySQLPost',
      form : {
        sql      : query,
        database : database,
        decrypt  : decrypt_table
      }
    }
    return options;
  }
}
