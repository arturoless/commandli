var nodemailer = require('nodemailer')
var transporter = nodemailer.createTransport({
service: 'gmail',
auth: { 
  user: "arturo.lessieur@gmail.com",
  pass: "nodeMail(nombre)"
}
});
var mailOptions = {
  from: "arturo.lessieur@gmail.com",
  to: "173208@ids.upchiapas.edu.mx",
  subject: "holaaa",
  text: "k aces?"
};
transporter.sendMail(mailOptions, function(error, info){
  if(error) {
      console.log(error);
  }else {
      console.log('Email sent: ' + info.response);
  }
});
