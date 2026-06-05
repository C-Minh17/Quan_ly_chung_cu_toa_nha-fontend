import { getUtilityReadings, getUtilityReadingById, createUtilityReading, updateUtilityReading, deleteUtilityReading } from "@/services/UtilityReading"
import { useState } from "react"

export default () => {
  const [infoAllUtilityReading, setInfoAllUtilityReading] = useState<MUtilityReading.IRecord[]>([])
  const [loadingInfoAllUtilityReading, setLoadingInfoAllUtilityReading] = useState<boolean>(false)

  const [infoUtilityReading, setInfoUtilityReading] = useState<MUtilityReading.IRecord>()
  const [loadingInfoUtilityReading, setLoadingInfoUtilityReading] = useState<boolean>(false)

  const [refreshKey, setRefreshKey] = useState(0)

  const refreshUtilityReadings = () => {
    setRefreshKey(prev => prev + 1)
  }

  const handleGetInfoAllUtilityReading = async (params?: any) => {
    setLoadingInfoAllUtilityReading(true)
    try {
      const res = await getUtilityReadings(params)
      setInfoAllUtilityReading(res?.data || [])
      return res?.data
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoAllUtilityReading(false)
    }
  }

  const handleGetInfoUtilityReading = async (id: string) => {
    setLoadingInfoUtilityReading(true)
    try {
      const res = await getUtilityReadingById(id)
      setInfoUtilityReading(res?.data)
      return res?.data
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoUtilityReading(false)
    }
  }

  const handleCreateUtilityReading = async (data: any) => {
    setLoadingInfoUtilityReading(true)
    try {
      const res = await createUtilityReading(data)
      if (res) {
        return res?.data
      }
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoUtilityReading(false)
      refreshUtilityReadings()
    }
  }

  const handleUpdateUtilityReading = async (id: string, data: any) => {
    setLoadingInfoUtilityReading(true)
    try {
      const res = await updateUtilityReading(id, data)
      if (res) {
        return res?.data
      }
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoUtilityReading(false)
      refreshUtilityReadings()
    }
  }

  const handleDeleteUtilityReading = async (id: string) => {
    setLoadingInfoUtilityReading(true)
    try {
      const res = await deleteUtilityReading(id)
      if (res) {
        return res?.data
      }
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoUtilityReading(false)
      refreshUtilityReadings()
    }
  }

  return {
    refreshKey,
    infoAllUtilityReading,
    loadingInfoAllUtilityReading,
    infoUtilityReading,
    loadingInfoUtilityReading,
    handleGetInfoAllUtilityReading,
    handleGetInfoUtilityReading,
    handleCreateUtilityReading,
    handleUpdateUtilityReading,
    handleDeleteUtilityReading,
  }
}
