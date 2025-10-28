"use client"

import React, { useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import TablePagination from '@mui/material/TablePagination'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Input from '@mui/material/Input'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import ManageColumnsModal from './ManageColumnsModal'
import Papa from 'papaparse'
import { saveAs } from 'file-saver'
import { setRows } from '../store/slices/dataSlice'
import { Column, setColumns } from '../store/slices/columnsSlice'

export default function TableManager() {
  const rows = useSelector((s: RootState) => s.data)
  const columns = useSelector((s: RootState) => s.columns)
  const dispatch = useDispatch()

  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage] = useState(10)
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('asc')
  const [openCols, setOpenCols] = useState(false)
  const [editing, setEditing] = useState<Record<string, any> | null>(null)
  const [pendingChanges, setPendingChanges] = useState<Record<string, any>>({})
  const [confirmDelete, setConfirmDelete] = useState<{open: boolean; id?: string}>({ open: false })

  // drag-and-drop state and validation errors
  const [dragFrom, setDragFrom] = useState<number | null>(null)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({})


  const visibleCols = columns.filter((c: Column) => c.visible)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const out = rows.filter((r: any) => {
      if (!q) return true
      return Object.values(r).some((v: any) => String(v).toLowerCase().includes(q))
    })
    let sorted = out
    if (sortKey) {
      sorted = out.slice().sort((a: any, b: any) => {
        const va = a[sortKey]
        const vb = b[sortKey]
        if (va == null) return 1
        if (vb == null) return -1
        if (va === vb) return 0
        if (sortDir === 'asc') return va > vb ? 1 : -1
        return va > vb ? -1 : 1
      })
    }
    return sorted
  }, [rows, query, sortKey, sortDir])

  const pageRows = filtered.slice(page * rowsPerPage, (page + 1) * rowsPerPage)

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<Record<string, string>>) => {
        const data = results.data as Record<string, string>[]
        // Map to Row shape with id
        const mapped = data.map((r, i) => ({ id: String(Date.now() + i), ...r }))
        dispatch(setRows(mapped as any))
      },
      error: (err: Error) => {
        alert('CSV parse error: ' + err.message)
      }
    })
  }

  function handleExport() {
    const onlyVisible = visibleCols.map((c: Column) => c.key)
    const data = filtered.map((r: any) => {
      const out: Record<string, unknown> = {}
      onlyVisible.forEach((k: string) => { out[k] = r[k] })
      return out
    })
    const csv = Papa.unparse(data)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, 'export.csv')
  }

  function startEdit(row: any) {
    setEditing(row)
    setPendingChanges({ ...row })
  }

  function applySaveAll() {
    // map pending changes to rows and dispatch setRows
    const merged = rows.map(r => (pendingChanges.id === r.id ? { ...r, ...pendingChanges } : r))
    dispatch(setRows(merged as any))
    setEditing(null)
    setPendingChanges({})
  }

  function cancelAll() {
    setEditing(null)
    setPendingChanges({})
  }

  function confirmDeleteRow(id?: string) {
    setConfirmDelete({ open: true, id })
  }

  function doDelete() {
    if (confirmDelete.id) dispatch(setRows(rows.filter(r => r.id !== confirmDelete.id) as any))
    setConfirmDelete({ open: false })
  }

  // column drag handlers
  function onDragStart(e: React.DragEvent, idx: number) {
    setDragFrom(idx)
    e.dataTransfer.effectAllowed = 'move'
  }

  function onDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault()
    setDragOverIdx(idx)
  }

  function onDropColumn(e: React.DragEvent, toIdx: number) {
    e.preventDefault()
    if (dragFrom == null) return
    const cols = [...columns]
    const [moved] = cols.splice(dragFrom, 1)
    cols.splice(toIdx, 0, moved)
    try { localStorage.setItem('columns', JSON.stringify(cols)) } catch {}
    // dispatch action to update columns in the store
    dispatch(setColumns(cols as any))
    setDragFrom(null)
    setDragOverIdx(null)
  }


  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
        <TextField size="small" placeholder="Search..." value={query} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)} sx={{ mr: 1 }} />
        <Button variant="outlined" onClick={() => setOpenCols(true)}>Manage Columns</Button>
        <label>
          <Input type="file" inputProps={{ accept: '.csv' }} onChange={handleImport} />
        </label>
        <Button variant="contained" onClick={handleExport}>Export CSV</Button>

        <Box sx={{ flexGrow: 1 }} />

        <Button startIcon={<SaveIcon />} color="primary" variant="contained" onClick={applySaveAll} disabled={!editing}>Save All</Button>
        <Button startIcon={<CancelIcon />} sx={{ ml: 1 }} onClick={cancelAll} disabled={!editing}>Cancel All</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {visibleCols.map((col: Column, idx: number) => (
                <TableCell key={col.key} draggable onDragStart={(e) => onDragStart(e, idx)} onDragOver={(e) => onDragOver(e, idx)} onDrop={(e) => onDropColumn(e, idx)} onClick={() => {
                  if (sortKey === col.key) setSortDir((d: 'asc'|'desc') => d === 'asc' ? 'desc' : 'asc')
                  else { setSortKey(col.key); setSortDir('asc') }
                }} sx={{ cursor: 'pointer' }}>{col.label}</TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pageRows.map((row: any) => (
              <TableRow key={row.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                {visibleCols.map((col: Column) => (
                  <TableCell key={col.key} onDoubleClick={() => startEdit(row)}>
                      {editing && editing.id === row.id ? (
                        <div>
                          <TextField size="small" value={String(pendingChanges[col.key] ?? '')} onChange={(e) => setPendingChanges(prev => ({ ...prev, [col.key]: e.target.value }))} />
                          {errors[editing.id] && errors[editing.id][col.key] && (
                            <div style={{ color: 'var(--mui-error)', fontSize: 12 }}>{errors[editing.id][col.key]}</div>
                          )}
                        </div>
                      ) : (
                        String(row[col.key] ?? '')
                      )}
                  </TableCell>
                ))}
                <TableCell>
                  <IconButton size="small" onClick={() => startEdit(row)} aria-label="edit"><EditIcon /></IconButton>
                  <IconButton size="small" onClick={() => confirmDeleteRow(row.id)} color="error" aria-label="delete"><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination component="div" count={filtered.length} page={page} onPageChange={(_e: unknown, p: number) => setPage(p)} rowsPerPage={rowsPerPage} rowsPerPageOptions={[10]} />

      <ManageColumnsModal open={openCols} onClose={() => setOpenCols(false)} />

      <Dialog open={confirmDelete.open} onClose={() => setConfirmDelete({ open: false })}>
        <DialogTitle>Confirm delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this row?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete({ open: false })}>Cancel</Button>
          <Button onClick={doDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
