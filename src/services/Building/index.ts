import axios from "@/utils/axios"
import { ipBuilding } from "@/utils/ip"

export const getAllBuilding = async () => {
  return axios.get(`${ipBuilding}`).then(res => res.data)
}

export const getBuildingById = async (id: string) => {
  return axios.get(`${ipBuilding}/${id}`).then(res => res.data)
}

export const createBuilding = async (data: MBuilding.IRecord) => {
  return axios.post(`${ipBuilding}`, data).then(res => res.data)
}

export const updateBuilding = async (id: string, data: MBuilding.IRecord) => {
  return axios.put(`${ipBuilding}/${id}`, data).then(res => res.data)
}

export const deleteBuilding = async (id: string) => {
  return axios.delete(`${ipBuilding}/${id}`).then(res => res.data)
}
