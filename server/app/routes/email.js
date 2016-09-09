var nodemailer = require('nodemailer');

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
          var transporter = nodemailer.createTransport(smtpConfig);
          var mailOptions = {
            from: '"Fred Foo ?" <foo@blurdybloop.com>', // sender address
            to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
            subject: 'Hello ✔', // Subject line
            text: 'Hello world ?', // plaintext body
            html: '<b>Hello world ?</b>' // html body
        };
          // setup e-mail data with unicode symbols
          var mailOptions = {
              from: '<' + expediteur + '>', // sender address
              to: destinataire, // list of receivers
              subject: objet, // Subject line
              text: 'Hello world ?', // plaintext body
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
