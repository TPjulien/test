var nodemailer = require('nodemailer');

module.exports = function(router, connection) {

  // route pour lister les numéros de téléphone du profil
  router.route('/sendMail')
      .post(function(req, res) {
        
        var expediteur      = req.body.expediteur;
        var destinataire    = req.body.destinataire;
        var objet           = req.body.objet;
        var body            = req.body.body;

        var smtpTransport = nodemailer.createTransport("SMTP", {
            service: "Smtp-pulse.com",
            port: 2525,
            auth: {
              user: 'julien@travelplanet.fr',
              pass: 'qCPjZQ9TmF'
            }
        });

        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: '<' + expediteur + '>', // sender address
            to: destinataire, // list of receivers
            subject: objet, // Subject line
            text: 'Hello world ?', // plaintext body
            html: body // html body
        };

        smtpTransport.sendMail(mailOptions, function(error, response) {
            if (error) {
                console.log(error);
            } else {
                console.log("Message sent: " + response.message);
            }

            // if you don't want to use this transport object anymore, uncomment following line
            smtpTransport.close(); // shut down the connection pool, no more messages

            callback();
        });

      })
  }
