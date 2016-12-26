module.exports = {
    selectBuilder: function (table, selected, object, databaseName) {
        var query = "SELECT " + selected + " FROM " + databaseName + "." + table;
        var tab_builder = [];
        var tab_values  = [];
        if (object != null) {
            query += " WHERE ";
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    tab_builder.push(key + "=?");
                    tab_values.push(object[key]);
                    tab_builder.push(" AND ");
                }
            }
        }
        tab_builder.pop();
        query += tab_builder.join('');
        var result = {'query' : query, 'values': tab_values}
        return result
    }
}
