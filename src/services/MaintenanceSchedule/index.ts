import axios from "@/utils/axios"
import { ipMaintenanceSchedule } from "@/utils/ip"

export const getAllMaintenanceSchedule = async () =>
  axios.get(`${ipMaintenanceSchedule}`).then(res => res.data)

export const getMaintenanceScheduleById = async (id: string) =>
  axios.get(`${ipMaintenanceSchedule}/${id}`).then(res => res.data)

export const createMaintenanceSchedule = async (data: MMaintenanceSchedule.IRecord) =>
  axios.post(`${ipMaintenanceSchedule}`, data).then(res => res.data)

export const updateMaintenanceSchedule = async (id: string, data: MMaintenanceSchedule.IRecord) =>
  axios.put(`${ipMaintenanceSchedule}/${id}`, data).then(res => res.data)

export const completeMaintenanceSchedule = async (id: string, status: string = 'completed') =>
  axios.patch(`${ipMaintenanceSchedule}/${id}/complete`, { status }).then(res => res.data)

export const deleteMaintenanceSchedule = async (id: string) =>
  axios.delete(`${ipMaintenanceSchedule}/${id}`).then(res => res.data)

export const getMaintenanceScheduleByEmployee = async (employeeId: string) =>
  axios.get(`${ipMaintenanceSchedule}/employee/${employeeId}`).then(res => res.data)
