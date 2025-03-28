import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WaterShiftState {
  selectedWaterShiftId: number | null;
  dateRange: string | null;
}

const initialState: WaterShiftState = {
  selectedWaterShiftId: null,
  dateRange: null,
};

const waterShiftSlice = createSlice({
  name: "waterShift",
  initialState,
  reducers: {
    setWaterShift: (state, action: PayloadAction<number | null>) => {
      state.selectedWaterShiftId = action.payload;
    },
    setDateRange: (state, action: PayloadAction<string | null>) => {
      state.dateRange = action.payload;
    },
  },
});

export const { setWaterShift, setDateRange } = waterShiftSlice.actions;

export default waterShiftSlice.reducer;
