/**
 * Routing guard test for /admin/bank-accounts/:id/activity
 * Bug #22 follow-up: The backend endpoint GET /api/v3/bank-accounts/:id/activity
 * requires the `bank-accounts.manage` permission (only EmployeeAdmin has it).
 * The route guard must use requiredPermission="bank-accounts.manage" so that
 * the frontend mirrors the backend's access rules instead of letting
 * non-admin employees through to a 403 page.
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

const adminAuthState = {
  auth: {
    user: {
      id: 1,
      email: 'admin@test.com',
      role: 'EmployeeAdmin',
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
  it('admin can access /admin/bank-accounts/:id/activity when guarded by requiredPermission="bank-accounts.manage"', () => {
    renderWithProviders(
      <ProtectedRoute requiredPermission="bank-accounts.manage">
        <BankAccountActivityView />
      </ProtectedRoute>,
      {
        preloadedState: adminAuthState,
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
