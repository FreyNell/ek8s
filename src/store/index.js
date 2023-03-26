import { configureStore } from '@reduxjs/toolkit';
import kubeReducer from './kubeSlice';

const store = configureStore({
  reducer: {
    kube: kubeReducer,
  },
});

export default store;