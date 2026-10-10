// api/apiHooks.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiCollection } from "./apiCollection";

// ==========================================
// AUTH, USERS & HIERARCHY
// ==========================================
export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiCollection.login,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiCollection.logout,
    onSuccess: () => {
      queryClient.setQueryData(["profile"], null);
      queryClient.clear();
    },
  });
};

export const useProfile = () => useQuery({ queryKey: ["profile"], queryFn: apiCollection.getProfile, retry: false });

export const useUsers = () => useQuery({ queryKey: ["users"], queryFn: apiCollection.getUsers });
export const useUserHierarchy = () => useQuery({ queryKey: ["userHierarchy"], queryFn: apiCollection.getUserHierarchy });

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiCollection.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["userHierarchy"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => apiCollection.updateUser(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiCollection.deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
};

// ==========================================
// SOFTWARE DISTRIBUTION & ACCESS
// ==========================================
export const useSoftwares = () => useQuery({ queryKey: ["softwares"], queryFn: apiCollection.getSoftwares });

export const useAssignSoftware = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiCollection.assignSoftware,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["softwares"] }),
  });
};

// ==========================================
// UNIFIED CHAT & ENQUIRIES
// ==========================================
export const useChatHistory = (params) => useQuery({ queryKey: ["chatHistory", params], queryFn: () => apiCollection.getChatHistory(params) });

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiCollection.sendMessage,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["chatHistory"] }),
  });
};

export const useSubmitEnquiry = () => {
  return useMutation({
    mutationFn: apiCollection.submitEnquiry,
  });
};

// ==========================================
// DYNAMIC MENU, CMS & SEO
// ==========================================
export const useMenu = () => useQuery({ queryKey: ["menu"], queryFn: apiCollection.getMenu });

export const useCmsSettings = () => useQuery({ queryKey: ["cmsSettings"], queryFn: apiCollection.getCmsSettings });

export const useUpdateCmsSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiCollection.updateCmsSettings,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cmsSettings"] }),
  });
};

export const useSeoMetadata = () => useQuery({ queryKey: ["seoMetadata"], queryFn: apiCollection.getSeoMetadata });
export const useSeoAnalytics = () => useQuery({ queryKey: ["seoAnalytics"], queryFn: apiCollection.getSeoAnalytics });

// ==========================================
// ACTIVITY & AUDIT LOGS
// ==========================================
export const useActivityLogs = () => useQuery({ queryKey: ["activityLogs"], queryFn: apiCollection.getActivityLogs });