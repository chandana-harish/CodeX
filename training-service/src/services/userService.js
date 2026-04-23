const axios = require("axios");
const env = require("../config/env");

const getUserById = async (id, token) => {
  const response = await axios.get(`${env.userServiceUrl}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    timeout: 5000
  });

  return response.data.data;
};

module.exports = {
  getUserById
};
