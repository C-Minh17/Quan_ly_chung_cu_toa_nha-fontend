import { createAmenityBooking, deleteAmenityBooking, getAllAmenityBookings, getMyAmenityBookings, updateAmenityBookingStatus, cancelAmenityBooking } from "@/services/AmenityBooking";
import { message } from "antd";
import { useState } from "react";

export default () => {
	const [infoAllAmenityBooking, setInfoAllAmenityBooking] = useState<MAmenityBooking.IRecord[]>([]);
	const [loadingInfoAllAmenityBooking, setLoadingInfoAllAmenityBooking] = useState<boolean>(false);
	const [refreshKey, setRefreshKey] = useState<number>(0);

	const handleGetAllAmenityBookings = async (params?: any) => {
		setLoadingInfoAllAmenityBooking(true);
		try {
			const res = await getAllAmenityBookings(params);
			if (res?.data?.data) {
				setInfoAllAmenityBooking(res.data.data);
			} else {
				setInfoAllAmenityBooking(res?.data || []);
			}
		} catch (error) {
			console.log(error);
		}
		setLoadingInfoAllAmenityBooking(false);
	};

	const handleGetMyAmenityBookings = async (params?: any) => {
		setLoadingInfoAllAmenityBooking(true);
		try {
			const res = await getMyAmenityBookings(params);
			if (res?.data?.data) {
				setInfoAllAmenityBooking(res.data.data);
			} else {
				setInfoAllAmenityBooking(res?.data || []);
			}
		} catch (error) {
			console.log(error);
		}
		setLoadingInfoAllAmenityBooking(false);
	};

	const handleCreateAmenityBooking = async (data: MAmenityBooking.IRecord) => {
		try {
			const res = await createAmenityBooking(data);
			message.success("Đặt tiện ích thành công");
			setRefreshKey(prev => prev + 1);
			return res;
		} catch (error: any) {
			console.log(error);
			message.error(error?.response?.data?.message || "Đặt tiện ích thất bại");
			throw error;
		}
	};

	const handleUpdateAmenityBookingStatus = async (id: string, status: string) => {
		try {
			const res = await updateAmenityBookingStatus(id, status);
			message.success("Cập nhật trạng thái thành công");
			setRefreshKey(prev => prev + 1);
			return res;
		} catch (error: any) {
			console.log(error);
			message.error(error?.response?.data?.message || "Cập nhật trạng thái thất bại");
			throw error;
		}
	};

	const handleCancelAmenityBooking = async (id: string) => {
		try {
			const res = await cancelAmenityBooking(id);
			message.success("Hủy đặt tiện ích thành công");
			setRefreshKey(prev => prev + 1);
			return res;
		} catch (error: any) {
			console.log(error);
			message.error(error?.response?.data?.message || "Hủy đặt tiện ích thất bại");
			throw error;
		}
	};

	const handleDeleteAmenityBooking = async (id: string) => {
		try {
			const res = await deleteAmenityBooking(id);
			message.success("Xóa đặt chỗ thành công");
			setRefreshKey(prev => prev + 1);
			return res;
		} catch (error: any) {
			console.log(error);
			message.error(error?.response?.data?.message || "Xóa đặt chỗ thất bại");
			throw error;
		}
	};


	return {
		infoAllAmenityBooking,
		loadingInfoAllAmenityBooking,
		refreshKey,
		handleGetAllAmenityBookings,
		handleGetMyAmenityBookings,
		handleCreateAmenityBooking,
		handleUpdateAmenityBookingStatus,
		handleCancelAmenityBooking,
		handleDeleteAmenityBooking,
	};
};
