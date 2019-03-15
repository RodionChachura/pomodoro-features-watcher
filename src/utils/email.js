const aws = require('aws-sdk')
const fs = require('fs')
const path = require('path')

const sendFeatureRelatedEmail = (email, mainText, link, linkText, subject) => {
  const defaultHTML = fs.readFileSync(path.resolve(__dirname, '../templates/default.html'), 'utf8')
  const readyHTML = defaultHTML
    .replace('{MAIN_TEXT}', mainText)
    .replace('{LINK}', link)
    .replace('{LINK_TEXT}', linkText)

  return new aws.SES({ region: process.env.AWS_REGION_SES })
    .sendEmail({
      Destination: {
        ToAddresses: [email]
      },
      Message: {
        Body: {
          Html: {
            Data: readyHTML
          }
        },
        Subject: {
          Data: subject
        }
      },
      Source: process.env.SENDER_EMAIL_ADDRESS
    })
    .promise()
}

const featureMovedIntoProgress = (email, featureName) => sendFeatureRelatedEmail(
  email,
  `Thank You for making a feature proposal. It is now in the list with the name "${featureName}."`,
  'https://pomodoro.increaser.org/features',
  'Upvote Your Feature',
  'Your Feature in the List'
)

const featureDone = (email, featureName) => sendFeatureRelatedEmail(
  email,
  `We finally implemented Your feature "${featureName}." What do you think about it?`,
  'https://pomodoro.increaser.org',
  'Check It Out',
  'We Finally Implemented Your Feature'
)

module.exports = {
  featureMovedIntoProgress,
  featureDone
}