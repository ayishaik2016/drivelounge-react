import axios from 'axios';
import settings from './axiosHeaders';

const axiosClient = axios.create();

const axiosClientImage = axios.create();

axiosClient.defaults.baseURL = settings.HOST_URL;
axiosClientImage.defaults.baseURL = settings.HOST_URL;

axiosClient.defaults.headers = settings.headers;
axiosClientImage.defaults.headers = settings.headersImage;

axiosClient.defaults.withCredentials = false;
axiosClientImage.defaults.withCredentials = false;


function checkHeader() {
  if (localStorage.jwtToken) {
    axiosClient.defaults.headers['Authorization'] = `Bearer${localStorage.jwtToken}`;
  }
}

function checkImageHeader() {
  
  if (localStorage.jwtToken) {
    axiosClientImage.defaults.headers['Authorization'] = `Bearer${localStorage.jwtToken}`;
  }
}

export function getRequest(URL) {
  checkHeader();
  return axiosClient.get(`/${URL}`).then((response) => response);
}

export function postRequest(URL, payload) {
  checkHeader();
  return axiosClient.post(`/${URL}`, payload).then((response) => response);
}

export function patchRequest(URL, payload) {
  checkHeader();
  return axiosClient.patch(`/${URL}`, payload).then((response) => response);
}

export function putRequest(URL, payload) {
  checkHeader();
  return axiosClient.put(`/${URL}`, payload).then((response) => response);
}

export function deleteRequest(URL) {
  checkHeader();
  return axiosClient.delete(`/${URL}`).then((response) => response);
}

export function uploadRequest(URL, payload) {
  const config = {
    headers: {
        'content-type': 'multipart/form-data'
    }
  }
  checkImageHeader();
  return axiosClientImage.post(`/${URL}`, payload,config).then((response) => response);
}

// Unauthorized API (response status 401) request token refreshed here, again same API request called.
// axiosClient.interceptors.response.use(null, (error) => {
//   if (
//     error.config &&
//     error.config.url !== '/login' &&
//     error.response &&
//     error.response.status === 401
//   ) {
//     return axios
//       .post(`${settings.HOST_URL}/refresh_token`)
//       .then(() => axios.request(error.config));
//   }
//   return Promise.reject(error);
// });
