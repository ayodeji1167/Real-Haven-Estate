const { OAUTH } = require('../config/constants');

const getGoogleOauthUrl = () => {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';

  const options = {
    redirect_uri: OAUTH.GOOGLE_REDIRECT_URI,
    client_id: OAUTH.GOOGLE_CLIENT_ID,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' '),

  };

  const qs = new URLSearchParams(options);

  return `${rootUrl}?${qs.toString()}`;
};
module.exports = getGoogleOauthUrl;
