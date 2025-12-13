import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from '../App'

test('renders navbar', () => {
  render(<App />)
  // Navbar includes an element with site name or link
  const nav = screen.getByRole('navigation')
  expect(nav).toBeInTheDocument()
})
