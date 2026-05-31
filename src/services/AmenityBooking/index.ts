import axios from "@/utils/axios"
import { ipAmenityBooking } from "@/utils/ip"

export const getAllAmenityBookings = async (params?: any) =>
	axios.get(`${ipAmenityBooking}`, { params }).then(res => res.data)

export const getMyAmenityBookings = async (params?: any) =>
	axios.get(`${ipAmenityBooking}/me`, { params }).then(res => res.data)

export const getAmenityBookingById = async (id: string) =>
	axios.get(`${ipAmenityBooking}/${id}`).then(res => res.data)

export const createAmenityBooking = async (data: MAmenityBooking.IRecord) =>
	axios.post(`${ipAmenityBooking}`, data).then(res => res.data)

export const updateAmenityBooking = async (id: string, data: MAmenityBooking.IRecord) =>
	axios.put(`${ipAmenityBooking}/${id}`, data).then(res => res.data)

export const deleteAmenityBooking = async (id: string) =>
	axios.delete(`${ipAmenityBooking}/${id}`).then(res => res.data)

export const updateAmenityBookingStatus = async (id: string, status: string) => {
	const action = status === 'approved' ? 'approve' : status === 'rejected' ? 'reject' : status;
	return axios.patch(`${ipAmenityBooking}/${id}/${action}`, {}).then(res => res.data);
}

export const cancelAmenityBooking = async (id: string) =>
	axios.delete(`${ipAmenityBooking}/${id}`).then(res => res.data)
