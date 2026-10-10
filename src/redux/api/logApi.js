// Redux/api/logApi.js
import { apiCollection } from "@/apiService/apiCollection";

export const logApi = {
  getLogs: () => apiCollection.getAuditLogs(),
  getActivityLogs: () => apiCollection.getActivityLogs(),
  createLog: (data) => apiCollection.createAuditLog(data),
  createActivityLog: (data) => apiCollection.createActivityLog(data),
};