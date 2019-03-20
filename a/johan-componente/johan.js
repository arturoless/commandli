var nodemailer = require('nodemailer')
var transporter = nodemailer.createTransport({
service: 'gmail',
auth: { 
  user: "arturo.lessieur@gmail.com",
  pass: "execNode"
}
});
var mailOptions = {
  from: "arturo.lessieur@gmail.com",
  to: "173208@ids.upchiapas.edu.mx",
  subject: "aas",
  text: "assad"
};
transporter.sendMail(mailOptions, function(error, info){
  if(error) {
      console.log(error);
  }else {
      console.log('Email sent: ' + info.response);
  }
});
