import { configureStore } from '@reduxjs/toolkit'
import dataReducer from './slices/dataSlice'
import columnsReducer from './slices/columnsSlice'

export const store = configureStore({
  reducer: {
    data: dataReducer,
    columns: columnsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
