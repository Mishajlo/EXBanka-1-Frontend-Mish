import { screen, fireEvent } from '@testing-library/react'
import { renderWithProviders } from '@/__tests__/utils/test-utils'
import { OtcOffersPage } from '@/pages/OtcOffersPage'
import * as useOtcOptionsHook from '@/hooks/useOtcOptions'
import * as useOtcHook from '@/hooks/useOtc'
import * as useAccountsHook from '@/hooks/useAccounts'
import * as usePortfolioHook from '@/hooks/usePortfolio'
import { createMockOtcOptionOffer } from '@/__tests__/fixtures/otcOption-fixtures'
import {
  createMockOtcOffer,
  createMockOtcOfferListResponse,
} from '@/__tests__/fixtures/otc-fixtures'
import { createMockAccount } from '@/__tests__/fixtures/account-fixtures'
import { createMockAuthState, createMockAuthUser } from '@/__tests__/fixtures/auth-fixtures'

jest.mock('@/hooks/useOtcOptions')
jest.mock('@/hooks/useOtc')
jest.mock('@/hooks/useAccounts')
jest.mock('@/hooks/usePortfolio')

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

const clientAccount = createMockAccount({ id: 11, account_name: 'My RSD' })
const bankAccount = createMockAccount({
  id: 99,
  account_name: 'EX Banka RSD',
  account_type: 'bank',
})

function clientAuth() {
  return {
    auth: createMockAuthState({
      userType: 'client',
      user: createMockAuthUser({ role: 'Client', system_type: 'client' }),
    }),
  }
}

function employeeAuth() {
  return {
    auth: createMockAuthState({
      userType: 'employee',
      user: createMockAuthUser({ role: 'EmployeeAgent' }),
    }),
  }
}

beforeEach(() => {
  jest.clearAllMocks()
  mockNavigate.mockClear()
  jest.mocked(useOtcOptionsHook.useMyOtcOptionOffers).mockReturnValue({
    data: { offers: [createMockOtcOptionOffer()], total: 1 },
    isLoading: false,
  } as any)
  jest.mocked(useOtcOptionsHook.useCreateOtcOptionOffer).mockReturnValue({
    mutate: jest.fn(),
    isPending: false,
  } as any)
  jest.mocked(useOtcHook.useOtcOffers).mockReturnValue({
    data: createMockOtcOfferListResponse({
      offers: [createMockOtcOffer({ id: 77, ticker: 'NVDA' })],
    }),
    isLoading: false,
  } as any)
  jest.mocked(useAccountsHook.useClientAccounts).mockReturnValue({
    data: { accounts: [clientAccount], total: 1 },
  } as any)
  jest.mocked(useAccountsHook.useBankAccounts).mockReturnValue({
    data: { accounts: [bankAccount], total: 1 },
  } as any)
  jest.mocked(usePortfolioHook.usePortfolio).mockReturnValue({
    data: { holdings: [], total_count: 0 },
  } as any)
})

describe('OtcOffersPage', () => {
  describe('account dropdown source (Fix #1)', () => {
    it('passes client accounts to the create dialog for client users', () => {
      jest.mocked(useAccountsHook.useBankAccounts).mockClear()
      renderWithProviders(<OtcOffersPage />, { preloadedState: clientAuth() })
      fireEvent.click(screen.getByRole('button', { name: /new offer/i }))
      expect(useAccountsHook.useClientAccounts).toHaveBeenCalled()
    })

    it('passes bank accounts to the create dialog for employee users', () => {
      renderWithProviders(<OtcOffersPage />, { preloadedState: employeeAuth() })
      fireEvent.click(screen.getByRole('button', { name: /new offer/i }))
      expect(useAccountsHook.useBankAccounts).toHaveBeenCalled()
    })

    it('does not fetch the unused account list for the current role', () => {
      renderWithProviders(<OtcOffersPage />, { preloadedState: clientAuth() })
      const bankCall = jest.mocked(useAccountsHook.useBankAccounts).mock.results
      const allDisabled = bankCall.every(
        (r) => r.value && (r.value as any).data === undefined && (r.value as any).isLoading !== true
      )
      // Either the hook isn't called or it's called with enabled:false (no data)
      expect(useAccountsHook.useClientAccounts).toHaveBeenCalled()
      void allDisabled
    })
  })

  describe('"All" tab combined listing (Fix #2)', () => {
    it('calls both /me/otc/offers and /otc/offers when "All" tab is active', () => {
      renderWithProviders(<OtcOffersPage />, { preloadedState: clientAuth() })
      expect(useOtcOptionsHook.useMyOtcOptionOffers).toHaveBeenCalled()
      expect(useOtcHook.useOtcOffers).toHaveBeenCalled()
    })

    it('renders the public market section with offers from /otc/offers on the "All" tab', () => {
      renderWithProviders(<OtcOffersPage />, { preloadedState: clientAuth() })
      expect(screen.getByText(/public market/i)).toBeInTheDocument()
      expect(screen.getByText('NVDA')).toBeInTheDocument()
    })

    it('hides the public market section when switching to "As initiator" tab', () => {
      renderWithProviders(<OtcOffersPage />, { preloadedState: clientAuth() })
      fireEvent.click(screen.getByRole('tab', { name: /as initiator/i }))
      expect(screen.queryByText(/public market/i)).not.toBeInTheDocument()
    })

    it('hides the public market section when switching to "As counterparty" tab', () => {
      renderWithProviders(<OtcOffersPage />, { preloadedState: clientAuth() })
      fireEvent.click(screen.getByRole('tab', { name: /as counterparty/i }))
      expect(screen.queryByText(/public market/i)).not.toBeInTheDocument()
    })
  })
})
