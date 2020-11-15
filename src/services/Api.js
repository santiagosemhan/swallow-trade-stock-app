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

const get = (url) => {
  return axios.get(url);
};

const post = (url, data, config) => {
  return axios.post(url, data, config);
};

const put = () => {

};

export default {
  get,
  post,
  put,
  setAuthToken,
  getAuthToken,
  resetAuthToken,
};