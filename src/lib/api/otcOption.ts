import { apiClient } from '@/lib/api/axios'
import type {
  ExerciseContractPayload,
  ExerciseOtcContractResponse,
  MyContractsFilters,
  MyOtcContractsResponse,
  OptionContract,
} from '@/types/otcOption'

export async function getOtcOptionContract(id: number): Promise<{ contract: OptionContract }> {
  const { data } = await apiClient.get<{ contract: OptionContract }>(`/otc/contracts/${id}`)
  return data
}

export async function getMyOtcOptionContracts(
  filters: MyContractsFilters = {}
): Promise<MyOtcContractsResponse> {
  const { data } = await apiClient.get<MyOtcContractsResponse>('/me/otc/contracts', {
    params: filters,
  })
  return { ...data, contracts: data.contracts ?? [] }
}

export async function exerciseOtcOptionContract(
  id: number,
  payload: ExerciseContractPayload
): Promise<ExerciseOtcContractResponse> {
  const { data } = await apiClient.post<ExerciseOtcContractResponse>(
    `/otc/contracts/${id}/exercise`,
    payload
  )
  return data
}
