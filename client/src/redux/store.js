import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import productReducer from './productSlice';
import { injectStore } from '../api/axios';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
  },
});

// Inject store into axios interceptor for state sync
injectStore(store);

export default store;
