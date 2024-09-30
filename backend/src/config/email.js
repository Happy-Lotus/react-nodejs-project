const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'happylotus145@gmail.com',
      pass: 'evwu iivm wbwc vslp'
    }
  });

module.exports = transporter;