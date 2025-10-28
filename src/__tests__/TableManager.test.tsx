import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import TableManager from '../components/TableManager'
import { Provider } from 'react-redux'
import { store } from '../store'

describe('TableManager', () => {
  test('renders and searches', () => {
    render(
      <Provider store={store}>
        <TableManager />
      </Provider>
    )

    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()

  const input = screen.getByPlaceholderText(/search/i) as HTMLInputElement
  fireEvent.change(input, { target: { value: 'Alice' } })
  expect(input).toHaveValue('Alice')
  })
})
