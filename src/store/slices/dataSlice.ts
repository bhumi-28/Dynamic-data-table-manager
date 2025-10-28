import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Row = {
  id: string
  name?: string
  email?: string
  age?: number
  role?: string
  [key: string]: unknown
}

const initialState: Row[] = [
  { id: '1', name: 'Alice', email: 'alice@example.com', age: 28, role: 'Engineer', department: 'R&D', location: 'New York' },
  { id: '2', name: 'Bob', email: 'bob@example.com', age: 34, role: 'Manager', department: 'Sales', location: 'London' },
  { id: '3', name: 'Carol', email: 'carol@example.com', age: 25, role: 'Designer', department: 'Design', location: 'Berlin' },
  { id: '4', name: 'Dan', email: 'dan@example.com', age: 30, role: 'Engineer', department: 'R&D', location: 'San Francisco' },
  { id: '5', name: 'Eve', email: 'eve@example.com', age: 29, role: 'QA', department: 'Engineering', location: 'Toronto' },
  { id: '6', name: 'Frank', email: 'frank@example.com', age: 41, role: 'Director', department: 'Operations', location: 'Sydney' },
  { id: '7', name: 'Grace', email: 'grace@example.com', age: 23, role: 'Intern', department: 'Marketing', location: 'Dublin' },
  { id: '8', name: 'Heidi', email: 'heidi@example.com', age: 36, role: 'PM', department: 'Product', location: 'Amsterdam' },
  { id: '9', name: 'Ivan', email: 'ivan@example.com', age: 32, role: 'Engineer', department: 'R&D', location: 'Moscow' },
  { id: '10', name: 'Judy', email: 'judy@example.com', age: 27, role: 'Analyst', department: 'Finance', location: 'Paris' },
  { id: '11', name: 'Karl', email: 'karl@example.com', age: 45, role: 'CEO', department: 'Executive', location: 'New York' },
  { id: '12', name: 'Lara', email: 'lara@example.com', age: 31, role: 'Engineer', department: 'R&D', location: 'Bangalore' },
  { id: '13', name: 'Mallory', email: 'mallory@example.com', age: 38, role: 'Security', department: 'Security', location: 'Tel Aviv' },
  { id: '14', name: 'Niaj', email: 'niaj@example.com', age: 26, role: 'Support', department: 'Support', location: 'Austin' },
  { id: '15', name: 'Olivia', email: 'olivia@example.com', age: 33, role: 'HR', department: 'HR', location: 'Chicago' },
]

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setRows: (_state: Row[], action: PayloadAction<Row[]>) => action.payload,
    addRow: (state: Row[], action: PayloadAction<Row>) => {
      state.push(action.payload)
    },
    updateRow: (state: Row[], action: PayloadAction<Row>) => {
      const idx = state.findIndex((r: Row) => r.id === action.payload.id)
      if (idx >= 0) state[idx] = action.payload
    },
    deleteRow: (state: Row[], action: PayloadAction<string>) => {
      return state.filter((r: Row) => r.id !== action.payload)
    },
  },
})

export const { setRows, addRow, updateRow, deleteRow } = dataSlice.actions
export default dataSlice.reducer
