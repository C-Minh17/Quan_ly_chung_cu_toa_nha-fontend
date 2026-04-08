import {
  createContract,
  getContractById,
  getContracts,
  getMyContracts,
  terminateContract,
  updateContract
} from "@/services/Contract"
import { useState } from "react"

export default () => {
  const [infoAllContract, setInfoAllContract] = useState<MContract.IRecord[]>([])
  const [loadingInfoAllContract, setLoadingInfoAllContract] = useState<boolean>(false)

  const [infoContract, setInfoContract] = useState<MContract.IRecord>()
  const [loadingInfoContract, setLoadingInfoContract] = useState<boolean>(false)

  const [refreshKey, setRefreshKey] = useState(0)

  const refreshContracts = () => {
    setRefreshKey(prev => prev + 1)
  }

  const handleGetInfoAllContract = async (params: any = {}) => {
    setLoadingInfoAllContract(true)
    try {
      const res = await getContracts(params)
      setInfoAllContract(res?.data || [])
      return res?.data
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoAllContract(false)
    }
  }

  const handleGetInfoContract = async (id: string) => {
    setLoadingInfoContract(true)
    try {
      const res = await getContractById(id)
      setInfoContract(res?.data)
      return res?.data
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoContract(false)
    }
  }

  const handleCreateContract = async (data: MContract.IRecord) => {
    setLoadingInfoContract(true)
    try {
      const res = await createContract(data)
      if (res) {
        return res?.data
      }
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoContract(false)
      refreshContracts()
    }
  }

  const handleUpdateContract = async (id: string, data: MContract.IRecord) => {
    setLoadingInfoContract(true)
    try {
      const res = await updateContract(id, data)
      if (res) {
        return res?.data
      }
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoContract(false)
      refreshContracts()
    }
  }

  const handleTerminateContract = async (id: string) => {
    setLoadingInfoContract(true)
    try {
      const res = await terminateContract(id)
      if (res) {
        return res?.data
      }
      return null
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoContract(false)
      refreshContracts()
    }
  }

  const handleGetMyContracts = async () => {
    setLoadingInfoAllContract(true)
    try {
      const res = await getMyContracts()
      setInfoAllContract(res?.data || [])
      return res?.data
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingInfoAllContract(false)
    }
  }

  return {
    refreshKey,
    infoAllContract,
    loadingInfoAllContract,
    infoContract,
    loadingInfoContract,
    handleGetInfoAllContract,
    handleGetInfoContract,
    handleCreateContract,
    handleUpdateContract,
    handleTerminateContract,
    handleGetMyContracts,
    refreshContracts
  }
}
