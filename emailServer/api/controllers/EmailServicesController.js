/**
 * EmailServicesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  sendEmail: async (req, res) => {
    var nodemailer = require('nodemailer')
    /*validate params*/
    var params = req.validate([
      {'to': 'email'},
      {'from': 'email'},
      {'subject': 'string'},
      {'subject': 'string'},
      {'contents': 'string'},
      {'link': 'string'},
    ])
    sails.log.info(params)
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'cryptocom.delivery@gmail.com',
        pass: 'Cryptocom.delivery12'
      }
    })
    const mailOptions = {
      from: params.from, // sender address
      to: params.to, // list of receivers
      subject: params.subject, // Subject line
      html: `<h1 style="color:darkblue">Reset your password</h1>
              <p>Dear user, we've received a request to reset your password, click the link below to continue:</p>
              <a href=${params.link}>Click here to reset</a>
              <p>If you don't recognize this request, please reach out to our support team.</p>`// plain text body
    }
    transporter.sendMail(mailOptions, function (err, info) {
      if(err){
        sails.log.info(err)
        res.serverError(err)
      } else{
        sails.log.info(info)
        res.ok(info)
      }
    });


  }

};

