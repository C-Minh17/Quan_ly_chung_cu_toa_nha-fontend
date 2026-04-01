import { createFloor, deleteFloor, getAllFloor, getFloorById, updateFloor, getFloorLayout } from "@/services/Floor"
import { useState } from "react"

export default () => {
  const [infoAllFloor, setInfoAllFloor] = useState<MFloor.IRecord[]>([])
  const [loadingInfoAllFloor, setLoadingInfoAllFloor] = useState<boolean>(false)

  const [infoFloor, setInfoFloor] = useState<MFloor.IRecord>()
  const [loadingInfoFloor, setLoadingInfoFloor] = useState<boolean>(false)

  const [layoutInfo, setLayoutInfo] = useState<any>()
  const [loadingLayout, setLoadingLayout] = useState<boolean>(false)

  const [refreshKey, setRefreshKey] = useState(0)

  const refreshFloors = () => {
    setRefreshKey(prev => prev + 1)
  }

  const handleGetInfoAllFloor = async () => {
    setLoadingInfoAllFloor(true)
    try {
      const res = await getAllFloor()
      setInfoAllFloor(res?.data || [])
      return res?.data
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoAllFloor(false)
    }
  }

  const handleGetInfoFloor = async (id: string) => {
    setLoadingInfoFloor(true)
    try {
      const res = await getFloorById(id)
      setInfoFloor(res?.data)
      return res?.data
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoFloor(false)
    }
  }

  const handleCreateFloor = async (data: MFloor.IRecord) => {
    setLoadingInfoFloor(true)
    try {
      const res = await createFloor(data)
      if (res) {
        return res?.data
      }
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoFloor(false)
      refreshFloors()
    }
  }

  const handleUpdateFloor = async (id: string, data: MFloor.IRecord) => {
    setLoadingInfoFloor(true)
    try {
      const res = await updateFloor(id, data)
      if (res) {
        return res?.data
      }
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoFloor(false)
      refreshFloors()
    }
  }

  const handleDeleteFloor = async (id: string) => {
    setLoadingInfoFloor(true)
    try {
      const res = await deleteFloor(id)
      if (res) {
        return res?.data
      }
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoFloor(false)
      refreshFloors()
    }
  }

  const handleGetFloorLayout = async (id: string) => {
    setLoadingLayout(true)
    try {
      const res = await getFloorLayout(id)
      setLayoutInfo(res?.data)
      return res?.data
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingLayout(false)
    }
  }

  return {
    refreshKey,
    infoAllFloor,
    loadingInfoAllFloor,
    infoFloor,
    loadingInfoFloor,
    layoutInfo,
    loadingLayout,
    handleGetInfoAllFloor,
    handleGetInfoFloor,
    handleCreateFloor,
    handleUpdateFloor,
    handleDeleteFloor,
    handleGetFloorLayout,
  }
}
