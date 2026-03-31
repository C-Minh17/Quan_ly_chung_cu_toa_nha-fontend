import axios from "@/utils/axios"
import { ipUser } from "@/utils/ip"

export const getAllUser = async () => {
  return axios.get(`${ipUser}`).then(res => res.data)
}

export const getUserById = async (id: string) => {
  return axios.get(`${ipUser}/${id}`).then(res => res.data)
}

export const createUser = async (data: MUser.IRecord) => {
  return axios.post(`${ipUser}`, data).then(res => res.data)
}

export const updateUser = async (id: string, data: MUser.IRecord) => {
  return axios.put(`${ipUser}/${id}`, data).then(res => res.data)
}

export const deleteUser = async (id: string) => {
  return axios.delete(`${ipUser}/${id}`).then(res => res.data)
}

export const changePassword = async (data: MUser.IRecord) => {
  return axios.put(`${ipUser}/password`, data).then(res => res.data)
}

export const changePasswordUser = async (id: string, data: MUser.IRecord) => {
  return axios.put(`${ipUser}/${id}/password`, data).then(res => res.data)
}