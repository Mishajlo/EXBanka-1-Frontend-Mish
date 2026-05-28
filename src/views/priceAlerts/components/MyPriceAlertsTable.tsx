import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { PriceAlert, PriceAlertCondition } from '@/types/priceAlert'

interface MyPriceAlertsTableProps {
  alerts: PriceAlert[]
  onPause: (id: number) => void
  onResume: (id: number) => void
  onDelete: (id: number) => void
  /** When set, the row with this id renders its action buttons disabled. */
  busyId?: number
}

const CONDITION_SYMBOL: Record<PriceAlertCondition, string> = {
  gte: '≥',
  lte: '≤',
  daily_change_pct_gte: 'Δ% ≥',
  daily_change_pct_lte: 'Δ% ≤',
}

function formatCondition(alert: PriceAlert): string {
  return `${CONDITION_SYMBOL[alert.condition]} ${alert.threshold}`
}

export function MyPriceAlertsTable({
  alerts,
  onPause,
  onResume,
  onDelete,
  busyId,
}: MyPriceAlertsTableProps) {
  if (alerts.length === 0) {
    return <p className="text-sm text-muted-foreground">You have no price alerts yet.</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Listing ID</TableHead>
          <TableHead>Condition</TableHead>
          <TableHead>Recurring</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {alerts.map((a) => {
          const busy = busyId === a.id
          return (
            <TableRow key={a.id}>
              <TableCell className="font-mono">#{a.listing_id}</TableCell>
              <TableCell>{formatCondition(a)}</TableCell>
              <TableCell>
                {a.is_recurring ? `Every ${a.cooldown_seconds}s` : 'Single-shot'}
              </TableCell>
              <TableCell>
                {a.active ? <Badge>Active</Badge> : <Badge variant="secondary">Paused</Badge>}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {a.active ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onPause(a.id)}
                      disabled={busy}
                    >
                      Pause
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onResume(a.id)}
                      disabled={busy}
                    >
                      Resume
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(a.id)}
                    disabled={busy}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
