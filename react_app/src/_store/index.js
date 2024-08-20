import { configureStore } from '@reduxjs/toolkit';

import { alertReducer } from './alert.slice';
import { authReducer } from './auth.slice';

export * from './alert.slice';
export * from './auth.slice';


export const store = configureStore({
    reducer: {
        alert: alertReducer,
        auth: authReducer
    },
});