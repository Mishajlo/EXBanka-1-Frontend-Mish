import type { OptionContract } from '@/types/otcOption'

export function createMockOptionContract(overrides: Partial<OptionContract> = {}): OptionContract {
  return {
    id: 5001,
    status: 'ACTIVE',
    stock_id: 42,
    quantity: '100',
    strike_price: '5000.00',
    premium: '50000.00',
    settlement_date: '2026-06-05',
    buyer: { owner_type: 'client', owner_id: 7 },
    seller: { owner_type: 'client', owner_id: 8 },
    ...overrides,
  }
}
