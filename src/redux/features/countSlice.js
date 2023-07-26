import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchCount: 20,
};

const countSlice = createSlice({
  name: 'count',
  initialState,
  reducers: {
    setSearchCount: (state) => {
      state.searchCount += 15;
    },
  },
});

export const { setSearchCount } = countSlice.actions;

export default countSlice.reducer;
