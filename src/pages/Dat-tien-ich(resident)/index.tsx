import TableStaticData from "@/components/Table/TableStaticData";
import { IColumn } from "@/components/Table/typing";
import { useModel } from "@umijs/max";
import { DeleteOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tag, Tooltip, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import FormBooking from './components/FormBooking';

const { Title } = Typography;

const BOOKING_STATUS_COLOR: Record<string, string> = {
	pending: 'gold', approved: 'green', rejected: 'volcano', cancelled: 'default',
};

const BOOKING_STATUS_LABEL: Record<string, string> = {
	pending: 'Chờ duyệt', approved: 'Đã duyệt', rejected: 'Từ chối', cancelled: 'Đã hủy',
};

const ResidentAmenityBooking = () => {
	const {
		refreshKey: refreshBooking,
		infoAllAmenityBooking,
		loadingInfoAllAmenityBooking,
		handleGetMyAmenityBookings,
		handleCancelAmenityBooking,
		handleDeleteAmenityBooking,
	} = useModel("amenityBooking.amenityBooking");

	const { infoAllAmenity, handleGetAllAmenities } = useModel("tienich.amenity");

	const [showBookingModal, setShowBookingModal] = useState(false);

	const bookingColumns: IColumn<MAmenityBooking.IRecord>[] = [
		{
			title: "Mã Đặt chỗ",
			align: "center",
			dataIndex: "amenities_code",
			width: 120,
			filterType: "string",
			sortable: true,
		},
		{
			title: "Tiện ích",
			width: 180,
			render: (_: any, r: MAmenityBooking.IRecord) => {
				const amenity = infoAllAmenity?.find(a => a._id === (r.amenity_id?._id || r.amenity_id));
				return amenity ? amenity.name : 'N/A';
			},
		},
		{
			title: "Ngày đặt",
			align: "center",
			dataIndex: "booking_date",
			width: 130,
			render: (v: string) => v ? new Date(v).toLocaleDateString('vi-VN') : '',
		},
		{
			title: "Thời gian",
			align: "center",
			width: 130,
			render: (_: any, r: MAmenityBooking.IRecord) => {
				const sTime = r.start_time ? new Date(r.start_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '';
				const eTime = r.end_time ? new Date(r.end_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '';
				return `${sTime} - ${eTime}`;
			},
		},
		{
			title: "Số người",
			align: "center",
			dataIndex: "num_people",
			width: 100,
		},
		{
			title: "Trạng thái",
			align: "center",
			dataIndex: "status",
			width: 130,
			filterType: "string",
			render: (v: string) => <Tag color={BOOKING_STATUS_COLOR[v]}>{BOOKING_STATUS_LABEL[v] || v}</Tag>,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (r: MAmenityBooking.IRecord) => (
				<>
					{r.status === 'pending' && (
						<Tooltip title="Hủy đặt chỗ">
							<Popconfirm
								title="Bạn có chắc muốn hủy đặt chỗ này?"
								placement="topLeft"
								onConfirm={() => {
									handleCancelAmenityBooking((r._id || r.id) as string).then(() => {
										handleGetMyAmenityBookings();
									});
								}}
							>
								<Button type="link" icon={<CloseCircleOutlined />} />
							</Popconfirm>
						</Tooltip>
					)}
					<Tooltip title="Xóa">
						<Popconfirm
							title="Bạn có chắc muốn xóa lịch sử này?"
							placement="topLeft"
							onConfirm={() => {
								handleDeleteAmenityBooking((r._id || r.id) as string).then(() => {
									handleGetMyAmenityBookings();
								});
							}}
							disabled={r.status === 'pending' || r.status === 'approved'}
						>
							<Button danger type="link" icon={<DeleteOutlined />} disabled={r.status === 'pending' || r.status === 'approved'} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	useEffect(() => {
		handleGetAllAmenities();
	}, []);

	useEffect(() => {
		handleGetMyAmenityBookings();
	}, [refreshBooking]);

	return (
		<>
			<Title level={2} style={{ marginTop: 10, marginBottom: 24 }}>Lịch sử đặt tiện ích</Title>
			<TableStaticData
				columns={bookingColumns}
				data={infoAllAmenityBooking || []}
				loading={loadingInfoAllAmenityBooking}
				showEdit={showBookingModal}
				hasCreate={true}
				onReload={() => handleGetMyAmenityBookings()}
				Form={FormBooking}
				formProps={{
					setShowEdit: setShowBookingModal,
				}}
				setShowEdit={(val) => {
					setShowBookingModal(val);
				}}
				widthDrawer={600}
				addStt
			/>
		</>
	);
};

export default ResidentAmenityBooking;
