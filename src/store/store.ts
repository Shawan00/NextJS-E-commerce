import { configureStore } from "@reduxjs/toolkit";
import breadcrumbReducer from "./features/breadcrumbSlice";
import cartReducer from "./features/cartSlice";

export const store = configureStore({
  reducer: {
    breadcrumb: breadcrumbReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;