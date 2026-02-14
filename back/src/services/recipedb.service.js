const apiClient = require("../utils/apiClient");

exports.fetchRecipes = async (endpoint, params) => {
  try {
    const response = await apiClient.get(endpoint, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
