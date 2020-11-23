import axios from 'axios';
import env from './../../env';

axios.defaults.baseURL = env.BASE_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';

const getAuthToken = () => {
  return axios.defaults.headers.common['Authorization'];
};

const resetAuthToken = () => {
  if (axios.defaults.headers.common["Authorization"]) {
    delete axios.defaults.headers.common["Authorization"];
  }
};

const setAuthToken = (authToken) => {
  if (authToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
  } else {
    throw new Error('Wrong token');
  }
};

const get = (url, params = null) => {
  return axios.get(url, { params });
};

const post = (url, data, config) => {
  return axios.post(url, data, config);
};

const put = (url, data, config) => {
  return axios.put(url, data, config);
};

export default {
  get,
  post,
  put,
  setAuthToken,
  getAuthToken,
  resetAuthToken,
};