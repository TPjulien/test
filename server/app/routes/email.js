var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

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
              console.log('Message sent: ' + info.response);
          })
      })
  }
