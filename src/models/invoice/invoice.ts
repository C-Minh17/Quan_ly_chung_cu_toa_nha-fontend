import { getInvoices, getInvoiceById, createInvoice, deleteInvoice, generateInvoices, getMyInvoices, getOverdueInvoices, exportInvoicePdf } from "@/services/Invoice"
import { useState } from "react"

export default () => {
  const [infoAllInvoice, setInfoAllInvoice] = useState<MInvoice.IRecord[]>([])
  const [loadingInfoAllInvoice, setLoadingInfoAllInvoice] = useState<boolean>(false)

  const [infoInvoice, setInfoInvoice] = useState<MInvoice.IRecord>()
  const [loadingInfoInvoice, setLoadingInfoInvoice] = useState<boolean>(false)

  const [refreshKey, setRefreshKey] = useState(0)

  const refreshInvoices = () => {
    setRefreshKey(prev => prev + 1)
  }

  const handleGetInfoAllInvoice = async (params?: any) => {
    setLoadingInfoAllInvoice(true)
    try {
      const res = await getInvoices(params)
      setInfoAllInvoice(res?.data || [])
      return res?.data
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoAllInvoice(false)
    }
  }

  const handleGetInfoInvoice = async (id: string) => {
    setLoadingInfoInvoice(true)
    try {
      const res = await getInvoiceById(id)
      setInfoInvoice(res?.data)
      return res?.data
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoInvoice(false)
    }
  }

  const handleCreateInvoice = async (data: any) => {
    setLoadingInfoInvoice(true)
    try {
      const res = await createInvoice(data)
      if (res) {
        return res?.data
      }
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoInvoice(false)
      refreshInvoices()
    }
  }

  const handleDeleteInvoice = async (id: string) => {
    setLoadingInfoInvoice(true)
    try {
      const res = await deleteInvoice(id)
      if (res) {
        return res?.data
      }
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoInvoice(false)
      refreshInvoices()
    }
  }

  const handleGenerateInvoices = async (data: any) => {
    setLoadingInfoInvoice(true)
    try {
      const res = await generateInvoices(data)
      return res?.data
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoInvoice(false)
      refreshInvoices()
    }
  }

  const handleGetMyInvoices = async (params?: any) => {
    setLoadingInfoAllInvoice(true)
    try {
      const res = await getMyInvoices(params)
      setInfoAllInvoice(res?.data || [])
      return res?.data
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoAllInvoice(false)
    }
  }

  const handleGetOverdueInvoices = async (params?: any) => {
    setLoadingInfoAllInvoice(true)
    try {
      const res = await getOverdueInvoices(params)
      setInfoAllInvoice(res?.data || [])
      return res?.data
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoAllInvoice(false)
    }
  }

  const handleExportInvoicePdf = async (id: string) => {
    try {
      const blob = await exportInvoicePdf(id)
      return blob
    } catch (err) {
      console.log(err)
    }
  }

  return {
    refreshKey,
    infoAllInvoice,
    loadingInfoAllInvoice,
    infoInvoice,
    loadingInfoInvoice,
    handleGetInfoAllInvoice,
    handleGetInfoInvoice,
    handleCreateInvoice,
    handleDeleteInvoice,
    handleGenerateInvoices,
    handleGetMyInvoices,
    handleGetOverdueInvoices,
    handleExportInvoicePdf,
    refreshInvoices,
  }
}
