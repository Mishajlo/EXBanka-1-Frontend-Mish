/**
 * Routing guard test for /admin/bank-accounts/:id/activity
 * Bug #22: Supervisors and Agents must be able to view bank account activity.
 * The route must use requiredRole="Employee", not requiredPermission="bank-accounts.manage".
 */
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/__tests__/utils/test-utils'
import { ProtectedRoute } from '@/components/shared/ProtectedRoute'
import { BankAccountActivityView } from '@/views/accounts/BankAccountActivityView'
import * as useAccountsHook from '@/hooks/useAccounts'

jest.mock('@/hooks/useAccounts')

const supervisorAuthState = {
  auth: {
    user: {
      id: 2,
      email: 'supervisor@test.com',
      role: 'EmployeeSupervisor',
      permissions: [] as string[],
      system_type: 'employee' as const,
    },
    userType: 'employee' as const,
    accessToken: 'mock-token',
    refreshToken: 'mock-refresh',
    status: 'authenticated' as const,
    error: null,
  },
}

beforeEach(() => {
  jest.clearAllMocks()
  jest.mocked(useAccountsHook.useBankAccountActivity).mockReturnValue({
    data: { entries: [], total_count: 0 },
    isLoading: false,
  } as any)
})

describe('BankAccountActivityRoute — access control', () => {
  it('supervisor can access /admin/bank-accounts/:id/activity with requiredRole="Employee"', () => {
    renderWithProviders(
      <ProtectedRoute requiredRole="Employee">
        <BankAccountActivityView />
      </ProtectedRoute>,
      {
        preloadedState: supervisorAuthState,
        route: '/admin/bank-accounts/1/activity',
        routePath: '/admin/bank-accounts/:id/activity',
      }
    )
    expect(screen.getByText(/bank account activity/i)).toBeInTheDocument()
  })

  it('supervisor is redirected from /admin/bank-accounts/:id/activity when guarded by requiredPermission="bank-accounts.manage"', () => {
    renderWithProviders(
      <ProtectedRoute requiredPermission="bank-accounts.manage">
        <BankAccountActivityView />
      </ProtectedRoute>,
      {
        preloadedState: supervisorAuthState,
        route: '/admin/bank-accounts/1/activity',
        routePath: '/admin/bank-accounts/:id/activity',
      }
    )
    // Supervisor lacks bank-accounts.manage — view should NOT be rendered
    expect(screen.queryByText(/bank account activity/i)).not.toBeInTheDocument()
  })
})
