// Redux/api/userApi.js
import { apiCollection } from "@/apiService/apiCollection";

export const userApi = {
  getUsers: () => apiCollection.getUsers(),
  addUser: (userData) => apiCollection.createUser(userData),
  updateUser: (id, userData) => apiCollection.updateUser(id, userData),
  deleteUser: (id) => apiCollection.deleteUser(id),
};