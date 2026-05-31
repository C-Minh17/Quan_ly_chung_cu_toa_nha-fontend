import TableStaticData from "@/components/Table/TableStaticData";
import { IColumn } from "@/components/Table/typing";
import { useModel } from "@umijs/max";
import { DeleteOutlined, EditOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tag, Tooltip, Typography, message, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import FormAmenity from './components/FormAmenity';

const { Title } = Typography;

const BOOKING_STATUS_COLOR: Record<string, string> = {
	pending: 'gold', approved: 'green', rejected: 'volcano', cancelled: 'default',
};

const BOOKING_STATUS_LABEL: Record<string, string> = {
	pending: 'Chờ duyệt', approved: 'Đã duyệt', rejected: 'Từ chối', cancelled: 'Đã hủy',
};

const ManagerAmenity = () => {
	const {
		refreshKey: refreshAmenity,
		infoAllAmenity,
		loadingInfoAllAmenity,
		handleGetAllAmenities,
		handleDeleteAmenity,
	} = useModel("tienich.amenity");

	const {
		refreshKey: refreshBooking,
		infoAllAmenityBooking,
		loadingInfoAllAmenityBooking,
		handleGetAllAmenityBookings,
		handleUpdateAmenityBookingStatus,
		handleDeleteAmenityBooking,
	} = useModel("amenityBooking.amenityBooking");

	const { infoAllUser, handleGetInfoAllUser } = useModel("user.user");

	const [showEditAmenity, setShowEditAmenity] = useState(false);
	const [recordAmenity, setRecordAmenity] = useState<MAmenity.IRecord | {}>({});
	const [editAmenity, setEditAmenity] = useState(false);

	const amenityColumns: IColumn<MAmenity.IRecord>[] = [
		{
			title: "Mã Tiện ích",
			align: "center",
			dataIndex: "amenities_code",
			width: 120,
			filterType: "string",
			sortable: true,
		},
		{
			title: "Tên tiện ích",
			dataIndex: "name",
			width: 180,
			filterType: "string",
		},
		{
			title: "Mô tả",
			dataIndex: "description",
			width: 200,
			filterType: "string",
		},
		{
			title: "Sức chứa",
			dataIndex: "capacity",
			width: 150,
		},
		{
			title: "Giờ hoạt động",
			align: "center",
			width: 150,
			render: (_: any, r: MAmenity.IRecord) => {
				if (r.open_time && r.close_time) {
					return `${new Date(r.open_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - ${new Date(r.close_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
				}
				return "Chưa thiết lập";
			}
		},
		{
			title: "Trạng thái",
			align: "center",
			dataIndex: "is_active",
			width: 130,
			render: (v: boolean) => (
				<Tag color={v ? 'green' : 'red'}>{v ? 'Đang hoạt động' : 'Bảo trì / Đóng'}</Tag>
			),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (r: MAmenity.IRecord) => (
				<>
					<Tooltip title="Chỉnh sửa">
						<Button
							type="link"
							icon={<EditOutlined />}
							onClick={() => {
								setRecordAmenity(r);
								setShowEditAmenity(true);
								setEditAmenity(true);
							}}
						/>
					</Tooltip>
					<Tooltip title="Xóa">
						<Popconfirm
							title="Bạn có chắc muốn xóa?"
							placement="topLeft"
							onConfirm={() => {
								handleDeleteAmenity(r._id as string).then(() => {
									handleGetAllAmenities();
								});
							}}
						>
							<Button danger type="link" icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

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
			width: 150,
			render: (_: any, r: MAmenityBooking.IRecord) => {
				const amenity = infoAllAmenity?.find(a => a._id === (r.amenity_id?._id || r.amenity_id));
				return amenity ? amenity.name : 'N/A';
			},
		},
		{
			title: "Cư dân",
			width: 150,
			render: (_: any, r: MAmenityBooking.IRecord & { resident?: any }) => {
				const userId = r.resident?.user_id;
				const user = infoAllUser?.find((u: any) => u._id === userId);
				return user ? user.name : 'N/A';
			},
		},
		{
			title: "Ngày đặt",
			align: "center",
			dataIndex: "booking_date",
			width: 120,
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
			width: 160,
			fixed: 'right',
			render: (r: MAmenityBooking.IRecord) => (
				<>
					{r.status === 'pending' && (
						<>
							<Tooltip title="Duyệt yêu cầu">
								<Popconfirm
									title="Duyệt yêu cầu đặt chỗ này?"
									placement="topLeft"
									onConfirm={() => {
										handleUpdateAmenityBookingStatus((r._id || r.id) as string, 'approved').then(() => {
											handleGetAllAmenityBookings();
										});
									}}
								>
									<Button type="link" style={{ color: 'green' }} icon={<CheckCircleOutlined />} />
								</Popconfirm>
							</Tooltip>
							<Tooltip title="Từ chối yêu cầu">
								<Popconfirm
									title="Từ chối yêu cầu đặt chỗ này?"
									placement="topLeft"
									onConfirm={() => {
										handleUpdateAmenityBookingStatus((r._id || r.id) as string, 'rejected').then(() => {
											handleGetAllAmenityBookings();
										});
									}}
								>
									<Button type="link" danger icon={<CloseCircleOutlined />} />
								</Popconfirm>
							</Tooltip>
						</>
					)}
					<Tooltip title="Xóa">
						<Popconfirm
							title="Bạn có chắc muốn xóa?"
							placement="topLeft"
							onConfirm={() => {
								handleDeleteAmenityBooking((r._id || r.id) as string).then(() => {
									handleGetAllAmenityBookings();
								});
							}}
						>
							<Button danger type="link" icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	useEffect(() => {
		handleGetAllAmenities();
		handleGetInfoAllUser();
	}, [refreshAmenity]);

	useEffect(() => {
		handleGetAllAmenityBookings();
	}, [refreshBooking]);

	const items = [
		{
			key: '1',
			label: 'Danh sách Tiện ích',
			children: (
				<TableStaticData
					columns={amenityColumns}
					data={infoAllAmenity || []}
					loading={loadingInfoAllAmenity}
					showEdit={showEditAmenity}
					hasCreate={true}
					onReload={() => handleGetAllAmenities()}
					Form={FormAmenity}
					formProps={{
						initialValues: recordAmenity,
						setShowEdit: setShowEditAmenity,
						edit: editAmenity,
					}}
					setShowEdit={(val) => {
						setShowEditAmenity(val);
						if (!val) { setRecordAmenity({}); setEditAmenity(false); }
					}}
					widthDrawer={600}
					addStt
				/>
			),
		},
		{
			key: '2',
			label: 'Quản lý Đặt chỗ',
			children: (
				<TableStaticData
					columns={bookingColumns}
					data={infoAllAmenityBooking || []}
					loading={loadingInfoAllAmenityBooking}
					hasCreate={false}
					onReload={() => handleGetAllAmenityBookings()}
					widthDrawer={600}
					addStt
				/>
			),
		},
	];

	return (
		<>
			<Title level={2} style={{ marginTop: 10, marginBottom: 24 }}>Quản lý tiện ích</Title>
			<Tabs defaultActiveKey="1" items={items} />
		</>
	);
};

export default ManagerAmenity;
