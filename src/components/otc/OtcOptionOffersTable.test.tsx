import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { OtcOptionOffersTable } from '@/components/otc/OtcOptionOffersTable'
import { createMockOtcOptionOffer } from '@/__tests__/fixtures/otcOption-fixtures'

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('OtcOptionOffersTable', () => {
  it('renders the ticker in the Stock column when provided', () => {
    const offer = createMockOtcOptionOffer({ ticker: 'AAPL', stock_id: 42 })
    renderWithRouter(<OtcOptionOffersTable offers={[offer]} />)
    expect(screen.getByText('AAPL')).toBeInTheDocument()
    expect(screen.queryByText('#42')).not.toBeInTheDocument()
  })

  it('falls back to #stock_id when ticker is not present', () => {
    const offer = createMockOtcOptionOffer({ ticker: undefined, stock_id: 42 })
    renderWithRouter(<OtcOptionOffersTable offers={[offer]} />)
    expect(screen.getByText('#42')).toBeInTheDocument()
  })

  it('renders the status badge with the offer status', () => {
    const offer = createMockOtcOptionOffer({ status: 'open' })
    renderWithRouter(<OtcOptionOffersTable offers={[offer]} />)
    expect(screen.getByText(/open/i)).toBeInTheDocument()
  })

  it('renders an "open" status when an All-tab listing omits status', () => {
    // /otc/options returns entries without a `status` field — only open
    // listings appear in that view. Show "open" instead of an empty cell.
    const offer = createMockOtcOptionOffer({ status: undefined as unknown as 'open' })
    renderWithRouter(<OtcOptionOffersTable offers={[offer]} />)
    expect(screen.getByText(/open/i)).toBeInTheDocument()
  })

  it('renders the empty state when there are no offers', () => {
    renderWithRouter(<OtcOptionOffersTable offers={[]} />)
    expect(screen.getByText(/no offers/i)).toBeInTheDocument()
  })
})
