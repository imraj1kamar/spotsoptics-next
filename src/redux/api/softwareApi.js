// Redux/api/softwareApi.js
import { apiCollection } from "@/apiService/apiCollection";

export const softwareApi = {
  getSoftwares: () => apiCollection.getSoftwares(),
  addSoftware: (data) => apiCollection.createSoftware(data),
  updateSoftware: (id, data) => apiCollection.updateSoftware(id, data),
  deleteSoftware: (id) => apiCollection.deleteSoftware(id),
  assignSoftware: (data) => apiCollection.assignSoftware(data),
  getLinks: () => apiCollection.getSoftwareLinks(),
};
