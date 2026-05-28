import { fireEvent, render, screen } from '@testing-library/react'
import { MyPriceAlertsTable } from '@/views/priceAlerts/components/MyPriceAlertsTable'
import { createMockPriceAlert } from '@/__tests__/fixtures/priceAlert-fixtures'

function setup(overrides: Partial<React.ComponentProps<typeof MyPriceAlertsTable>> = {}) {
  const defaults = {
    alerts: [createMockPriceAlert()],
    onPause: jest.fn(),
    onResume: jest.fn(),
    onDelete: jest.fn(),
    busyId: undefined,
  }
  const props = { ...defaults, ...overrides }
  render(<MyPriceAlertsTable {...props} />)
  return props
}

describe('MyPriceAlertsTable', () => {
  it('shows an empty-state message when there are no alerts', () => {
    setup({ alerts: [] })
    expect(screen.getByText(/no price alerts/i)).toBeInTheDocument()
  })

  it('renders one row per alert with condition + threshold + status', () => {
    setup({
      alerts: [
        createMockPriceAlert({ id: 1, condition: 'gte', threshold: '200.00', active: true }),
        createMockPriceAlert({ id: 2, condition: 'lte', threshold: '50.00', active: false }),
      ],
    })
    expect(screen.getByText(/≥ 200\.00/)).toBeInTheDocument()
    expect(screen.getByText(/≤ 50\.00/)).toBeInTheDocument()
    expect(screen.getByText(/active/i)).toBeInTheDocument()
    expect(screen.getByText(/paused/i)).toBeInTheDocument()
  })

  it('calls onPause when the Pause button is clicked for an active alert', () => {
    const onPause = jest.fn()
    setup({ alerts: [createMockPriceAlert({ id: 9, active: true })], onPause })
    fireEvent.click(screen.getByRole('button', { name: /pause/i }))
    expect(onPause).toHaveBeenCalledWith(9)
  })

  it('calls onResume when the Resume button is clicked for a paused alert', () => {
    const onResume = jest.fn()
    setup({ alerts: [createMockPriceAlert({ id: 7, active: false })], onResume })
    fireEvent.click(screen.getByRole('button', { name: /resume/i }))
    expect(onResume).toHaveBeenCalledWith(7)
  })

  it('calls onDelete when the Delete button is clicked', () => {
    const onDelete = jest.fn()
    setup({ alerts: [createMockPriceAlert({ id: 5 })], onDelete })
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    expect(onDelete).toHaveBeenCalledWith(5)
  })

  it('disables row action buttons when busyId matches the alert id', () => {
    setup({ alerts: [createMockPriceAlert({ id: 11 })], busyId: 11 })
    expect(screen.getByRole('button', { name: /pause/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /delete/i })).toBeDisabled()
  })
})
