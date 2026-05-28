import { fireEvent, screen } from '@testing-library/react'
import { renderWithProviders } from '@/__tests__/utils/test-utils'
import { CreatePriceAlertDialog } from '@/views/priceAlerts/components/CreatePriceAlertDialog'

jest.mock('@/components/ui/select', () => jest.requireActual('@/__tests__/mocks/select-mock'))

const listing = { listing_id: 42, ticker: 'AAPL', name: 'Apple Inc.' }

function setup(overrides: Partial<React.ComponentProps<typeof CreatePriceAlertDialog>> = {}) {
  const defaults = {
    open: true,
    onOpenChange: jest.fn(),
    listing,
    onSubmit: jest.fn(),
    loading: false,
  }
  const props = { ...defaults, ...overrides }
  renderWithProviders(<CreatePriceAlertDialog {...props} />)
  return props
}

describe('CreatePriceAlertDialog', () => {
  it('renders the listing ticker and name in the title', () => {
    setup()
    expect(screen.getByText(/AAPL/)).toBeInTheDocument()
    expect(screen.getByText(/Apple Inc\./)).toBeInTheDocument()
  })

  it('disables submit when threshold is empty', () => {
    setup()
    expect(screen.getByRole('button', { name: /create alert/i })).toBeDisabled()
  })

  it('disables submit when threshold is not a positive decimal', () => {
    setup()
    fireEvent.change(screen.getByLabelText(/threshold/i), { target: { value: 'abc' } })
    expect(screen.getByRole('button', { name: /create alert/i })).toBeDisabled()
  })

  it('submits with condition + threshold + is_recurring=false (single-shot) by default', () => {
    const onSubmit = jest.fn()
    setup({ onSubmit })
    fireEvent.change(screen.getByLabelText(/threshold/i), { target: { value: '199.99' } })
    fireEvent.click(screen.getByRole('button', { name: /create alert/i }))
    expect(onSubmit).toHaveBeenCalledWith({
      listing_id: 42,
      condition: 'gte',
      threshold: '199.99',
      is_recurring: false,
    })
  })

  it('includes cooldown_seconds when is_recurring is enabled', () => {
    const onSubmit = jest.fn()
    setup({ onSubmit })
    fireEvent.change(screen.getByLabelText(/threshold/i), { target: { value: '50' } })
    fireEvent.click(screen.getByLabelText(/recurring/i))
    fireEvent.click(screen.getByRole('button', { name: /create alert/i }))
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        listing_id: 42,
        threshold: '50',
        is_recurring: true,
        cooldown_seconds: expect.any(Number),
      })
    )
  })

  it('calls onOpenChange(false) when Cancel is clicked', () => {
    const onOpenChange = jest.fn()
    setup({ onOpenChange })
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
