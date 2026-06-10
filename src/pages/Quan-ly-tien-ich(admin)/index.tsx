import TableStaticData from "@/components/Table/TableStaticData";
import { IColumn } from "@/components/Table/typing";
import { AppstoreAddOutlined, CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined, EditOutlined, FilterOutlined } from '@ant-design/icons';
import { useModel } from "@umijs/max";
import { Badge, Button, Divider, Input, Popconfirm, Tabs, Tag, Tooltip, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import FilterBar from './components/FilterBar';
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
	const [searchAmenity, setSearchAmenity] = useState("");
	const [searchBooking, setSearchBooking] = useState("");
	const [statusBooking, setStatusBooking] = useState("all");
	const [amenityBooking, setAmenityBooking] = useState("all");

	const [activeTab, setActiveTab] = useState("1");
	const [filterModalVisible, setFilterModalVisible] = useState(false);
	const [portalContainer, setPortalContainer] = useState<Element | null>(null);

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

	useEffect(() => {
		if (activeTab !== "2") {
			setPortalContainer(null);
			return;
		}

		const findAndInsert = () => {
			const activePane = document.querySelector('.ant-tabs-tabpane:not(.ant-tabs-tabpane-hidden)');
			if (!activePane) return;
			const reloadIcon = activePane.querySelector('.table-base .header .extra .anticon-reload');
			const reloadBtn = reloadIcon?.closest('button') || reloadIcon?.closest('.ant-btn');

			if (reloadBtn) {
				let placeholder = document.getElementById('filter-btn-placeholder-quan-ly-tien-ich-booking');
				if (!placeholder) {
					placeholder = document.createElement('span');
					placeholder.id = 'filter-btn-placeholder-quan-ly-tien-ich-booking';
					placeholder.style.display = 'inline-flex';
					placeholder.style.marginRight = '8px';
					reloadBtn.parentNode?.insertBefore(placeholder, reloadBtn);
				}
				setPortalContainer(placeholder);
			}
		};

		findAndInsert();
		const timer = setTimeout(findAndInsert, 500);
		return () => clearTimeout(timer);
	}, [activeTab, infoAllAmenityBooking, loadingInfoAllAmenityBooking]);

	const filteredAmenities = useMemo(() => {
		let data = infoAllAmenity || [];
		const keyword = searchAmenity.trim().toLowerCase();
		if (keyword) {
			data = data.filter(item =>
				[item.name, item.amenities_code, item.description]
					.filter(Boolean)
					.some((val: any) => val.toString().toLowerCase().includes(keyword))
			);
		}
		return data;
	}, [infoAllAmenity, searchAmenity]);

	const filteredBookings = useMemo(() => {
		let data = infoAllAmenityBooking || [];

		// Filter by status
		if (statusBooking !== "all") {
			data = data.filter(item => item.status === statusBooking);
		}

		// Filter by amenity
		if (amenityBooking !== "all") {
			data = data.filter(item => {
				const aId = item.amenity_id?._id || item.amenity_id;
				return aId === amenityBooking;
			});
		}

		// Search filter
		const keyword = searchBooking.trim().toLowerCase();
		if (keyword) {
			data = data.filter((item: any) => {
				const residentUserId = item.resident?.user_id;
				const residentUser = infoAllUser?.find((u: any) => u._id === residentUserId);
				const residentName = residentUser?.name || '';

				const amenity = infoAllAmenity?.find(a => a._id === (item.amenity_id?._id || item.amenity_id));
				const amenityName = amenity?.name || '';

				return [item.amenities_code, residentName, amenityName]
					.filter(Boolean)
					.some((val: any) => val.toString().toLowerCase().includes(keyword));
			});
		}

		return data;
	}, [infoAllAmenityBooking, searchBooking, statusBooking, amenityBooking, infoAllUser, infoAllAmenity]);

	const isFilterActive = statusBooking !== "all" || amenityBooking !== "all";

	const items = [
		{
			key: '1',
			label: 'Danh sách Tiện ích',
			children: (
				<>
					<div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 20, marginTop: 10 }}>
						<Input.Search
							allowClear
							placeholder="Tìm kiếm theo mã, tên tiện ích..."
							value={searchAmenity}
							onChange={(e) => setSearchAmenity(e.target.value)}
							onSearch={setSearchAmenity}
							style={{ width: 400, maxWidth: '100%' }}
						/>
					</div>
					<TableStaticData
						columns={amenityColumns}
						data={filteredAmenities}
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
						onClickAdd={() => {
							setRecordAmenity({});
							setEditAmenity(false);
						}}
						setShowEdit={(val) => {
							setShowEditAmenity(val);
							if (!val) { setRecordAmenity({}); setEditAmenity(false); }
						}}
						widthDrawer={600}
						addStt
					/>
				</>
			),
		},
		{
			key: '2',
			label: 'Quản lý Đặt chỗ',
			children: (
				<>
					<div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 20, marginTop: 10 }}>
						<Input.Search
							allowClear
							placeholder="Tìm kiếm theo mã đặt chỗ, cư dân, tiện ích..."
							value={searchBooking}
							onChange={(e) => setSearchBooking(e.target.value)}
							onSearch={setSearchBooking}
							style={{ width: 400, maxWidth: '100%' }}
						/>
					</div>

					{portalContainer && createPortal(
						<Tooltip title="Bộ lọc tùy chỉnh">
							<Badge dot={isFilterActive} offset={[-2, 2]}>
								<Button
									icon={<FilterOutlined />}
									onClick={() => setFilterModalVisible(true)}
									style={{
										display: 'inline-flex',
										alignItems: 'center',
										borderRadius: 6,
									}}
								>
									Bộ lọc
								</Button>
							</Badge>
						</Tooltip>,
						portalContainer
					)}

					<FilterBar
						visible={filterModalVisible}
						onCancel={() => setFilterModalVisible(false)}
						onApply={(values) => {
							setStatusBooking(values.statusFilter);
							setAmenityBooking(values.amenityFilter);
							setFilterModalVisible(false);
						}}
						statusFilter={statusBooking}
						amenityFilter={amenityBooking}
						amenities={infoAllAmenity || []}
					/>

					<TableStaticData
						columns={bookingColumns}
						data={filteredBookings}
						loading={loadingInfoAllAmenityBooking}
						hasCreate={false}
						onReload={() => handleGetAllAmenityBookings()}
						widthDrawer={600}
						addStt
					/>
				</>
			),
		},
	];

	return (
		<>
			<div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, gap: 16 }}>
				<div style={{
					width: 50, height: 50,
					backgroundColor: '#e6f4ff',
					borderRadius: 12,
					display: 'flex', alignItems: 'center', justifyContent: 'center',
				}}>
					<AppstoreAddOutlined style={{ fontSize: 22, color: '#1677ff' }} />
				</div>
				<div>
					<Title level={3} style={{ margin: 0 }}>Quản lý tiện ích</Title>
					<div style={{ color: '#8c8c8c', fontSize: 14, marginTop: 4 }}>
						Quản lý danh sách các tiện ích chung và các lượt đặt chỗ của cư dân
					</div>
				</div>
			</div>

			<Divider style={{ margin: '5px 0 20px' }} />

			<Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
		</>
	);
};

export default ManagerAmenity;
