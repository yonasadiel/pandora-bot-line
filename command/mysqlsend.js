
/**
 * Mysql
 * ------------------
 * Run a mysql statement
 */

module.exports = {
	receive : function(argc, args, client, event) {
		var mysql = require('mysql');

		if (args[1] === "CREATE") {
      var con = mysql.createConnection({
        host    : "localhost",
        user    : "root",
        password: "",
      });

      con.connect(function(err) {
        if (err) throw err;

        var query = "";
        args.forEach(function(item,index) {
          if (index !== 0) {
            query += " " + item;
          }
        });

        con.query(query, function (err, result) {
          if (err) throw err;

          return client.replyMessage(event.replyToken,{
            type: "text",
            text: JSON.stringify(result),
          });

        });
      });
		} else {
			var con = mysql.createConnection({
			  host    : "localhost",
			  user    : "root",
			  password: "",
		    database: "mydb",
			});

			con.connect(function(err) {
			  if (err) throw err;

        var query = "";
        args.forEach(function(item,index) {
          if (index !== 0) {
            query += " " + item;
          }
        });

			  con.query(query, function (err, result) {
			    if (err) throw err;

          return client.replyMessage(event.replyToken,{
            type: "text",
            text: JSON.stringify(result),
          });

			  });
			});
		}
	}
};