import { activeFeeType, createFeeType, deleteFeeType, getAllFeeType, getFeeTypeById, updateFeeType } from "@/services/FeeType"
import { useState } from "react"

export default () => {
  const [infoAllFeeType, setInfoAllFeeType] = useState<MFeeType.IRecord[]>([])
  const [loadingInfoAllFeeType, setLoadingInfoAllFeeType] = useState<boolean>(false)

  const [infoFeeType, setInfoFeeType] = useState<MFeeType.IRecord>()
  const [loadingInfoFeeType, setLoadingInfoFeeType] = useState<boolean>(false)

  const [refreshKey, setRefreshKey] = useState(0)

  const refreshFeeTypes = () => {
    setRefreshKey(prev => prev + 1)
  }

  const handleGetInfoAllFeeType = async () => {
    setLoadingInfoAllFeeType(true)
    try {
      const res = await getAllFeeType()
      setInfoAllFeeType(res?.data || [])
      return res?.data
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoAllFeeType(false)
    }
  }

  const handleGetInfoFeeType = async (id: string) => {
    setLoadingInfoFeeType(true)
    try {
      const res = await getFeeTypeById(id)
      setInfoFeeType(res?.data)
      return res?.data
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoFeeType(false)
    }
  }

  const handleCreateFeeType = async (data: MFeeType.IRecord) => {
    setLoadingInfoFeeType(true)
    try {
      const res = await createFeeType(data)
      if (res) {
        return res?.data
      }
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoFeeType(false)
      refreshFeeTypes()
    }
  }

  const handleUpdateFeeType = async (id: string, data: MFeeType.IRecord) => {
    setLoadingInfoFeeType(true)
    try {
      const res = await updateFeeType(id, data)
      if (res) {
        return res?.data
      }
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoFeeType(false)
      refreshFeeTypes()
    }
  }

  const handleDeleteFeeType = async (id: string) => {
    setLoadingInfoFeeType(true)
    try {
      const res = await deleteFeeType(id)
      if (res) {
        return res?.data
      }
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoFeeType(false)
      refreshFeeTypes()
    }
  }

  const handleActiveFeeType = async (id: string) => {
    setLoadingInfoFeeType(true)
    try {
      const res = await activeFeeType(id)
      if (res) {
        return res?.data
      }
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoFeeType(false)
      refreshFeeTypes()
    }
  }

  return {
    refreshKey,
    infoAllFeeType,
    loadingInfoAllFeeType,
    infoFeeType,
    loadingInfoFeeType,
    handleGetInfoAllFeeType,
    handleGetInfoFeeType,
    handleCreateFeeType,
    handleUpdateFeeType,
    handleDeleteFeeType,
    handleActiveFeeType
  }
}
