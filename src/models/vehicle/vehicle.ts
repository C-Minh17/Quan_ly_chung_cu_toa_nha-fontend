import {
  createVehicle,
  deleteVehicle,
  getMyVehicles,
  getVehicleById,
  getVehicles,
  updateVehicle,
  updateVehicleStatus
} from "@/services/Vehicle"
import { useState } from "react"

export default () => {
  const [infoAllVehicle, setInfoAllVehicle] = useState<MVehicle.IRecord[]>([])
  const [loadingInfoAllVehicle, setLoadingInfoAllVehicle] = useState<boolean>(false)

  const [infoVehicle, setInfoVehicle] = useState<MVehicle.IRecord>()
  const [loadingInfoVehicle, setLoadingInfoVehicle] = useState<boolean>(false)

  const [infoMyVehicles, setInfoMyVehicles] = useState<MVehicle.IRecord[]>([])
  const [loadingInfoMyVehicles, setLoadingInfoMyVehicles] = useState<boolean>(false)

  const [refreshKey, setRefreshKey] = useState(0)

  const refreshVehicles = () => {
    setRefreshKey(prev => prev + 1)
  }

  const handleGetInfoAllVehicle = async (params: any = {}) => {
    setLoadingInfoAllVehicle(true)
    try {
      const res = await getVehicles(params)
      setInfoAllVehicle(res?.data || [])
      return res?.data
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoAllVehicle(false)
    }
  }

  const handleGetInfoVehicle = async (id: string) => {
    setLoadingInfoVehicle(true)
    try {
      const res = await getVehicleById(id)
      setInfoVehicle(res?.data)
      return res?.data
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoVehicle(false)
    }
  }

  const handleCreateVehicle = async (data: any) => {
    setLoadingInfoVehicle(true)
    try {
      const res = await createVehicle(data)
      if (res) {
        return res?.data
      }
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoVehicle(false)
      refreshVehicles()
    }
  }

  const handleUpdateVehicle = async (id: string, data: any) => {
    setLoadingInfoVehicle(true)
    try {
      const res = await updateVehicle(id, data)
      if (res) {
        return res?.data
      }
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoVehicle(false)
      refreshVehicles()
    }
  }

  const handleUpdateVehicleStatus = async (id: string, is_active: boolean) => {
    setLoadingInfoVehicle(true)
    try {
      const res = await updateVehicleStatus(id, is_active)
      if (res) {
        return res?.data
      }
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoVehicle(false)
      refreshVehicles()
    }
  }

  const handleDeleteVehicle = async (id: string) => {
    setLoadingInfoVehicle(true)
    try {
      const res = await deleteVehicle(id)
      if (res) {
        return res?.data
      }
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoVehicle(false)
      refreshVehicles()
    }
  }

  const handleGetMyVehicles = async () => {
    setLoadingInfoMyVehicles(true)
    try {
      const res = await getMyVehicles()
      setInfoMyVehicles(res?.data || [])
      return res?.data
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoMyVehicles(false)
    }
  }

  return {
    refreshKey,
    infoAllVehicle,
    loadingInfoAllVehicle,
    infoVehicle,
    loadingInfoVehicle,
    handleGetInfoAllVehicle,
    handleGetInfoVehicle,
    handleCreateVehicle,
    handleUpdateVehicle,
    handleUpdateVehicleStatus,
    handleDeleteVehicle,
    handleGetMyVehicles,
    refreshVehicles,
    infoMyVehicles,
    loadingInfoMyVehicles
  }
}
