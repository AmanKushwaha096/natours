const nodemailer = require('nodemailer');
const pug = require('pug')
const { htmlToText } = require('html-to-text');

const Transport = require("nodemailer-brevo-transport");

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url
        this.from = `Aman Codes <${process.env.EMAIL_FROM}>`
    }

    newTransport() {
    
        const transporter = nodemailer.createTransport(

            new Transport({ apiKey: process.env.API_KEY })
        
        );
        return transporter

    }

    async send(template, subject) {
        // send the actual email

        // render html based on pug template 
        const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`,{
            firstName : this.firstName,
            url : this.url,
            subject 
        })


        // define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText(html)
        }
        // Create a transport and send email
        
        await this.newTransport().sendMail(mailOptions);
    }
    async sendWelcome() {
        await this.send('Welcome', 'Welcome to the Natours Family !')
    }

    async sendPasswordReset(){
        console.log("hrllo");
        await this.send('passwordReset','Your password reset token is valid for only 10 minutes')
    }
}
