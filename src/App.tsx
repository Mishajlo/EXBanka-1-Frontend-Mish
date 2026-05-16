import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute } from '@/components/shared/ProtectedRoute'
import { LoginPage } from '@/pages/LoginPage'
import { PasswordResetRequestPage } from '@/pages/PasswordResetRequestPage'
import { PasswordResetPage } from '@/pages/PasswordResetPage'
import { ActivationPage } from '@/pages/ActivationPage'
import { EmployeeListPage } from '@/pages/EmployeeListPage'
import { CreateEmployeePage } from '@/pages/CreateEmployeePage'
import { EditEmployeePage } from '@/pages/EditEmployeePage'
import { HomePage } from '@/pages/HomePage'
import { AccountListPage } from '@/pages/AccountListPage'
import { AccountDetailsPage } from '@/pages/AccountDetailsPage'
import { CreateAccountPage } from '@/pages/CreateAccountPage'
import { CardListPage } from '@/pages/CardListPage'
import { CardRequestPage } from '@/pages/CardRequestPage'
import { ExchangeRatesView } from '@/views/exchangeRates'
import { ExchangeCalculatorPage } from '@/pages/ExchangeCalculatorPage'
import { CreateTransferView, TransferHistoryView } from '@/views/transfers'
import { InternalTransferView, NewPaymentView, PaymentHistoryView } from '@/views/payments'
import { PaymentRecipientsView } from '@/views/paymentRecipients'
import { LoanListPage } from '@/pages/LoanListPage'
import { LoanDetailsPage } from '@/pages/LoanDetailsPage'
import { LoanApplicationPage } from '@/pages/LoanApplicationPage'
import { AdminAccountsPage } from '@/pages/AdminAccountsPage'
import { AdminAccountCardsPage } from '@/pages/AdminAccountCardsPage'
import { AdminClientsPage } from '@/pages/AdminClientsPage'
import { EditClientPage } from '@/pages/EditClientPage'
import { AdminLoanRequestsPage } from '@/pages/AdminLoanRequestsPage'
import { AdminCardRequestsPage } from '@/pages/AdminCardRequestsPage'
import { AdminLoansPage } from '@/pages/AdminLoansPage'
import { CreateClientPage } from '@/pages/CreateClientPage'
import { ActuaryListPage } from '@/pages/ActuaryListPage'
import { StockExchangesView } from '@/views/stockExchanges'
import {
  ForexDetailView,
  FuturesDetailView,
  OptionDetailView,
  SecuritiesView,
  StockDetailView,
} from '@/views/securities'
import { AdminOrdersView, CreateOrderView, MyOrdersView } from '@/views/orders'
import { PortfolioPage } from '@/pages/PortfolioPage'
import { HoldingTransactionsPage } from '@/pages/HoldingTransactionsPage'
import { AccountActivityPage } from '@/pages/AccountActivityPage'
import { TaxView } from '@/views/tax'
import { AdminRolesPage } from '@/pages/AdminRolesPage'
import { AdminEmployeeLimitsPage } from '@/pages/AdminEmployeeLimitsPage'
import { AdminClientLimitsPage } from '@/pages/AdminClientLimitsPage'
import { AdminInterestRatesPage } from '@/pages/AdminInterestRatesPage'
import { AdminFeesView } from '@/views/adminFees'
import { PeerBanksView } from '@/views/peerBanks'
import { OtcPortalView } from '@/views/otcPortal'
import { BankFundPositionsView, CreateFundView, FundDetailsView, FundsView } from '@/views/funds'
import { ActuaryPerformancePage } from '@/pages/ActuaryPerformancePage'
import { OtcContractDetailView, OtcContractsView } from '@/views/otcContracts'
import { OtcOptionsView } from '@/views/otcOptions'
import { NotificationTemplatesView } from '@/views/notificationTemplates'
import { SettingsView } from '@/views/settings'
import { BankAccountActivityPage } from '@/pages/BankAccountActivityPage'

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/password-reset-request" element={<PasswordResetRequestPage />} />
        <Route path="/password-reset" element={<PasswordResetPage />} />
        <Route path="/password-reset/:token" element={<PasswordResetPage />} />
        {/* Aliases — backend email template uses /reset-password?token=... */}
        <Route path="/reset-password" element={<PasswordResetPage />} />
        <Route path="/reset-password/:token" element={<PasswordResetPage />} />
        <Route path="/activate" element={<ActivationPage />} />
      </Route>

      {/* Protected routes */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* Employee routes */}
        <Route
          path="/employees"
          element={
            <ProtectedRoute requireAdmin>
              <EmployeeListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees/new"
          element={
            <ProtectedRoute requireAdmin>
              <CreateEmployeePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees/:id"
          element={
            <ProtectedRoute requireAdmin>
              <EditEmployeePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/accounts/new"
          element={
            <ProtectedRoute requiredRole="Employee">
              <CreateAccountPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/accounts"
          element={
            <ProtectedRoute requiredRole="Employee">
              <AdminAccountsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/accounts/:id/cards"
          element={
            <ProtectedRoute requiredRole="Employee">
              <AdminAccountCardsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bank-accounts/:id/activity"
          element={
            <ProtectedRoute requiredPermission="bank-accounts.manage">
              <BankAccountActivityPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/clients"
          element={
            <ProtectedRoute requiredRole="Employee">
              <AdminClientsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/clients/:id"
          element={
            <ProtectedRoute requiredRole="Employee">
              <EditClientPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/clients/new"
          element={
            <ProtectedRoute requiredRole="Employee">
              <CreateClientPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/loans/requests"
          element={
            <ProtectedRoute requiredRole="Employee">
              <AdminLoanRequestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/cards/requests"
          element={
            <ProtectedRoute requiredRole="Employee">
              <AdminCardRequestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/loans"
          element={
            <ProtectedRoute requiredRole="Employee">
              <AdminLoansPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/actuaries"
          element={
            <ProtectedRoute requireSupervisorOrAdmin>
              <ActuaryListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/stock-exchanges"
          element={
            <ProtectedRoute requiredRole="Employee">
              <StockExchangesView />
            </ProtectedRoute>
          }
        />

        {/* Client routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute requiredRole="Client">
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/accounts"
          element={
            <ProtectedRoute requiredRole="Client">
              <AccountListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/accounts/:id"
          element={
            <ProtectedRoute requiredRole="Client">
              <AccountDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/accounts/:id/activity" element={<AccountActivityPage />} />
        <Route
          path="/cards"
          element={
            <ProtectedRoute requiredRole="Client">
              <CardListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cards/request"
          element={
            <ProtectedRoute requiredRole="Client">
              <CardRequestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exchange/rates"
          element={
            <ProtectedRoute requiredRole="Client">
              <ExchangeRatesView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exchange/calculator"
          element={
            <ProtectedRoute requiredRole="Client">
              <ExchangeCalculatorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transfers/new"
          element={
            <ProtectedRoute requiredRole="Client">
              <CreateTransferView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transfers/history"
          element={
            <ProtectedRoute requiredRole="Client">
              <TransferHistoryView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payments/new"
          element={
            <ProtectedRoute requiredRole="Client">
              <NewPaymentView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payments/transfer"
          element={
            <ProtectedRoute requiredRole="Client">
              <InternalTransferView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payments/history"
          element={
            <ProtectedRoute requiredRole="Client">
              <PaymentHistoryView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payments/recipients"
          element={
            <ProtectedRoute requiredRole="Client">
              <PaymentRecipientsView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/loans"
          element={
            <ProtectedRoute requiredRole="Client">
              <LoanListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/loans/apply"
          element={
            <ProtectedRoute requiredRole="Client">
              <LoanApplicationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/loans/:id"
          element={
            <ProtectedRoute requiredRole="Client">
              <LoanDetailsPage />
            </ProtectedRoute>
          }
        />

        {/* Shared trading routes (any authenticated user) */}
        <Route path="/securities" element={<SecuritiesView />} />
        <Route path="/securities/stocks/:id" element={<StockDetailView />} />
        <Route path="/securities/futures/:id" element={<FuturesDetailView />} />
        <Route path="/securities/forex/:id" element={<ForexDetailView />} />
        <Route path="/securities/options/:id" element={<OptionDetailView />} />
        <Route path="/securities/order/new" element={<CreateOrderView />} />
        <Route path="/orders" element={<MyOrdersView />} />
        <Route path="/otc" element={<OtcPortalView />} />
        <Route path="/otc/options" element={<OtcOptionsView />} />
        <Route path="/otc/contracts" element={<OtcContractsView />} />
        <Route path="/otc/contracts/:id" element={<OtcContractDetailView />} />
        <Route path="/funds" element={<FundsView />} />
        <Route
          path="/funds/new"
          element={
            <ProtectedRoute requiredPermission="funds.manage">
              <CreateFundView />
            </ProtectedRoute>
          }
        />
        <Route path="/funds/:id" element={<FundDetailsView />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/portfolio/holdings/:id/transactions" element={<HoldingTransactionsPage />} />

        {/* Admin trading routes */}
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute requireSupervisorOrAdmin>
              <AdminOrdersView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/tax"
          element={
            <ProtectedRoute requireAdmin>
              <TaxView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profit/actuaries"
          element={
            <ProtectedRoute requiredPermission="actuaries.read.all">
              <ActuaryPerformancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profit/funds"
          element={
            <ProtectedRoute requiredPermission="funds.bank-position-read">
              <BankFundPositionsView />
            </ProtectedRoute>
          }
        />

        {/* Admin settings — consolidated under one /admin/settings hub */}
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute requireAdmin>
              <SettingsView />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="notifications" replace />} />
          <Route
            path="notifications"
            element={
              <ProtectedRoute requiredPermission="notifications.templates.manage">
                <NotificationTemplatesView />
              </ProtectedRoute>
            }
          />
          <Route path="fees" element={<AdminFeesView />} />
          <Route path="peer-banks" element={<PeerBanksView />} />
          <Route path="roles" element={<AdminRolesPage />} />
          <Route path="interest-rates" element={<AdminInterestRatesPage />} />
          <Route path="employee-limits" element={<AdminEmployeeLimitsPage />} />
          <Route path="client-limits" element={<AdminClientLimitsPage />} />
        </Route>

        {/* Legacy settings routes — redirect to the consolidated hub so
            existing links and bookmarks keep working. */}
        <Route path="/admin/roles" element={<Navigate to="/admin/settings/roles" replace />} />
        <Route
          path="/admin/limits/employees"
          element={<Navigate to="/admin/settings/employee-limits" replace />}
        />
        <Route
          path="/admin/limits/clients"
          element={<Navigate to="/admin/settings/client-limits" replace />}
        />
        <Route
          path="/admin/interest-rates"
          element={<Navigate to="/admin/settings/interest-rates" replace />}
        />
        <Route path="/admin/fees" element={<Navigate to="/admin/settings/fees" replace />} />
        <Route
          path="/admin/peer-banks"
          element={<Navigate to="/admin/settings/peer-banks" replace />}
        />
        <Route
          path="/admin/notification-templates"
          element={<Navigate to="/admin/settings/notifications" replace />}
        />
      </Route>

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
