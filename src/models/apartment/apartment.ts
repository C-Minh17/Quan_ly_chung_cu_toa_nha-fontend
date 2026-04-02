import { createApartment, deleteApartment, getAllApartment, getApartmentById, updateApartment, updateApartmentStatus } from "@/services/Apartment"
import { useState } from "react"

export default () => {
  const [infoAllApartment, setInfoAllApartment] = useState<MApartment.IRecord[]>([])
  const [loadingInfoAllApartment, setLoadingInfoAllApartment] = useState<boolean>(false)

  const [infoApartment, setInfoApartment] = useState<MApartment.IRecord>()
  const [loadingInfoApartment, setLoadingInfoApartment] = useState<boolean>(false)

  const [refreshKey, setRefreshKey] = useState(0)

  const refreshApartments = () => {
    setRefreshKey(prev => prev + 1)
  }

  const handleGetInfoAllApartment = async () => {
    setLoadingInfoAllApartment(true)
    try {
      const res = await getAllApartment()
      setInfoAllApartment(res?.data || [])
      return res?.data
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoAllApartment(false)
    }
  }

  const handleGetInfoApartment = async (id: string) => {
    setLoadingInfoApartment(true)
    try {
      const res = await getApartmentById(id)
      setInfoApartment(res?.data)
      return res?.data
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoApartment(false)
    }
  }

  const handleCreateApartment = async (data: MApartment.IRecord) => {
    setLoadingInfoApartment(true)
    try {
      const res = await createApartment(data)
      if (res) {
        return res?.data
      }
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoApartment(false)
      refreshApartments()
    }
  }

  const handleUpdateApartment = async (id: string, data: MApartment.IRecord) => {
    setLoadingInfoApartment(true)
    try {
      const res = await updateApartment(id, data)
      if (res) {
        return res?.data
      }
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoApartment(false)
      refreshApartments()
    }
  }

  const handleDeleteApartment = async (id: string) => {
    setLoadingInfoApartment(true)
    try {
      const res = await deleteApartment(id)
      if (res) {
        return res?.data
      }
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoApartment(false)
      refreshApartments()
    }
  }

  const handleUpdateApartmentStatus = async (id: string, status: string) => {
    setLoadingInfoApartment(true)
    try {
      const res = await updateApartmentStatus(id, status)
      if (res) {
        return res?.data
      }
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoApartment(false)
      refreshApartments()
    }
  }

  return {
    refreshKey,
    infoAllApartment,
    loadingInfoAllApartment,
    infoApartment,
    loadingInfoApartment,
    handleGetInfoAllApartment,
    handleGetInfoApartment,
    handleCreateApartment,
    handleUpdateApartment,
    handleDeleteApartment,
    handleUpdateApartmentStatus
  }
}
