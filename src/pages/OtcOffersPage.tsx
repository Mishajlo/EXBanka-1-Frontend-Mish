import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useMyOtcOptionOffers, useCreateOtcOptionOffer } from '@/hooks/useOtcOptions'
import { useOtcOffers } from '@/hooks/useOtc'
import { useClientAccounts, useBankAccounts } from '@/hooks/useAccounts'
import { usePortfolio } from '@/hooks/usePortfolio'
import { useAppSelector } from '@/hooks/useAppSelector'
import { selectUserType } from '@/store/selectors/authSelectors'
import { useNavigate } from 'react-router-dom'
import { OtcOptionOffersTable } from '@/components/otc/OtcOptionOffersTable'
import { OtcOffersTable } from '@/components/otc/OtcOffersTable'
import { CreateOptionOfferDialog } from '@/components/otc/CreateOptionOfferDialog'
import { notifySuccess } from '@/lib/errors'
import type { MyOffersFilters } from '@/types/otcOption'

export function OtcOffersPage() {
  const navigate = useNavigate()
  const userType = useAppSelector(selectUserType)
  const isEmployee = userType === 'employee'

  const [role, setRole] = useState<MyOffersFilters['role']>('either')
  const [createOpen, setCreateOpen] = useState(false)

  const { data, isLoading } = useMyOtcOptionOffers({ role })
  const offers = data?.offers ?? []

  // Public market is only shown / fetched on the "All" tab.
  const isAllTab = role === 'either'
  const { data: marketData } = useOtcOffers(undefined, { enabled: isAllTab })
  const marketOffers = marketData?.offers ?? []

  const { data: portfolioData } = usePortfolio()
  const holdings = portfolioData?.holdings ?? []

  // Employees pick from bank-owned accounts; clients pick from their own.
  const { data: clientAccountsData } = useClientAccounts(!isEmployee)
  const { data: bankAccountsData } = useBankAccounts(isEmployee)
  const accounts = (isEmployee ? bankAccountsData?.accounts : clientAccountsData?.accounts) ?? []

  const createMutation = useCreateOtcOptionOffer()

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">OTC Option Offers</h1>
        <Button onClick={() => setCreateOpen(true)}>New offer</Button>
      </div>

      <Tabs value={role} onValueChange={(v) => v && setRole(v as MyOffersFilters['role'])}>
        <TabsList>
          <TabsTrigger value="either">All</TabsTrigger>
          <TabsTrigger value="initiator">As initiator</TabsTrigger>
          <TabsTrigger value="counterparty">As counterparty</TabsTrigger>
        </TabsList>
        <TabsContent value={role ?? 'either'} className="mt-3 space-y-6">
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-md" />
              ))}
            </div>
          ) : (
            <OtcOptionOffersTable offers={offers} />
          )}

          {isAllTab && (
            <section>
              <h2 className="text-lg font-semibold mb-2">Public market</h2>
              <OtcOffersTable offers={marketOffers} onBuy={() => navigate('/otc')} />
            </section>
          )}
        </TabsContent>
      </Tabs>

      {createOpen && (
        <CreateOptionOfferDialog
          open
          onOpenChange={setCreateOpen}
          holdings={holdings}
          accounts={accounts}
          loading={createMutation.isPending}
          onSubmit={(payload) =>
            createMutation.mutate(payload, {
              onSuccess: ({ offer }) => {
                notifySuccess(`Offer #${offer.id} created.`)
                setCreateOpen(false)
              },
            })
          }
        />
      )}
    </div>
  )
}
