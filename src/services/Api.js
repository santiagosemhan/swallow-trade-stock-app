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

const request = (method, url, data) => {
  axios
    .request({ url, method, data })
    .then(response => response)
    .catch(error => console.log(error, error.response));
};

const get = (url) => {
  const res = axios
    .get(url)
    .then(response => response)
    .catch(error => {
      console.log('Api Service - Get error: ', error, error.response);
      return error;
    });
    return res;
};

const post = (url, data) => {
  const res = axios
    .post(url, data)
    .then(response => response)
    .catch(error => {
      console.log('Api Service - Post error: ', error, error.response);
      return error;
    });
  return res;
};

const put = () => {

};

export default {
  get,
  post,
  put,
  request,
  setAuthToken,
  getAuthToken,
  resetAuthToken,
};