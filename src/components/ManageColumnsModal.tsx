"use client"

import React, { useState } from 'react'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import { toggleColumn, addColumn, removeColumn } from '../store/slices/columnsSlice'

export default function ManageColumnsModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  const columns = useSelector((s: RootState) => s.columns)
  const dispatch = useDispatch()
  const [newKey, setNewKey] = useState('')
  const [newLabel, setNewLabel] = useState('')
  const [confirm, setConfirm] = useState<{open: boolean; key?: string}>({ open: false })

  function handleAdd() {
    if (!newKey || !newLabel) return
    dispatch(addColumn({ key: newKey, label: newLabel, visible: true }))
    setNewKey('')
    setNewLabel('')
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ p: 3, bgcolor: 'background.paper', width: 400, margin: '40px auto' }}>
        <Typography variant="h6">Manage Columns</Typography>
        <FormGroup>
          {columns.map((c: any) => (
            <Box key={c.key} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormControlLabel control={<Checkbox checked={c.visible} onChange={() => dispatch(toggleColumn(c.key))} />} label={c.label} />
              <IconButton size="small" color="error" onClick={() => setConfirm({ open: true, key: c.key })}><DeleteIcon /></IconButton>
            </Box>
          ))}
        </FormGroup>

        <Box sx={{ mt: 2 }}>
          <TextField placeholder="Key" value={newKey} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewKey(e.target.value)} />
          <TextField placeholder="Label" value={newLabel} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewLabel(e.target.value)} sx={{ ml: 1 }} />
          <Button onClick={handleAdd} sx={{ ml: 1 }}>Add</Button>
        </Box>

        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Button onClick={onClose}>Close</Button>
        </Box>
      
      <Dialog open={confirm.open} onClose={() => setConfirm({ open: false })}>
        <DialogTitle>Remove column?</DialogTitle>
        <DialogContent>Are you sure you want to remove this column? This cannot be undone.</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirm({ open: false })}>Cancel</Button>
          <Button color="error" onClick={() => { if(confirm.key) dispatch(removeColumn(confirm.key)); setConfirm({ open: false }) }}>Remove</Button>
        </DialogActions>
      </Dialog>
      </Box>
    </Modal>
  )
}
