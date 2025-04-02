import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FormData {
  id?: number;
  startDate: string;
  finishDate: string;
  editMode: boolean;
}

interface WaterShiftState {
  selectedWaterShiftId: number | null;
  waterShifts: any[];
  selectedQuadrant: number | null;
  formData: FormData;
  shouldRefetchWaterShifts: boolean;
  viewMode: "current" | "history";
  fromDate: string | null;
  toDate: string | null;
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
  viewMode: "current",
  fromDate: null,
  toDate: null,
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
    setFormData: (state, action: PayloadAction<FormData>) => {
      state.formData = action.payload;
    },
    setShouldRefetchWaterShifts: (state, action: PayloadAction<boolean>) => {
      state.shouldRefetchWaterShifts = action.payload;
    },
    setViewMode: (state, action: PayloadAction<"current" | "history">) => {
      state.viewMode = action.payload;
    },
    setFilterDates: (state, action) => {
      state.fromDate = action.payload.fromDate;
      state.toDate = action.payload.toDate;
    },
  },
});

export const {
  setWaterShift,
  setWaterShifts,
  setSelectedQuadrant,
  setFormData,
  setShouldRefetchWaterShifts,
  setViewMode,
  setFilterDates,
} = waterShiftSlice.actions;

export default waterShiftSlice.reducer;
