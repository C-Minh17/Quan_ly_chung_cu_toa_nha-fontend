import {
  lookupInvoice,
  createPayment,
  getMyPayments,
  getAllPayments,
  getPaymentsByInvoice,
} from "@/services/Payment"
import { useState } from "react"

export default () => {
  const [invoiceLookup, setInvoiceLookup] = useState<MPayment.IInvoiceLookup | null>(null)
  const [loadingLookup, setLoadingLookup] = useState<boolean>(false)

  const [allPayments, setAllPayments] = useState<MPayment.IRecord[]>([])
  const [myPayments, setMyPayments] = useState<MPayment.IRecord[]>([])
  const [invoicePayments, setInvoicePayments] = useState<MPayment.IRecord[]>([])
  const [loadingPayments, setLoadingPayments] = useState<boolean>(false)
  const [submittingPayment, setSubmittingPayment] = useState<boolean>(false)

  /** Tra cứu hóa đơn để thanh toán */
  const handleLookupInvoice = async (data: {
    invoice_code?: string
    apartment_id?: string
    billing_month?: number
    billing_year?: number
  }) => {
    setLoadingLookup(true)
    setInvoiceLookup(null)
    try {
      const res = await lookupInvoice(data)
      if (res?.success) {
        setInvoiceLookup(res.data)
        return res.data
      }
      return null
    } catch (err) {
      console.log(err)
      return null
    } finally {
      setLoadingLookup(false)
    }
  }

  /** Tạo thanh toán */
  const handleCreatePayment = async (data: {
    invoice_id: string
    amount: number
    payment_method: 'cash' | 'bank_transfer' | 'momo' | 'vnpay'
    transaction_code?: string
    note?: string
  }) => {
    setSubmittingPayment(true)
    try {
      const res = await createPayment(data)
      if (res?.success) {
        // Cập nhật lại invoice sau khi thanh toán thành công
        if (invoiceLookup) {
          const newPaidAmount = invoiceLookup.paid_amount + data.amount
          const newRemaining = invoiceLookup.remaining - data.amount
          setInvoiceLookup({
            ...invoiceLookup,
            paid_amount: newPaidAmount,
            remaining: newRemaining,
            status: newRemaining <= 0 ? 'paid' : 'partial',
            payments: [...invoiceLookup.payments, res.data],
          })
        }
        return res.data
      }
      return null
    } catch (err) {
      console.log(err)
      return null
    } finally {
      setSubmittingPayment(false)
    }
  }

  /** Lấy lịch sử thanh toán của cư dân */
  const handleGetMyPayments = async () => {
    setLoadingPayments(true)
    try {
      const res = await getMyPayments()
      setMyPayments(res?.data || [])
      return res?.data
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingPayments(false)
    }
  }

  /** Lấy tất cả thanh toán (admin) */
  const handleGetAllPayments = async (params?: any) => {
    setLoadingPayments(true)
    try {
      const res = await getAllPayments(params)
      setAllPayments(res?.data || [])
      return res?.data
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingPayments(false)
    }
  }

  /** Lấy thanh toán theo hóa đơn */
  const handleGetPaymentsByInvoice = async (invoiceId: string) => {
    setLoadingPayments(true)
    try {
      const res = await getPaymentsByInvoice(invoiceId)
      setInvoicePayments(res?.data || [])
      return res?.data
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingPayments(false)
    }
  }

  return {
    invoiceLookup,
    loadingLookup,
    allPayments,
    myPayments,
    invoicePayments,
    loadingPayments,
    submittingPayment,
    setInvoiceLookup,
    handleLookupInvoice,
    handleCreatePayment,
    handleGetMyPayments,
    handleGetAllPayments,
    handleGetPaymentsByInvoice,
  }
}
