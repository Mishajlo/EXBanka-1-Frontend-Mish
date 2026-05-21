import { render, screen } from '@testing-library/react'
import { FundDetailsPanel } from '../components/FundDetailsPanel'
import type { Fund } from '@/types/fund'

jest.mock('@/hooks/useEmployee', () => ({
  useEmployee: () => ({ data: undefined }),
}))

// Build a fund with null RSD fields (backend can omit these)
const baseFund: Fund = {
  id: 1,
  name: 'Test Fund',
  description: 'A test fund',
  minimum_contribution_rsd: null,
  manager_employee_id: 5,
  rsd_account_id: 10,
  fund_value_rsd: null,
  liquid_cash_rsd: null,
  profit_rsd: null,
  active: true,
  created_at: '2025-01-01',
}

describe('FundDetailsPanel', () => {
  it('shows "— RSD" instead of "undefined RSD" when RSD fields are null', () => {
    render(<FundDetailsPanel fund={baseFund} />)
    expect(screen.queryByText(/undefined rsd/i)).not.toBeInTheDocument()
    expect(screen.getAllByText(/— rsd/i)).toHaveLength(4)
  })
})
