'use strict';
const https = require('https');
const qs = require('querystring');

module.exports.endpoint = (event, context, callback) => {
  const request = {
    token:process.env.GIZMO_BOT_OAUTH_TOKEN
  }

  const url = 'https://slack.com/api/users.list?' + qs.stringify(request);

  https.get(url, (res) => {
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => rawData+=chunk);
    res.on('end', ()=> {
        try {
            console.log(JSON.parse(rawData));
        } catch (e) {
            console.log(e.message);
        }
    });
  });
};
