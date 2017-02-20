var nodemailer = require('nodemailer');

module.exports = function(router) {
  router.route('/mail')
  .post(function(req, res) {
    var smtpConfig = {
      host : 'Smtp-pulse.com',
      port : 465,
      secure : true,
      auth : {
        user : 'julien@travelplanet.fr',
        pass : 'qCPjZQ9TmF'
      }
    }
    var transporter = nodemailer.createTransport(smtpConfig);

    // le mail a envoyer chez le client
    var mailClient = {
      from    : '"No-reply" <noreply@travelplanet.fr>"',
      to      : 'nmahefa@gmail.com',
      subject : 'Confirmation de demande de contact',
      text    : 'Travel Planet',
      html    : `<h1>Hello!</h1>`
    };


    // le mail à envoyer chez Travel
    var mailTravel = {
      from    : '"No-reply" <noreply@travelplanet.fr>',
      to      : 'finances@travelplanet.fr',
      subject : "Prise de contact",
      text    : 'Demande de contact client 👥',
      html    : "Doppin'low"
    };

    transporter.sendMail(mailClient, function(error) {
      if (error) {
        res.status(400).send({ "sucess": false, "message": error});
      } else {
        transporter.sendMail(mailTravel, function(err) {
          if (err) {
            res.status(400).send({"success": false, "message": err});
          } else {
            res.status(200).send({"result": "Sent"});
          }
        })
      }
    })
  })
}