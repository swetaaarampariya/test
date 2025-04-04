import { configureStore } from '@reduxjs/toolkit';
// import customerReducer from './features/customerSlice';
// import permissionsReducer from './features/permissionsSlice';
// import customerCartReducer from './features/customerCartSlice';
// import crmUserDetailsReducer from './features/crmUserDetailsSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Define the root state type
export type RootState = ReturnType<typeof store.getState>;

// Define the AppDispatch type
export type AppDispatch = typeof store.dispatch;

// Configure the store
export const store = configureStore({
  reducer: {
    // permissions: permissionsReducer,
    // customer: customerReducer,
    // customer_cart: customerCartReducer,
    // crm_user_details: crmUserDetailsReducer
  }
});

//  create typed versions of the `useDispatch` and `useSelector` hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
