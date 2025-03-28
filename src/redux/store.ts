import { configureStore } from "@reduxjs/toolkit";
import waterShiftReducer from "./waterShiftSlice";

export const store = configureStore({
  reducer: {
    waterShift: waterShiftReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
