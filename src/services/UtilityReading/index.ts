import axios from "@/utils/axios"
import { ipUtilityReading } from "@/utils/ip"

export const getUtilityReadings = async (params: any = {}) => {
  return axios.get(`${ipUtilityReading}`, { params }).then(res => res.data)
}

export const getUtilityReadingById = async (id: string) => {
  return axios.get(`${ipUtilityReading}/${id}`).then(res => res.data)
}

export const createUtilityReading = async (data: any) => {
  return axios.post(`${ipUtilityReading}`, data).then(res => res.data)
}

export const updateUtilityReading = async (id: string, data: any) => {
  return axios.put(`${ipUtilityReading}/${id}`, data).then(res => res.data)
}

export const deleteUtilityReading = async (id: string) => {
  return axios.delete(`${ipUtilityReading}/${id}`).then(res => res.data)
}
