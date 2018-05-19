const SES = require('aws-sdk/clients/ses');
const pug = require('pug');
const ejs = require('ejs');
const fs = require('fs');
const { mailerDefaultFrom, awsRegion } = require('../config');

const ses = new SES({ apiVersion: '2010-12-01', region: awsRegion });

class Mailer {
  constructor(from = null) {
    this.from = from || mailerDefaultFrom;
  }

  deliver(template, deliveryOptions, templateOptions) {
    const { subject } = deliveryOptions;
    let { to } = deliveryOptions;
    if (!Array.isArray(to)) { to = [to]; }

    const templatePath = `${__dirname}/views/${template}/`;
    const templatePathHtml = `${templatePath}/html.pug`;
    const templatePathText = `${templatePath}/text.ejs`;

    const html = pug.renderFile(templatePathHtml, templateOptions);

    // Not using ejs.renderFile to keep sync flow
    const textTemplateString = fs.readFileSync(templatePathText, { encoding: 'UTF-8' });
    const text = ejs.render(textTemplateString, templateOptions);

    const params = {
      Destination: {
        ToAddresses: to,
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: html,
          },
          Text: {
            Charset: 'UTF-8',
            Data: text,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: this.from,
    };

    return ses.sendEmail(params).promise();
  }
}

module.exports = Mailer;
