import {
  getAllMaintenanceSchedule,
  getMaintenanceScheduleById,
  createMaintenanceSchedule,
  updateMaintenanceSchedule,
  completeMaintenanceSchedule,
  deleteMaintenanceSchedule,
} from "@/services/MaintenanceSchedule"
import { useState } from "react"

export default () => {
  const [infoAllMaintenanceSchedule, setInfoAllMaintenanceSchedule] = useState<MMaintenanceSchedule.IRecord[]>([])
  const [loadingInfoAllMaintenanceSchedule, setLoadingInfoAllMaintenanceSchedule] = useState<boolean>(false)

  const [infoMaintenanceSchedule, setInfoMaintenanceSchedule] = useState<MMaintenanceSchedule.IRecord>()
  const [loadingInfoMaintenanceSchedule, setLoadingInfoMaintenanceSchedule] = useState<boolean>(false)

  const [refreshKey, setRefreshKey] = useState(0)

  const refresh = () => setRefreshKey(prev => prev + 1)

  const handleGetAllMaintenanceSchedule = async () => {
    setLoadingInfoAllMaintenanceSchedule(true)
    try {
      const res = await getAllMaintenanceSchedule()
      setInfoAllMaintenanceSchedule(res?.data || [])
      return res?.data
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoAllMaintenanceSchedule(false)
    }
  }

  const handleGetMaintenanceScheduleById = async (id: string) => {
    setLoadingInfoMaintenanceSchedule(true)
    try {
      const res = await getMaintenanceScheduleById(id)
      setInfoMaintenanceSchedule(res?.data)
      return res?.data
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoMaintenanceSchedule(false)
    }
  }

  const handleCreateMaintenanceSchedule = async (data: MMaintenanceSchedule.IRecord) => {
    setLoadingInfoMaintenanceSchedule(true)
    try {
      const res = await createMaintenanceSchedule(data)
      return res || true
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoMaintenanceSchedule(false)
      refresh()
    }
  }

  const handleUpdateMaintenanceSchedule = async (id: string, data: MMaintenanceSchedule.IRecord) => {
    setLoadingInfoMaintenanceSchedule(true)
    try {
      const res = await updateMaintenanceSchedule(id, data)
      if (res) return res?.data
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoMaintenanceSchedule(false)
      refresh()
    }
  }

  const handleCompleteMaintenanceSchedule = async (id: string, status: string = 'completed') => {
    setLoadingInfoMaintenanceSchedule(true)
    try {
      const res = await completeMaintenanceSchedule(id, status)
      if (res) return res?.data || res
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoMaintenanceSchedule(false)
      refresh()
    }
  }

  const handleDeleteMaintenanceSchedule = async (id: string) => {
    setLoadingInfoMaintenanceSchedule(true)
    try {
      const res = await deleteMaintenanceSchedule(id)
      if (res) return res?.data
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoMaintenanceSchedule(false)
      refresh()
    }
  }

  return {
    refreshKey,
    infoAllMaintenanceSchedule,
    loadingInfoAllMaintenanceSchedule,
    infoMaintenanceSchedule,
    loadingInfoMaintenanceSchedule,
    handleGetAllMaintenanceSchedule,
    handleGetMaintenanceScheduleById,
    handleCreateMaintenanceSchedule,
    handleUpdateMaintenanceSchedule,
    handleCompleteMaintenanceSchedule,
    handleDeleteMaintenanceSchedule,
  }
}
