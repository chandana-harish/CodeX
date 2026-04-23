const axios = require("axios");
const env = require("../config/env");

const verifyTokenRemotely = async (token) => {
  const response = await axios.get(`${env.authServiceUrl}/auth/verify`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    timeout: 5000
  });

  return response.data.user;
};

module.exports = {
  verifyTokenRemotely
};
