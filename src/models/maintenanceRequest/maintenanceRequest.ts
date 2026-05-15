import {
  getAllMaintenanceRequest,
  getMyMaintenanceRequest,
  getMaintenanceRequestById,
  getMaintenanceRequestStats,
  createMaintenanceRequest,
  updateMaintenanceRequest,
  assignMaintenanceRequest,
  updateMaintenanceRequestStatus,
  closeMaintenanceRequest,
  rateMaintenanceRequest,
  deleteMaintenanceRequest,
} from "@/services/MaintenanceRequest"
import { useState } from "react"

export default () => {
  const [infoAllMaintenanceRequest, setInfoAllMaintenanceRequest] = useState<MMaintenanceRequest.IRecord[]>([])
  const [loadingInfoAllMaintenanceRequest, setLoadingInfoAllMaintenanceRequest] = useState<boolean>(false)

  const [infoMaintenanceRequest, setInfoMaintenanceRequest] = useState<MMaintenanceRequest.IRecord>()
  const [loadingInfoMaintenanceRequest, setLoadingInfoMaintenanceRequest] = useState<boolean>(false)

  const [statsMaintenanceRequest, setStatsMaintenanceRequest] = useState<any[]>([])

  const [refreshKey, setRefreshKey] = useState(0)

  const refresh = () => setRefreshKey(prev => prev + 1)

  const handleGetAllMaintenanceRequest = async () => {
    setLoadingInfoAllMaintenanceRequest(true)
    try {
      const res = await getAllMaintenanceRequest()
      setInfoAllMaintenanceRequest(res?.data || [])
      return res?.data
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoAllMaintenanceRequest(false)
    }
  }

  const handleGetMyMaintenanceRequest = async () => {
    setLoadingInfoAllMaintenanceRequest(true)
    try {
      const res = await getMyMaintenanceRequest()
      setInfoAllMaintenanceRequest(res?.data || [])
      return res?.data
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoAllMaintenanceRequest(false)
    }
  }

  const handleGetMaintenanceRequestById = async (id: string) => {
    setLoadingInfoMaintenanceRequest(true)
    try {
      const res = await getMaintenanceRequestById(id)
      setInfoMaintenanceRequest(res?.data)
      return res?.data
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoMaintenanceRequest(false)
    }
  }

  const handleGetMaintenanceRequestStats = async (params?: { startDate?: string; endDate?: string }) => {
    try {
      const res = await getMaintenanceRequestStats(params)
      setStatsMaintenanceRequest(res?.data || [])
      return res?.data
    } catch (err) {
      console.log(err)
    }
  }

  const handleCreateMaintenanceRequest = async (data: MMaintenanceRequest.IRecord) => {
    setLoadingInfoMaintenanceRequest(true)
    try {
      const res = await createMaintenanceRequest(data)
      if (res) return res?.data
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoMaintenanceRequest(false)
      refresh()
    }
  }

  const handleUpdateMaintenanceRequest = async (id: string, data: MMaintenanceRequest.IRecord) => {
    setLoadingInfoMaintenanceRequest(true)
    try {
      const res = await updateMaintenanceRequest(id, data)
      if (res) return res?.data
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoMaintenanceRequest(false)
      refresh()
    }
  }

  const handleAssignMaintenanceRequest = async (id: string, data: { assigned_to: string; priority?: string }) => {
    setLoadingInfoMaintenanceRequest(true)
    try {
      const res = await assignMaintenanceRequest(id, data)
      if (res) return res?.data
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoMaintenanceRequest(false)
      refresh()
    }
  }

  const handleUpdateMaintenanceRequestStatus = async (id: string, status: string) => {
    setLoadingInfoMaintenanceRequest(true)
    try {
      const res = await updateMaintenanceRequestStatus(id, status)
      if (res) return res?.data
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoMaintenanceRequest(false)
      refresh()
    }
  }

  const handleCloseMaintenanceRequest = async (id: string) => {
    setLoadingInfoMaintenanceRequest(true)
    try {
      const res = await closeMaintenanceRequest(id)
      if (res) return res?.data
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoMaintenanceRequest(false)
      refresh()
    }
  }

  const handleRateMaintenanceRequest = async (id: string, data: { rating: number; feedback?: string }) => {
    setLoadingInfoMaintenanceRequest(true)
    try {
      const res = await rateMaintenanceRequest(id, data)
      if (res) return res?.data
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoMaintenanceRequest(false)
      refresh()
    }
  }

  const handleDeleteMaintenanceRequest = async (id: string) => {
    setLoadingInfoMaintenanceRequest(true)
    try {
      const res = await deleteMaintenanceRequest(id)
      if (res) return res?.data
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoMaintenanceRequest(false)
      refresh()
    }
  }

  return {
    refreshKey,
    infoAllMaintenanceRequest,
    loadingInfoAllMaintenanceRequest,
    infoMaintenanceRequest,
    loadingInfoMaintenanceRequest,
    statsMaintenanceRequest,
    handleGetAllMaintenanceRequest,
    handleGetMyMaintenanceRequest,
    handleGetMaintenanceRequestById,
    handleGetMaintenanceRequestStats,
    handleCreateMaintenanceRequest,
    handleUpdateMaintenanceRequest,
    handleAssignMaintenanceRequest,
    handleUpdateMaintenanceRequestStatus,
    handleCloseMaintenanceRequest,
    handleRateMaintenanceRequest,
    handleDeleteMaintenanceRequest,
  }
}
