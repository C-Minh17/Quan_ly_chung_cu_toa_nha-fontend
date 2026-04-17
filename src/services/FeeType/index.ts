import axios from "@/utils/axios"
import { ipFeeType } from "@/utils/ip"

export const getAllFeeType = async () => {
  return axios.get(`${ipFeeType}`).then(res => res.data)
}

export const getFeeTypeById = async (id: string) => {
  return axios.get(`${ipFeeType}/${id}`).then(res => res.data)
}

export const createFeeType = async (data: MFeeType.IRecord) => {
  return axios.post(`${ipFeeType}`, data).then(res => res.data)
}

export const updateFeeType = async (id: string, data: MFeeType.IRecord) => {
  return axios.put(`${ipFeeType}/${id}`, data).then(res => res.data)
}

export const deleteFeeType = async (id: string) => {
  return axios.delete(`${ipFeeType}/${id}`).then(res => res.data)
}

export const activeFeeType = async (id: string) => {
  return axios.put(`${ipFeeType}/${id}/active`).then(res => res.data)
}
