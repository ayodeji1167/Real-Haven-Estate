/* eslint-disable camelcase */
const axios = require('axios');
const UserModel = require('../models/user-model');
const { createJwt } = require('../utils/data-crypto');
const getGoogleOauthUrl = require('../utils/get-google-url');
const BadRequestError = require('../error/bad-request-error');
const { OAUTH } = require('../config/constants');

class GoogleOauthController {
  handleRequestCode = async (req, res) => {
    // When the user clicks on the login with google, it comes here
    // here calls the google oauth server
    const url = getGoogleOauthUrl();
    res.redirect(url);
  };

  handleOauth = async (req, res) => {
    // get the code from the query string
    const { code } = req.query;

    // get the id and access token from the code
    const { id_token, access_token } = await this.getIdandAccessTokenFromCode(
      code,
    );

    // get the google user  with the token
    const googleUser = await this.getGoogleUserFromAccessToken(
      access_token,
      id_token,
    );

    // save the user
    if (!googleUser.verified_email) {
      throw new BadRequestError("This User's Email is  not verified");
    }
    const user = await this.saveUserFromGoogle(
      {
        email: googleUser.email,
      },
      {
        email: googleUser.email,
        'image.url': googleUser.picture,
        isValid: true,
      },
      { upsert: true, new: true },
    );
    // create a session

    // create  access and refresh tokens
    const token = await createJwt({ id: user._id, email: user.email }, '12h');

    const responseObject = {
      sucess: true,
      user,
      token,
    };
    // redirect
    res.send(responseObject);
  };

  getIdandAccessTokenFromCode = async (code) => {
    const root = 'https://oauth2.googleapis.com/token';
    const values = {
      code,
      client_id: OAUTH.GOOGLE_CLIENT_ID,
      client_secret: OAUTH.GOOGLE_CLIENT_SECRET,
      redirect_uri: OAUTH.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    };
    const qs = new URLSearchParams(values).toString();
    const response = await axios.post(root, qs, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  };

  getGoogleUserFromAccessToken = async (access_token, id_token) => {
    const googleUser = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      },
    );
    return googleUser.data;
  };

  saveUserFromGoogle = async (query, data, options) => {
    const user = await UserModel.findOneAndUpdate(query, data, options);
    return user;
  };
}

module.exports = new GoogleOauthController();
