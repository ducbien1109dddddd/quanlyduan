import { createSlice } from '@reduxjs/toolkit';
import { mockTenders } from '../../data/mockData';

const initialState = {
  tenders: mockTenders,
  selectedTender: null,
};

const tendersSlice = createSlice({
  name: 'tenders',
  initialState,
  reducers: {
    addTender: (state, action) => {
      state.tenders.push({
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      });
    },
    updateTender: (state, action) => {
      const index = state.tenders.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tenders[index] = { ...state.tenders[index], ...action.payload };
      }
    },
    deleteTender: (state, action) => {
      state.tenders = state.tenders.filter(t => t.id !== action.payload);
    },
    setSelectedTender: (state, action) => {
      state.selectedTender = action.payload;
    },
  },
});

export const { addTender, updateTender, deleteTender, setSelectedTender } = tendersSlice.actions;
export default tendersSlice.reducer;