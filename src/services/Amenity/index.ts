import axios from "@/utils/axios"
import { ipAmenity } from "@/utils/ip"

export const getAllAmenities = async (params?: any) =>
	axios.get(`${ipAmenity}`, { params }).then(res => res.data)

export const getAmenityById = async (id: string) =>
	axios.get(`${ipAmenity}/${id}`).then(res => res.data)

export const createAmenity = async (data: MAmenity.IRecord) =>
	axios.post(`${ipAmenity}`, data).then(res => res.data)

export const updateAmenity = async (id: string, data: MAmenity.IRecord) =>
	axios.put(`${ipAmenity}/${id}`, data).then(res => res.data)

export const deleteAmenity = async (id: string) =>
	axios.delete(`${ipAmenity}/${id}`).then(res => res.data)

export const getAmenitySchedule = async (id: string, params: { date: string }) =>
	axios.get(`${ipAmenity}/${id}/schedule`, { params }).then(res => res.data)
