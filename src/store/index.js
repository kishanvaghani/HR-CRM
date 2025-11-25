import { configureStore } from '@reduxjs/toolkit';
import interviewsReducer from '../features/interviews/interviewsSlice';
import candidatesReducer from '../features/candidate/candidateSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';

export const store = configureStore({
  reducer: {
    interviews: interviewsReducer,
    candidates: candidatesReducer,
    dashboard: dashboardReducer,
  },
});

export default store;