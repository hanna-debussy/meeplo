import { configureStore, combineReducers } from '@reduxjs/toolkit';
import memoryReducer from './memorySlice';
import scheduleReducer from './scheduleSlice';
import { groupListSlice, groupDetailSlice } from './groupSlice';

// TODO: import redux-persist

const rootReducer = combineReducers({
  memory: memoryReducer,
  groupList: groupListSlice.reducer,
  group: groupDetailSlice.reducer,
  schedule: scheduleReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});