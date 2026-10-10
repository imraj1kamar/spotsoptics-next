// redux/slices/softwareSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  softwares: [],
  links: [],
  loading: false,
  error: null,
};

const softwareSlice = createSlice({
  name: "software",
  initialState,
  reducers: {
    setSoftwares: (state, action) => {
      state.softwares = action.payload;
      state.loading = false;
    },
    addSoftwareToState: (state, action) => {
      state.softwares.unshift(action.payload);
    },
    updateSoftwareInState: (state, action) => {
      const updated = action.payload;
      const index = state.softwares.findIndex((s) => s.id === updated.id);
      if (index !== -1) {
        state.softwares[index] = updated;
      }
    },
    setLinks: (state, action) => {
      state.links = action.payload;
      state.loading = false;
    },
    addLinkToState: (state, action) => {
      state.links.unshift(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setSoftwares,
  addSoftwareToState,
  updateSoftwareInState,
  setLinks,
  addLinkToState,
  setLoading,
  setError,
} = softwareSlice.actions;

export const selectSoftwares = (state) => state.software?.softwares || [];
export const selectSoftwareLinks = (state) => state.software?.links || [];
export const selectSoftwareLoading = (state) => state.software?.loading || false;

export default softwareSlice.reducer;
