import { configureStore } from '@reduxjs/toolkit';
import { reducer as ProductionReducer } from 'pages/production/production.controller.entry';

const store = configureStore({
  reducer: {
    production: ProductionReducer,
  },

  devTools: process.env.NODE_ENV === 'development',
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
      // immutableCheck: false,
    });
  },
});

export type AppState = ReturnType<typeof store.getState>;
export type GetStateFunction = () => AppState;

export default store;
