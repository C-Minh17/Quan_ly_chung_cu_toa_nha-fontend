import axios from "@/utils/axios"
import { ipApartment } from "@/utils/ip"

export const getAllApartment = async () => {
  return axios.get(`${ipApartment}`).then(res => res.data)
}

export const getApartmentById = async (id: string) => {
  return axios.get(`${ipApartment}/${id}`).then(res => res.data)
}

export const createApartment = async (data: MApartment.IRecord) => {
  return axios.post(`${ipApartment}`, data).then(res => res.data)
}

export const updateApartment = async (id: string, data: MApartment.IRecord) => {
  return axios.put(`${ipApartment}/${id}`, data).then(res => res.data)
}

export const deleteApartment = async (id: string) => {
  return axios.delete(`${ipApartment}/${id}`).then(res => res.data)
}

export const updateApartmentStatus = async (id: string, status: string) => {
  return axios.patch(`${ipApartment}/${id}/status`, { status }).then(res => res.data)
}
