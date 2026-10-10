// Redux/api/menuApi.js
import { apiCollection } from "@/apiService/apiCollection";

export const menuApi = {
  getMenus: (fetchAll = false) => apiCollection.getMenus(fetchAll),
  createMenu: (data) => apiCollection.createMenu(data),
  updateMenu: (id, data) => apiCollection.updateMenu(id, data),
  deleteMenu: (id) => apiCollection.deleteMenu(id),
};