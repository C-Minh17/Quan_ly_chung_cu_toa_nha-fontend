import { createAmenity, deleteAmenity, getAllAmenities, getAmenityById, updateAmenity, getAmenitySchedule } from "@/services/Amenity";
import { message } from "antd";
import { useState } from "react";

export default () => {
	const [infoAllAmenity, setInfoAllAmenity] = useState<MAmenity.IRecord[]>([]);
	const [loadingInfoAllAmenity, setLoadingInfoAllAmenity] = useState<boolean>(false);
	const [refreshKey, setRefreshKey] = useState<number>(0);

	const handleGetAllAmenities = async (params?: any) => {
		setLoadingInfoAllAmenity(true);
		try {
			const res = await getAllAmenities(params);
			if (res?.data?.data) {
				setInfoAllAmenity(res.data.data);
			} else {
				setInfoAllAmenity(res?.data || []);
			}
		} catch (error) {
			console.log(error);
		}
		setLoadingInfoAllAmenity(false);
	};

	const handleGetAmenityById = async (id: string) => {
		try {
			const res = await getAmenityById(id);
			return res?.data;
		} catch (error) {
			console.log(error);
		}
	};

	const handleCreateAmenity = async (data: MAmenity.IRecord) => {
		try {
			const res = await createAmenity(data);
			message.success("Thêm tiện ích thành công");
			setRefreshKey(prev => prev + 1);
			return res;
		} catch (error: any) {
			console.log(error);
			message.error(error?.response?.data?.message || "Thêm tiện ích thất bại");
			throw error;
		}
	};

	const handleUpdateAmenity = async (id: string, data: MAmenity.IRecord) => {
		try {
			const res = await updateAmenity(id, data);
			message.success("Cập nhật tiện ích thành công");
			setRefreshKey(prev => prev + 1);
			return res;
		} catch (error: any) {
			console.log(error);
			message.error(error?.response?.data?.message || "Cập nhật tiện ích thất bại");
			throw error;
		}
	};

	const handleDeleteAmenity = async (id: string) => {
		try {
			const res = await deleteAmenity(id);
			message.success("Xóa tiện ích thành công");
			setRefreshKey(prev => prev + 1);
			return res;
		} catch (error: any) {
			console.log(error);
			message.error(error?.response?.data?.message || "Xóa tiện ích thất bại");
			throw error;
		}
	};

	const handleGetAmenitySchedule = async (id: string, date: string) => {
		try {
			const res = await getAmenitySchedule(id, { date });
			return res?.data;
		} catch (error) {
			console.log(error);
		}
	}

	return {
		infoAllAmenity,
		loadingInfoAllAmenity,
		refreshKey,
		handleGetAllAmenities,
		handleGetAmenityById,
		handleCreateAmenity,
		handleUpdateAmenity,
		handleDeleteAmenity,
		handleGetAmenitySchedule,
	};
};
