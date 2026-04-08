import axios from "@/utils/axios"
import { ipContract } from "@/utils/ip"

export const getContracts = async (params: any = {}) => {
  return axios.get(`${ipContract}`, { params }).then(res => res.data)
}

export const getContractById = async (id: string) => {
  return axios.get(`${ipContract}/${id}`).then(res => res.data)
}

export const createContract = async (data: MContract.IRecord) => {
  return axios.post(`${ipContract}`, data).then(res => res.data)
}

export const updateContract = async (id: string, data: MContract.IRecord) => {
  return axios.put(`${ipContract}/${id}`, data).then(res => res.data)
}

export const terminateContract = async (id: string) => {
  return axios.patch(`${ipContract}/${id}/terminate`).then(res => res.data)
}

export const getMyContracts = async () => {
  return axios.get(`${ipContract}/me`).then(res => res.data)
}
