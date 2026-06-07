import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import { CloseCircleOutlined, DeleteOutlined, EditOutlined, FilterOutlined, ToolOutlined, UserAddOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Badge, Button, Divider, Form, Input, Modal, Popconfirm, Select, Tag, Tooltip, Typography, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import FormMaintenanceRequest from '../components/FormRequest';
import FilterBar from './components/FilterBar';

const { Title } = Typography;

const CATEGORY_LABEL: Record<string, string> = {
	electrical: 'Điện',
	plumbing: 'Nước',
	structure: 'Kết cấu',
	appliance: 'Thiết bị',
	other: 'Khác',
};

const PRIORITY_COLOR: Record<string, string> = {
	low: 'default',
	medium: 'blue',
	high: 'orange',
	urgent: 'red',
};

const PRIORITY_LABEL: Record<string, string> = {
	low: 'Thấp',
	medium: 'Trung bình',
	high: 'Cao',
	urgent: 'Khẩn cấp',
};

const PRIORITY_OPTIONS = [
	{ value: 'low', label: 'Thấp' },
	{ value: 'medium', label: 'Trung bình' },
	{ value: 'high', label: 'Cao' },
	{ value: 'urgent', label: 'Khẩn cấp' },
];

const REQUEST_STATUS_COLOR: Record<string, string> = {
	new: 'default',
	assigned: 'blue',
	in_progress: 'gold',
	completed: 'green',
	closed: 'volcano',
};

const REQUEST_STATUS_LABEL: Record<string, string> = {
	new: 'Mới',
	assigned: 'Đã phân công',
	in_progress: 'Đang xử lý',
	completed: 'Hoàn thành',
	closed: 'Đã đóng',
};

const MaintenanceRequestPage = () => {
	const {
		refreshKey,
		infoAllMaintenanceRequest,
		loadingInfoAllMaintenanceRequest,
		handleGetAllMaintenanceRequest,
		handleDeleteMaintenanceRequest,
		handleCloseMaintenanceRequest,
		handleAssignMaintenanceRequest,
	} = useModel('maintenanceRequest.maintenanceRequest');

	const { infoAllApartment, handleGetInfoAllApartment } = useModel('apartment.apartment');
	const { infoAllUser, handleGetInfoAllUser } = useModel('user.user');

	const [showEditRequest, setShowEditRequest] = useState(false);
	const [recordRequest, setRecordRequest] = useState<MMaintenanceRequest.IRecord | {}>({});
	const [editRequest, setEditRequest] = useState(false);
	const [searchKeyword, setSearchKeyword] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [priorityFilter, setPrimaryFilter] = useState("all");
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [filterModalVisible, setFilterModalVisible] = useState(false);
	const [portalContainer, setPortalContainer] = useState<Element | null>(null);

	const [showAssignModal, setShowAssignModal] = useState(false);
	const [assignRecord, setAssignRecord] = useState<MMaintenanceRequest.IRecord | null>(null);
	const [assignForm] = Form.useForm();
	const [loadingAssign, setLoadingAssign] = useState(false);

	const staffOptions = infoAllUser
		?.filter((u: any) => u.role === 'STAFF')
		.map((u: any) => ({ value: u._id, label: u.name }));

	const handleOpenAssign = (record: MMaintenanceRequest.IRecord) => {
		setAssignRecord(record);
		assignForm.setFieldsValue({
			assigned_to: (record as any)?.assigned_to?._id || record.assigned_to || undefined,
			priority: record.priority || 'medium',
		});
		setShowAssignModal(true);
	};

	const handleSubmitAssign = async (values: { assigned_to: string; priority: string }) => {
		if (!assignRecord?._id) return;
		setLoadingAssign(true);
		try {
			await handleAssignMaintenanceRequest(assignRecord._id, values);
			message.success('Phân công nhân viên thành công!');
			setShowAssignModal(false);
			assignForm.resetFields();
			handleGetAllMaintenanceRequest();
		} catch {
			message.error('Phân công thất bại, vui lòng thử lại.');
		} finally {
			setLoadingAssign(false);
		}
	};

	const requestColumns: IColumn<MMaintenanceRequest.IRecord>[] = [
		{
			title: 'Mã YC',
			align: 'center',
			dataIndex: 'Maintenance_Requests_code',
			width: 110,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Tiêu đề',
			dataIndex: 'title',
			width: 180,
			filterType: 'string',
		},
		{
			title: 'Căn hộ',
			align: 'center',
			width: 100,
			render: (_: any, r: MMaintenanceRequest.IRecord) => {
				const apt = infoAllApartment?.find((a) => a._id === r.apartment_id);
				return apt?.apartment_code || r.apartment_id || 'N/A';
			},
		},
		{
			title: 'Hạng mục',
			align: 'center',
			dataIndex: 'category',
			width: 100,
			render: (v: string) => CATEGORY_LABEL[v] || v,
		},
		{
			title: 'Ưu tiên',
			align: 'center',
			dataIndex: 'priority',
			width: 110,
			render: (v: string) => <Tag color={PRIORITY_COLOR[v]}>{PRIORITY_LABEL[v] || v}</Tag>,
		},
		{
			title: 'Trạng thái',
			align: 'center',
			dataIndex: 'status',
			width: 130,
			filterType: 'string',
			render: (v: string) => <Tag color={REQUEST_STATUS_COLOR[v]}>{REQUEST_STATUS_LABEL[v] || v}</Tag>,
		},
		{
			title: 'Nhân viên phụ trách',
			align: 'center',
			width: 150,
			render: (_: any, r: MMaintenanceRequest.IRecord) => {
				const staff = infoAllUser?.find((u: any) => u._id === ((r as any)?.assigned_to?._id || r.assigned_to));
				return staff ? <Tag color='blue'>{staff.name}</Tag> : <span style={{ color: '#bbb' }}>Chưa phân công</span>;
			},
		},
		{
			title: 'Ngày tạo',
			align: 'center',
			dataIndex: 'created_at',
			width: 110,
			render: (v: string) => (v ? new Date(v).toLocaleDateString('vi-VN') : ''),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 160,
			fixed: 'right',
			render: (r: MMaintenanceRequest.IRecord) => (
				<>
					<Tooltip title='Phân công nhân viên'>
						<Button
							type='link'
							icon={<UserAddOutlined />}
							style={{ color: '#1677ff' }}
							disabled={r.status === 'closed' || r.status === 'completed'}
							onClick={() => handleOpenAssign(r)}
						/>
					</Tooltip>
					<Tooltip title='Chỉnh sửa'>
						<Button
							type='link'
							icon={<EditOutlined />}
							onClick={() => {
								setRecordRequest(r);
								setShowEditRequest(true);
								setEditRequest(true);
							}}
						/>
					</Tooltip>
					<Tooltip title='Đóng yêu cầu'>
						<Popconfirm
							title='Đóng yêu cầu này?'
							placement='topLeft'
							onConfirm={() => {
								handleCloseMaintenanceRequest(r._id as string).then(() => {
									message.success('Đã đóng yêu cầu');
									handleGetAllMaintenanceRequest();
								});
							}}
							disabled={r.status === 'closed'}
						>
							<Button type='link' icon={<CloseCircleOutlined />} disabled={r.status === 'closed'} />
						</Popconfirm>
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							title='Bạn có chắc muốn xóa?'
							placement='topLeft'
							onConfirm={() => {
								handleDeleteMaintenanceRequest(r._id as string).then(() => {
									handleGetAllMaintenanceRequest();
								});
							}}
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	useEffect(() => {
		handleGetAllMaintenanceRequest();
		handleGetInfoAllApartment();
		handleGetInfoAllUser();
	}, [refreshKey]);

	useEffect(() => {
		const findAndInsert = () => {
			const reloadIcon = document.querySelector('.table-base .header .extra .anticon-reload');
			const reloadBtn = reloadIcon?.closest('button') || reloadIcon?.closest('.ant-btn');

			if (reloadBtn) {
				let placeholder = document.getElementById('filter-btn-placeholder-yeu-cau-bao-tri');
				if (!placeholder) {
					placeholder = document.createElement('span');
					placeholder.id = 'filter-btn-placeholder-yeu-cau-bao-tri';
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
	}, [infoAllMaintenanceRequest, loadingInfoAllMaintenanceRequest]);

	const isFilterActive = useMemo(() => {
		return statusFilter !== "all" || priorityFilter !== "all" || categoryFilter !== "all";
	}, [statusFilter, priorityFilter, categoryFilter]);

	const filteredData = useMemo(() => {
		let data = infoAllMaintenanceRequest || [];

		if (statusFilter !== "all") {
			data = data.filter(item => item.status === statusFilter);
		}

		if (priorityFilter !== "all") {
			data = data.filter(item => item.priority === priorityFilter);
		}

		if (categoryFilter !== "all") {
			data = data.filter(item => item.category === categoryFilter);
		}

		const keyword = searchKeyword.trim().toLowerCase();
		if (keyword) {
			data = data.filter(item =>
				[item.title, item.Maintenance_Requests_code]
					.filter(Boolean)
					.some((val: any) => val.toString().toLowerCase().includes(keyword))
			);
		}

		return data;
	}, [infoAllMaintenanceRequest, searchKeyword, statusFilter, priorityFilter, categoryFilter]);

	return (
		<>
			<div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, gap: 16 }}>
				<div style={{
					width: 50, height: 50,
					backgroundColor: '#e6f4ff',
					borderRadius: 12,
					display: 'flex', alignItems: 'center', justifyContent: 'center',
				}}>
					<ToolOutlined style={{ fontSize: 22, color: '#1677ff' }} />
				</div>
				<div>
					<Title level={3} style={{ margin: 0 }}>Yêu cầu bảo trì</Title>
					<div style={{ color: '#8c8c8c', fontSize: 14, marginTop: 4 }}>
						Tiếp nhận, xử lý và phân công các yêu cầu bảo trì từ cư dân
					</div>
				</div>
			</div>

			<Divider style={{ margin: '5px 0 20px' }} />

			<div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 20 }}>
				<Input.Search
					allowClear
					placeholder="Tìm kiếm theo mã yêu cầu, tiêu đề..."
					value={searchKeyword}
					onChange={(e) => setSearchKeyword(e.target.value)}
					onSearch={setSearchKeyword}
					style={{ width: 400, maxWidth: '100%' }}
				/>
			</div>

			{portalContainer && createPortal(
				<Tooltip title="Bộ lọc tùy chỉnh">
					<Badge dot={isFilterActive} offset={[-2, 2]}>
						<Button
							icon={<FilterOutlined />}
							onClick={() => {
								setFilterModalVisible(true);
							}}
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
				onApply={(vals) => {
					setStatusFilter(vals.statusFilter);
					setPrimaryFilter(vals.priorityFilter);
					setCategoryFilter(vals.categoryFilter);
					setFilterModalVisible(false);
				}}
				currentStatusFilter={statusFilter}
				currentPriorityFilter={priorityFilter}
				currentCategoryFilter={categoryFilter}
			/>

			<TableStaticData
				columns={requestColumns}
				data={filteredData}
				loading={loadingInfoAllMaintenanceRequest}
				showEdit={showEditRequest}
				hasCreate={true}
				onReload={() => handleGetAllMaintenanceRequest()}
				Form={FormMaintenanceRequest}
				formProps={{
					initialValues: recordRequest,
					setShowEdit: setShowEditRequest,
					edit: editRequest,
				}}
				setShowEdit={(val) => {
					setShowEditRequest(val);
					if (!val) {
						setRecordRequest({});
						setEditRequest(false);
					}
				}}
				widthDrawer={680}
				addStt
			/>

			<Modal
				title={
					<span>
						<UserAddOutlined style={{ color: '#1677ff', marginRight: 8 }} />
						Phân công nhân viên xử lý
					</span>
				}
				open={showAssignModal}
				onCancel={() => {
					setShowAssignModal(false);
					assignForm.resetFields();
				}}
				footer={null}
				width={480}
			>
				{assignRecord && (
					<div
						style={{
							marginBottom: 16,
							padding: '8px 12px',
							background: '#f0f5ff',
							borderRadius: 6,
							borderLeft: '4px solid #1677ff',
						}}
					>
						<div>
							<strong>{assignRecord.Maintenance_Requests_code}</strong> - {assignRecord.title}
						</div>
						<div style={{ marginTop: 4, color: '#666', fontSize: 12 }}>
							Trạng thái hiện tại:{' '}
							<Tag color={REQUEST_STATUS_COLOR[assignRecord.status!]}>{REQUEST_STATUS_LABEL[assignRecord.status!]}</Tag>
						</div>
					</div>
				)}
				<Form form={assignForm} layout='vertical' onFinish={handleSubmitAssign}>
					<Form.Item
						name='assigned_to'
						label='Chọn nhân viên kỹ thuật (STAFF)'
						rules={[{ required: true, message: 'Vui lòng chọn nhân viên!' }]}
					>
						<Select showSearch placeholder='Chọn nhân viên kỹ thuật' optionFilterProp='label' options={staffOptions} />
					</Form.Item>
					<Form.Item
						name='priority'
						label='Mức độ ưu tiên'
						rules={[{ required: true, message: 'Vui lòng chọn mức độ ưu tiên!' }]}
					>
						<Select placeholder='Chọn mức độ ưu tiên' options={PRIORITY_OPTIONS} />
					</Form.Item>
					<div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
						<Button
							onClick={() => {
								setShowAssignModal(false);
								assignForm.resetFields();
							}}
						>
							Hủy
						</Button>
						<Button type='primary' htmlType='submit' loading={loadingAssign} icon={<UserAddOutlined />}>
							Xác nhận phân công
						</Button>
					</div>
				</Form>
			</Modal>
		</>
	);
};

export default MaintenanceRequestPage;
