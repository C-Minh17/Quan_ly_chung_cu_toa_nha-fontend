import { createUser, deleteUser, getAllUser, getUserById, updateUser } from "@/services/User"
import { useState } from "react"

export default () => {
  const [infoAllUser, setInfoAllUser] = useState<MUser.IRecord[]>([])
  const [infoAllUserFilter, setInfoAllUserFilter] = useState<MUser.IRecord[]>([])
  const [loadingInfoAllUser, setLoadingInfoAllUser] = useState<boolean>(false)

  const [infoUser, setInfoUser] = useState<MUser.IRecord>()
  const [loadingInfoUser, setLoadingInfoUser] = useState<boolean>(false)

  const [refreshKey, setRefreshKey] = useState(0)

  const refreshUsers = () => {
    setRefreshKey(prev => prev + 1)
  }

  const handleGetInfoAllUser = async () => {
    setLoadingInfoAllUser(true)
    try {
      const res = await getAllUser()
      setInfoAllUser(res?.data)
      const data = res?.data?.filter((item: MUser.IRecord) => item.role !== 'SUPER_ADMIN' && item.role !== 'MANAGER')
      setInfoAllUserFilter(data)
      return res?.data
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoAllUser(false)
    }
  }

  const handleGetInfoUser = async (id: string) => {
    setLoadingInfoUser(true)
    try {
      const res = await getUserById(id)
      setInfoUser(res?.data)
      return res?.data
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoUser(false)
    }
  }

  const handleCreateUser = async (data: MUser.IRecord) => {
    setLoadingInfoUser(true)
    try {
      const res = await createUser(data)
      if (res) {
        return res?.data
      }
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoUser(false)
      refreshUsers()
    }
  }

  const handleUpdateUser = async (id: string, data: MUser.IRecord) => {
    setLoadingInfoUser(true)
    try {
      const res = await updateUser(id, data)
      if (res) {
        return res?.data
      }
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoUser(false)
      refreshUsers()
    }
  }

  const handleDeleteUser = async (id: string) => {
    setLoadingInfoUser(true)
    try {
      const res = await deleteUser(id)
      if (res) {
        return res?.data
      }
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoUser(false)
      refreshUsers()
    }
  }

  return {
    refreshKey,
    infoAllUser,
    infoAllUserFilter,
    loadingInfoAllUser,
    infoUser,
    loadingInfoUser,
    handleGetInfoAllUser,
    handleGetInfoUser,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
  }

}