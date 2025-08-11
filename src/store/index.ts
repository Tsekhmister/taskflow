import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authSlice from './slices/authSlice';
import tasksSlice from './slices/tasksSlice';
import rootSaga from './sagas/rootSaga';

// Persist configuration for tasks
const tasksPersistConfig = {
  key: 'tasks',
  storage,
  whitelist: ['tasks'], // Only persist tasks array
};

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Configure store
export const store = configureStore({
  reducer: {
    auth: authSlice,
    tasks: persistReducer(
      tasksPersistConfig,
      tasksSlice
    ) as unknown as typeof tasksSlice,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(sagaMiddleware),
});

// Create persist store
export const persistor = persistStore(store);

// Run root saga
sagaMiddleware.run(rootSaga);

// Types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
