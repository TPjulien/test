var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var mysql = require('mysql');

module.exports = function(router, connection) {

  // route pour lister les numéros de téléphone du profil
  router.route('/sendMail')
      .post(function(req, res) {
          var expediteur      = req.body.expediteur;
          var destinataire    = req.body.destinataire;
          var objet           = req.body.objet;
          var body            = req.body.body;

          var smtpConfig = {
              host: 'Smtp-pulse.com',
              port: 465,
              secure: true, // use SSL
              auth: {
                  user: 'julien@travelplanet.fr',
                  pass: 'qCPjZQ9TmF',
              }
          };
          // create reusable transporter object using the default SMTP transport
          var transporter = nodemailer.createTransport(smtpTransport(smtpConfig));

          // setup e-mail data with unicode symbols
          var mailOptions = {
              from: '<julien@travelplanet.fr>', // sender address
              replyTo:expediteur,
              to: destinataire, // list of receivers
              subject: objet, // Subject line
              html: body // html body
          };
          // send mail with defined transport object
          transporter.sendMail(mailOptions, function(error, info){
              if(error){
                  return console.log(error);
              }
              res.status(200).send('ok');
          })
      })
  // route pour lister les infos mail
  router.route('/infoMail/:site_id')
      .get(function(req, res) {
          var query_one = "SELECT ??,??,?? FROM ??  \
                           WHERE ?? = ? ";
          var table_one = ["email_destination","email_title","email_subject",
                           "tp_control.embed_email_view_WIP",
                           "SITE_ID", req.params.site_id];
          query_one     = mysql.format(query_one, table_one);
          connection.query(query_one, function(err, rows) {
              if (err)
                  res.status(400).send(err);
              else
                  res.json(rows);
          })
      })
  // route pour ajouter le mail en base
  router.route('/putHistoryMail')
      .post (function(req, res) {
        var query = "SELECT MAX(??) as new_mail_id FROM ??";
        var table = ['EMAIL_ID', 'tp_control.History_Email_WIP'];
        query = mysql.format(query, table);
        connection.query(query, function (err, rows) {
            if (err)
              res.status(400).send(err);
            else
              var new_mail_id    = rows[0].new_mail_id + 1;
              var query_one = "SELECT NOW() as new_date"
              query_one     = mysql.format(query_one);
              connection.query(query_one, function(err, rows_one) {
                  if (err)
                      res.status(400).send(err);
                  else
                      var new_date    = rows_one[0].new_date;
                      var query_two = "INSERT INTO ?? (??,??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?,?)";
                      var table_two = ["tp_control.History_Email_WIP",
                                       "SITE_ID","UID","EMAIL_ID","DEPOSITED_DATE","email_sender","email_destination","email_title","email_body",
                                       req.body.SITE_ID,req.body.UID,new_mail_id,new_date,req.body.email_sender,req.body.email_destination,req.body.email_title,req.body.email_body];
                     query_two     = mysql.format(query_two, table_two);
                     connection.query(query_two, function(err, rows_two) {
                         if (err)
                             res.status(400).send(err);
                         else
                             res.status(200).send('Created');
                     })
              })


        })

    })
    // route pour l'ensemble des billets par utilisateur
    router.route('/getBillets/:site_id/:uid')
        .get(function(req, res) {
            var query_one = "SELECT * FROM ??  \
                             WHERE ?? = ?  AND ?? = ? GROUP BY ??";
            var table_one = ["tp_control.History_Email_WIP",
                             "SITE_ID",req.params.site_id,
                             "UID", req.params.uid,
                             "BILLET_ID"];
            query_one     = mysql.format(query_one, table_one);
            connection.query(query_one, function(err, rows) {
                if (err)
                    res.status(400).send(err);
                else
                    res.json(rows);
            })
        })

    // route pour lister les infos mail
    router.route('/getMailsByBillet/:site_id/:uid/:billet_id')
        .get(function(req, res) {
            var query_one = "SELECT * FROM ??  \
                             WHERE ?? = ?  AND ?? = ? AND ?? = ? ORDER BY ?? DESC";
            var table_one = ["tp_control.History_Email_WIP",
                             "SITE_ID",req.params.site_id,
                             "UID", req.params.uid,
                             "BILLET_ID",req.params.billet_id,
                             "EMAIL_ID"];
            query_one     = mysql.format(query_one, table_one);
            connection.query(query_one, function(err, rows) {
                if (err)
                    res.status(400).send(err);
                else
                    res.json(rows);
            })
        })
}
