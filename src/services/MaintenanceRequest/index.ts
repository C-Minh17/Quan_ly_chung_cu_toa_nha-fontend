import axios from "@/utils/axios"
import { ipMaintenanceRequest } from "@/utils/ip"

export const getAllMaintenanceRequest = async () =>
  axios.get(`${ipMaintenanceRequest}`).then(res => res.data)

export const getMyMaintenanceRequest = async () =>
  axios.get(`${ipMaintenanceRequest}/me`).then(res => res.data)

export const getMaintenanceRequestById = async (id: string) =>
  axios.get(`${ipMaintenanceRequest}/${id}`).then(res => res.data)

export const getMaintenanceRequestStats = async (params?: { startDate?: string; endDate?: string }) =>
  axios.get(`${ipMaintenanceRequest}/stats`, { params }).then(res => res.data)

export const createMaintenanceRequest = async (data: MMaintenanceRequest.IRecord) =>
  axios.post(`${ipMaintenanceRequest}`, data).then(res => res.data)

export const updateMaintenanceRequest = async (id: string, data: MMaintenanceRequest.IRecord) =>
  axios.put(`${ipMaintenanceRequest}/${id}`, data).then(res => res.data)

export const assignMaintenanceRequest = async (id: string, data: { assigned_to: string; priority?: string }) =>
  axios.patch(`${ipMaintenanceRequest}/${id}/assign`, data).then(res => res.data)

export const updateMaintenanceRequestStatus = async (id: string, status: string) =>
  axios.patch(`${ipMaintenanceRequest}/${id}/status`, { status }).then(res => res.data)

export const closeMaintenanceRequest = async (id: string) =>
  axios.patch(`${ipMaintenanceRequest}/${id}/close`, {}).then(res => res.data)

export const rateMaintenanceRequest = async (id: string, data: { rating: number; feedback?: string }) =>
  axios.post(`${ipMaintenanceRequest}/${id}/rate`, data).then(res => res.data)

export const deleteMaintenanceRequest = async (id: string) =>
  axios.delete(`${ipMaintenanceRequest}/${id}`).then(res => res.data)
