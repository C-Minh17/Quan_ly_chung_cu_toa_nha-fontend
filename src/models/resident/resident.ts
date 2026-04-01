import { createResident, deleteResident, getAllResident, getResidentById, updateResident } from "@/services/Resident"
import { useState } from "react"

export default () => {
  const [infoAllResident, setInfoAllResident] = useState<MResident.IRecord[]>([])
  const [loadingInfoAllResident, setLoadingInfoAllResident] = useState<boolean>(false)

  const [infoResident, setInfoResident] = useState<MResident.IRecord>()
  const [loadingInfoResident, setLoadingInfoResident] = useState<boolean>(false)

  const [refreshKey, setRefreshKey] = useState(0)

  const refreshResidents = () => {
    setRefreshKey(prev => prev + 1)
  }

  const handleGetInfoAllResident = async () => {
    setLoadingInfoAllResident(true)
    try {
      const res = await getAllResident()
      setInfoAllResident(res?.data || [])
      return res?.data
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoAllResident(false)
    }
  }

  const handleGetInfoResident = async (id: string) => {
    setLoadingInfoResident(true)
    try {
      const res = await getResidentById(id)
      setInfoResident(res?.data)
      return res?.data
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoResident(false)
    }
  }

  const handleCreateResident = async (data: MResident.IRecord) => {
    setLoadingInfoResident(true)
    try {
      const res = await createResident(data)
      if (res) {
        return res?.data
      }
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoResident(false)
      refreshResidents()
    }
  }

  const handleUpdateResident = async (id: string, data: MResident.IRecord) => {
    setLoadingInfoResident(true)
    try {
      const res = await updateResident(id, data)
      if (res) {
        return res?.data
      }
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoResident(false)
      refreshResidents()
    }
  }

  const handleDeleteResident = async (id: string) => {
    setLoadingInfoResident(true)
    try {
      const res = await deleteResident(id)
      if (res) {
        return res?.data
      }
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoResident(false)
      refreshResidents()
    }
  }

  return {
    refreshKey,
    infoAllResident,
    loadingInfoAllResident,
    infoResident,
    loadingInfoResident,
    handleGetInfoAllResident,
    handleGetInfoResident,
    handleCreateResident,
    handleUpdateResident,
    handleDeleteResident,
  }
}
