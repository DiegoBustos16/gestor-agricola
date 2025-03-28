import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WaterShiftState {
  selectedWaterShiftId: number | null;
  dateRange: string | null;
  selectedQuadrant: number | null;
  formData: {
    startDate: string;
    finishDate: string;
  };
}

const initialState: WaterShiftState = {
  selectedWaterShiftId: null,
  dateRange: null,
  selectedQuadrant: null,
  formData: {
    startDate: "",
    finishDate: "",
  },
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
    setSelectedQuadrant: (state, action: PayloadAction<number | null>) => {
      state.selectedQuadrant = action.payload;
    },
    setFormData: (state, action: PayloadAction<{ startDate: string; finishDate: string }>) => {
      state.formData = action.payload;
    },
  },
});

export const { setWaterShift, setDateRange, setSelectedQuadrant, setFormData } = waterShiftSlice.actions;

export default waterShiftSlice.reducer;