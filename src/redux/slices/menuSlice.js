// redux/slices/menuSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  menus: [],
  loading: false,
  error: null,
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setMenus: (state, action) => {
      state.menus = action.payload;
      state.loading = false;
    },
    addMenuToState: (state, action) => {
      state.menus.push(action.payload);
    },
    updateMenuInState: (state, action) => {
      const updatedMenu = action.payload;
      const index = state.menus.findIndex((m) => m.id === updatedMenu.id);
      if (index !== -1) {
        state.menus[index] = updatedMenu;
      }
    },
    removeMenuFromState: (state, action) => {
      const menuId = action.payload;
      state.menus = state.menus.filter((m) => m.id !== menuId);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    clearMenus: (state) => {
      state.menus = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setMenus,
  addMenuToState,
  updateMenuInState,
  removeMenuFromState,
  setLoading,
  clearMenus,
} = menuSlice.actions;

export const selectMenus = (state) => state.menu.menus || [];
export const selectLoading = (state) => state.menu.loading || false;

export default menuSlice.reducer;