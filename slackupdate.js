'use strict';

const aws = require('aws-sdk');
const https = require('https');
const qs = require('querystring');
const s3 = new aws.S3();

const getSignedUrl = function(bucket, key) {
    return new Promise((resolve, reject) => {
        const params = {Bucket: bucket, Key: key, Expires: 604800};
        var url = s3.getSignedUrl('getObject', params);
        resolve(url);
    });
};

const writeToSlack = function(url) {
  return new Promise((resolve, reject) => {
    const response = {
        token: process.env.BOT_ACCESS_TOKEN,
        channel: process.env.CHANNEL_ID,
        text: url
      }

      const slackurl = process.env.POST_MESSAGE_URL + qs.stringify(response);

      https.get(slackurl, (res) => {
        const statusCode = res.statusCode;
        resolve();
      })
  });
}

module.exports.execute = (event, context, callback) => {
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));

  getSignedUrl(bucket, key)
    .then((url) => writeToSlack(url))
    .then(() => callback(null))
    .catch((err) => callback(err))
};
