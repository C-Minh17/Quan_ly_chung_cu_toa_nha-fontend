import axios from "@/utils/axios"
import { ipResident } from "@/utils/ip"

export const getAllResident = async () => {
  return axios.get(`${ipResident}`).then(res => res.data)
}

export const getResidentById = async (id: string) => {
  return axios.get(`${ipResident}/${id}`).then(res => res.data)
}

export const createResident = async (data: MResident.IRecord) => {
  return axios.post(`${ipResident}`, data).then(res => res.data)
}

export const updateResident = async (id: string, data: MResident.IRecord) => {
  return axios.put(`${ipResident}/${id}`, data).then(res => res.data)
}

export const deleteResident = async (id: string) => {
  return axios.delete(`${ipResident}/${id}`).then(res => res.data)
}

export const getMeResident = async () => {
  return axios.get(`${ipResident}/me`).then(res => res.data)
}