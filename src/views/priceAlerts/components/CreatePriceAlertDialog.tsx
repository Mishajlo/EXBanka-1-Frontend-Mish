import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { CreatePriceAlertPayload, PriceAlertCondition } from '@/types/priceAlert'

interface Listing {
  listing_id: number
  ticker: string
  name: string
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  listing: Listing
  onSubmit: (payload: CreatePriceAlertPayload) => void
  loading: boolean
}

const POSITIVE_DECIMAL_RE = /^\d+(\.\d+)?$/
const DEFAULT_COOLDOWN_SECONDS = 3600
const MIN_COOLDOWN_SECONDS = 60
const MAX_COOLDOWN_SECONDS = 86400

const CONDITION_LABELS: Record<PriceAlertCondition, string> = {
  gte: 'Price ≥ threshold',
  lte: 'Price ≤ threshold',
  daily_change_pct_gte: 'Daily change % ≥ threshold',
  daily_change_pct_lte: 'Daily change % ≤ threshold',
}

export function CreatePriceAlertDialog({ open, onOpenChange, listing, onSubmit, loading }: Props) {
  const [condition, setCondition] = useState<PriceAlertCondition>('gte')
  const [threshold, setThreshold] = useState('')
  const [isRecurring, setIsRecurring] = useState(false)
  const [cooldown, setCooldown] = useState<number>(DEFAULT_COOLDOWN_SECONDS)
  const [emailToo, setEmailToo] = useState(false)

  const thresholdOk = POSITIVE_DECIMAL_RE.test(threshold) && Number(threshold) > 0
  const cooldownOk =
    !isRecurring || (cooldown >= MIN_COOLDOWN_SECONDS && cooldown <= MAX_COOLDOWN_SECONDS)
  const isValid = thresholdOk && cooldownOk

  const handleSubmit = () => {
    if (!isValid) return
    const payload: CreatePriceAlertPayload = {
      listing_id: listing.listing_id,
      condition,
      threshold,
      is_recurring: isRecurring,
      ...(isRecurring ? { cooldown_seconds: cooldown } : {}),
      ...(emailToo ? { email_too: true } : {}),
    }
    onSubmit(payload)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Create price alert — <span className="font-mono">{listing.ticker}</span>{' '}
            <span className="text-muted-foreground text-sm font-normal">({listing.name})</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label htmlFor="alert-condition">Condition</Label>
            <Select
              value={condition}
              onValueChange={(v) => v && setCondition(v as PriceAlertCondition)}
            >
              <SelectTrigger id="alert-condition" className="w-full" aria-label="Condition">
                <SelectValue>{CONDITION_LABELS[condition]}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(CONDITION_LABELS) as PriceAlertCondition[]).map((c) => (
                  <SelectItem key={c} value={c}>
                    {CONDITION_LABELS[c]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="alert-threshold">Threshold</Label>
            <Input
              id="alert-threshold"
              inputMode="decimal"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              placeholder="200.00"
              aria-invalid={threshold.length > 0 && !thresholdOk}
            />
            {threshold.length > 0 && !thresholdOk && (
              <p className="text-xs text-destructive mt-1">Enter a positive decimal.</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="alert-recurring"
              checked={isRecurring}
              onCheckedChange={(v) => setIsRecurring(Boolean(v))}
            />
            <Label htmlFor="alert-recurring">Recurring alert</Label>
          </div>

          {isRecurring && (
            <div>
              <Label htmlFor="alert-cooldown">Cooldown (seconds, 60–86400)</Label>
              <Input
                id="alert-cooldown"
                type="number"
                min={MIN_COOLDOWN_SECONDS}
                max={MAX_COOLDOWN_SECONDS}
                value={cooldown}
                onChange={(e) => setCooldown(Number(e.target.value))}
                aria-invalid={!cooldownOk}
              />
              {!cooldownOk && (
                <p className="text-xs text-destructive mt-1">
                  Cooldown must be between {MIN_COOLDOWN_SECONDS} and {MAX_COOLDOWN_SECONDS}.
                </p>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Checkbox
              id="alert-email-too"
              checked={emailToo}
              onCheckedChange={(v) => setEmailToo(Boolean(v))}
            />
            <Label htmlFor="alert-email-too">Also send email when triggered</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid || loading}>
            {loading ? 'Creating...' : 'Create alert'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
