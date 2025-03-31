import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WaterShiftState {
  selectedWaterShiftId: number | null;
  waterShifts: any[];
  selectedQuadrant: number | null;
  formData: {
    startDate: string;
    finishDate: string;
    editMode: boolean;
  };
  shouldRefetchWaterShifts: boolean; 
}

const initialState: WaterShiftState = {
  selectedWaterShiftId: null,
  waterShifts: [],
  selectedQuadrant: null,
  formData: {
    startDate: "",
    finishDate: "",
    editMode: false,
  },
  shouldRefetchWaterShifts: false,
};

const waterShiftSlice = createSlice({
  name: "waterShift",
  initialState,
  reducers: {
    setWaterShift: (state, action: PayloadAction<number | null>) => {
      state.selectedWaterShiftId = action.payload;
    },
    setWaterShifts: (state, action: PayloadAction<any[]>) => {
      state.waterShifts = action.payload;
    },
    setSelectedQuadrant: (state, action: PayloadAction<number | null>) => {
      state.selectedQuadrant = action.payload;
    },
    setFormData: (state, action: PayloadAction<{ startDate: string; finishDate: string , editMode:boolean}>) => {
      state.formData = action.payload;
    },
    setShouldRefetchWaterShifts: (state, action: PayloadAction<boolean>) => {
      state.shouldRefetchWaterShifts = action.payload;
    },
  },
});

export const { setWaterShift, setWaterShifts, setSelectedQuadrant, setFormData, setShouldRefetchWaterShifts } = waterShiftSlice.actions;

export default waterShiftSlice.reducer;