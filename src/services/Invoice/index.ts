import axios from "@/utils/axios"
import { ipRoot } from "@/utils/ip"

const ipInvoice = `${ipRoot}/invoices`

export const getInvoices = async (params: any = {}) => {
  return axios.get(`${ipInvoice}`, { params }).then(res => res.data)
}

export const getInvoiceById = async (id: string) => {
  return axios.get(`${ipInvoice}/${id}`).then(res => res.data)
}

export const createInvoice = async (data: any) => {
  return axios.post(`${ipInvoice}`, data).then(res => res.data)
}

export const deleteInvoice = async (id: string) => {
  return axios.delete(`${ipInvoice}/${id}`).then(res => res.data)
}

export const generateInvoices = async (data: any) => {
  return axios.post(`${ipInvoice}/generate`, data).then(res => res.data)
}

export const generateMonthlyInvoices = async (data: any) => {
  return axios.post(`${ipInvoice}/generate-monthly`, data).then(res => res.data)
}

export const getMyInvoices = async (params: any = {}) => {
  return axios.get(`${ipInvoice}/me`, { params }).then(res => res.data)
}

export const getMyInvoiceById = async (id: string) => {
  return axios.get(`${ipInvoice}/me/${id}`).then(res => res.data)
}

export const getOverdueInvoices = async (params: any = {}) => {
  return axios.get(`${ipInvoice}/overdue`, { params }).then(res => res.data)
}

export const exportInvoicePdf = async (id: string) => {
  return axios.get(`${ipInvoice}/${id}/pdf`, { responseType: 'blob' }).then(res => res.data)
}
