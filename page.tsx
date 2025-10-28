"use client"

import React from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import TableManager from '../src/components/TableManager'

export default function Page() {
  return (
    <main>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom>
          Table Manager
        </Typography>
        <TableManager />
      </Container>
    </main>
  )
}
