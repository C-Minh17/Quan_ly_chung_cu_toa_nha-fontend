import axios from "@/utils/axios"
import { ipFloor } from "@/utils/ip"

export const getAllFloor = async () => {
  return axios.get(`${ipFloor}`).then(res => res.data)
}

export const getFloorById = async (id: string) => {
  return axios.get(`${ipFloor}/${id}`).then(res => res.data)
}

export const createFloor = async (data: MFloor.IRecord) => {
  return axios.post(`${ipFloor}`, data).then(res => res.data)
}

export const updateFloor = async (id: string, data: MFloor.IRecord) => {
  return axios.put(`${ipFloor}/${id}`, data).then(res => res.data)
}

export const deleteFloor = async (id: string) => {
  return axios.delete(`${ipFloor}/${id}`).then(res => res.data)
}

export const getFloorLayout = async (id: string) => {
  return axios.get(`${ipFloor}/${id}/layout`).then(res => res.data)
}
