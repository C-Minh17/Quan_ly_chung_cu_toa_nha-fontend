import axios from "@/utils/axios"
import { ipPayment } from "@/utils/ip"

/** Tra cứu hóa đơn */
export const lookupInvoice = async (data: {
  invoice_code?: string
  apartment_id?: string
  billing_month?: number
  billing_year?: number
}) => {
  return axios.post(`${ipPayment}/lookup`, data).then(res => res.data)
}

/** Tạo thanh toán mới */
export const createPayment = async (data: {
  invoice_id: string
  amount: number
  payment_method: 'cash' | 'bank_transfer' | 'momo' | 'vnpay'
  transaction_code?: string
  note?: string
}) => {
  return axios.post(`${ipPayment}`, data).then(res => res.data)
}

/** Lấy lịch sử thanh toán của cư dân đang đăng nhập */
export const getMyPayments = async () => {
  return axios.get(`${ipPayment}/me`).then(res => res.data)
}

/** Lấy tất cả thanh toán (admin) */
export const getAllPayments = async (params: any = {}) => {
  return axios.get(`${ipPayment}`, { params }).then(res => res.data)
}

/** Lấy thanh toán theo hóa đơn */
export const getPaymentsByInvoice = async (invoiceId: string) => {
  return axios.get(`${ipPayment}/invoice/${invoiceId}`).then(res => res.data)
}
