import axios from "axios";
const baseUrl = "/api/blogs";

let token;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const config = {
    headers: { Authorization: token },
  };
  const request = axios.get(baseUrl, config);
  return request.then((response) => response.data);
};

const login = (payload) => {
  const request = axios.post("/api/login", payload);
  return request.then((response) => response.data);
};

const create = (payload) => {
  const config = {
    headers: { Authorization: token },
  };
  const request = axios.post(baseUrl, payload, config);
  return request.then((response) => response.data);
};

const update = (blogId, payload) => {
  const config = {
    headers: { Authorization: token },
  };
  const request = axios.patch(`${baseUrl}/${blogId}`, payload, config);
  return request.then((response) => response.data);
};

const remove = (blogId, payload) => {
  const config = {
    headers: { Authorization: token },
  };
  const request = axios.delete(`${baseUrl}/${blogId}`, config);
  return request.then((response) => response.data);
};

export default { getAll, login, setToken, create, update, remove };
