const axios = require("axios");
const env = require("../config/env");

const getTrainingById = async (id, token, userId) => {
  const url = userId
    ? `${env.trainingServiceUrl}/training/${id}?userId=${encodeURIComponent(userId)}`
    : `${env.trainingServiceUrl}/training/${id}`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    timeout: 5000
  });

  return response.data.data;
};

module.exports = {
  getTrainingById
};
