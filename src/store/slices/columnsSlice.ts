import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Column = {
  key: string
  label: string
  visible: boolean
}

const defaultColumns: Column[] = [
  { key: 'name', label: 'Name', visible: true },
  { key: 'email', label: 'Email', visible: true },
  { key: 'age', label: 'Age', visible: true },
  { key: 'role', label: 'Role', visible: true },
]

// Use a deterministic initial state for SSR. Persisted columns are loaded on the client
// after hydration to avoid server/client markup mismatches.
const initialState: Column[] = defaultColumns

const columnsSlice = createSlice({
  name: 'columns',
  initialState,
  reducers: {
    setColumns: (_state: Column[], action: PayloadAction<Column[]>) => {
      try { if (typeof window !== 'undefined') localStorage.setItem('columns', JSON.stringify(action.payload)) } catch {}
      return action.payload
    },
    toggleColumn: (state: Column[], action: PayloadAction<string>) => {
      const idx = state.findIndex((c: Column) => c.key === action.payload)
      if (idx >= 0) state[idx].visible = !state[idx].visible
      try { if (typeof window !== 'undefined') localStorage.setItem('columns', JSON.stringify(state)) } catch {}
    },
    addColumn: (state: Column[], action: PayloadAction<Column>) => {
      state.push(action.payload)
      try { if (typeof window !== 'undefined') localStorage.setItem('columns', JSON.stringify(state)) } catch {}
    },
    removeColumn: (state: Column[], action: PayloadAction<string>) => {
      const filtered = state.filter(c => c.key !== action.payload)
      try { if (typeof window !== 'undefined') localStorage.setItem('columns', JSON.stringify(filtered)) } catch {}
      return filtered
    },
  },
})

export const { setColumns, toggleColumn, addColumn, removeColumn } = columnsSlice.actions
export default columnsSlice.reducer
