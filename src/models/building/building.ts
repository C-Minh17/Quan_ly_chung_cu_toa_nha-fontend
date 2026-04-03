import { createBuilding, deleteBuilding, getAllBuilding, getBuildingById, updateBuilding } from "@/services/Building"
import { useState } from "react"

export default () => {
  const [infoAllBuilding, setInfoAllBuilding] = useState<MBuilding.IRecord[]>([])
  const [loadingInfoAllBuilding, setLoadingInfoAllBuilding] = useState<boolean>(false)

  const [infoBuilding, setInfoBuilding] = useState<MBuilding.IRecord>()
  const [loadingInfoBuilding, setLoadingInfoBuilding] = useState<boolean>(false)

  const [refreshKey, setRefreshKey] = useState(0)

  const refreshBuildings = () => {
    setRefreshKey(prev => prev + 1)
  }

  const handleGetInfoAllBuilding = async () => {
    setLoadingInfoAllBuilding(true)
    try {
      const res = await getAllBuilding()
      setInfoAllBuilding(res?.data || [])
      return res?.data
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoAllBuilding(false)
    }
  }

  const handleGetInfoBuilding = async (id: string) => {
    setLoadingInfoBuilding(true)
    try {
      const res = await getBuildingById(id)
      setInfoBuilding(res?.data)
      return res?.data
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoBuilding(false)
    }
  }

  const handleCreateBuilding = async (data: MBuilding.IRecord) => {
    setLoadingInfoBuilding(true)
    try {
      const res = await createBuilding(data)
      if (res) {
        return res?.data
      }
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoBuilding(false)
      refreshBuildings()
    }
  }

  const handleUpdateBuilding = async (id: string, data: MBuilding.IRecord) => {
    setLoadingInfoBuilding(true)
    try {
      const res = await updateBuilding(id, data)
      if (res) {
        return res?.data
      }
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoBuilding(false)
      refreshBuildings()
    }
  }

  const handleDeleteBuilding = async (id: string) => {
    setLoadingInfoBuilding(true)
    try {
      const res = await deleteBuilding(id)
      if (res) {
        return res?.data
      }
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoBuilding(false)
      refreshBuildings()
    }
  }

  return {
    refreshKey,
    infoAllBuilding,
    loadingInfoAllBuilding,
    infoBuilding,
    loadingInfoBuilding,
    handleGetInfoAllBuilding,
    handleGetInfoBuilding,
    handleCreateBuilding,
    handleUpdateBuilding,
    handleDeleteBuilding,
  }
}
