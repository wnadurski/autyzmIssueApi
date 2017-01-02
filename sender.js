var nodemailer = require('nodemailer');
var sendmailTransport = require('nodemailer-sendmail-transport');

const transporter = nodemailer.createTransport(sendmailTransport())

const generateText = body => (
    `Zgłoszenie '${body.title}'\n\n` +
    `Treść:\n'${body.content}\n\n'` +
    `Dane nadawcy: '${body.sender}'`
)

const sender = mailingList => (body, callback) => {
    const mailOptions = {
        from: '"Autyzm PG" <autyzm@pg.edu.pl>',
        to: mailingList.join(", "),
        subject: `[Zgłoszenie] - ${body.tag} -  ${body.title}`,
        text: generateText(body)
    }

    transporter.sendMail(mailOptions, callback)
}

module.exports = sender