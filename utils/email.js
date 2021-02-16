const nodemailer = require('nodemailer');
 
const sendEmail = (options)=>{

  
    const transport = nodemailer.createTransport(
        {
            service:'gmail',
            auth : {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        }
    );
    
    const mailOptions = {
        from : process.env.EMAIL_USER,
        to : options.email,
        subject : options.subject,
        html : options.message
    };
    
    transport.sendMail(mailOptions)
    .then((res)=>console.log('Email Sent!'))
    .catch((err)=>console.log(err));
}

module.exports = sendEmail;