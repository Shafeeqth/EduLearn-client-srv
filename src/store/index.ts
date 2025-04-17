import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth-slice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  //   middleware: (getDefaultMiddleware) => {
  //     getDefaultMiddleware({
  //         serializableCheck: {

  //         };
  //     })
  //   }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch<AppDispatch>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
