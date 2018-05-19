const Mailer = require('./mailer');

const to = 'ivnakuznetsov316@gmail.com';
const subject = 'Email confirmation';
const token = 'abcdefg';

const mailer = new Mailer();

mailer
  .deliver(
    'email-confirmation',
    { to, subject },
    { token },
  )
  .catch(error => console.log(error));
