import axios from "@/utils/axios"
import { ipVehicle } from "@/utils/ip"

export const getVehicles = async (params: any = {}) => {
  return axios.get(`${ipVehicle}`, { params }).then(res => res.data)
}

export const getVehicleById = async (id: string) => {
  return axios.get(`${ipVehicle}/${id}`).then(res => res.data)
}

export const createVehicle = async (data: any) => {
  return axios.post(`${ipVehicle}`, data).then(res => res.data)
}

export const updateVehicle = async (id: string, data: any) => {
  return axios.put(`${ipVehicle}/${id}`, data).then(res => res.data)
}

export const updateVehicleStatus = async (id: string, is_active: boolean) => {
  return axios.patch(`${ipVehicle}/${id}/status`, { is_active }).then(res => res.data)
}

export const deleteVehicle = async (id: string) => {
  return axios.delete(`${ipVehicle}/${id}`).then(res => res.data)
}

export const getMyVehicles = async () => {
  return axios.get(`${ipVehicle}/me`).then(res => res.data)
}
