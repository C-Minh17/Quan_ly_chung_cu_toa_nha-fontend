import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import { CloseCircleOutlined, DeleteOutlined, EditOutlined, CalendarOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Button, Divider, Input, Popconfirm, Tag, Tooltip, Typography, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import FormMaintenanceSchedule from '../components/FormSchedule';
import FilterBar from './components/FilterBar';

const { Title } = Typography;

const SCHEDULE_STATUS_COLOR: Record<string, string> = {
	scheduled: 'blue',
	completed: 'green',
	cancelled: 'default',
};

const SCHEDULE_STATUS_LABEL: Record<string, string> = {
	scheduled: 'Đã lên lịch',
	completed: 'Hoàn thành',
	cancelled: 'Đã hủy',
};

const FREQ_LABEL: Record<string, string> = {
	once: 'Một lần',
	weekly: 'Hàng tuần',
	monthly: 'Hàng tháng',
	quarterly: 'Hàng quý',
	yearly: 'Hàng năm',
};

const MaintenanceSchedulePage = () => {
	const {
		refreshKey,
		infoAllMaintenanceSchedule,
		loadingInfoAllMaintenanceSchedule,
		handleGetAllMaintenanceSchedule,
		handleDeleteMaintenanceSchedule,
		handleCompleteMaintenanceSchedule,
	} = useModel('maintenanceSchedule.maintenanceSchedule');

	const [showEditSchedule, setShowEditSchedule] = useState(false);
	const [recordSchedule, setRecordSchedule] = useState<MMaintenanceSchedule.IRecord | {}>({});
	const [editSchedule, setEditSchedule] = useState(false);
	const [searchKeyword, setSearchKeyword] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [frequencyFilter, setFrequencyFilter] = useState("all");

	const scheduleColumns: IColumn<MMaintenanceSchedule.IRecord>[] = [
		{
			title: 'Mã lịch',
			align: 'center',
			dataIndex: 'Maintenance_Schedules_id',
			width: 110,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Tiêu đề',
			dataIndex: 'title',
			width: 200,
			filterType: 'string',
		},
		{
			title: 'Tần suất',
			align: 'center',
			dataIndex: 'frequency',
			width: 120,
			render: (v: string) => FREQ_LABEL[v] || v,
		},
		{
			title: 'Ngày thực hiện',
			align: 'center',
			dataIndex: 'scheduled_date',
			width: 140,
			render: (v: string) => (v ? new Date(v).toLocaleDateString('vi-VN') : ''),
		},
		{
			title: 'Trạng thái',
			align: 'center',
			dataIndex: 'status',
			width: 130,
			filterType: 'string',
			render: (v: string) => <Tag color={SCHEDULE_STATUS_COLOR[v]}>{SCHEDULE_STATUS_LABEL[v] || v}</Tag>,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 130,
			fixed: 'right',
			render: (r: MMaintenanceSchedule.IRecord) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button
							type='link'
							icon={<EditOutlined />}
							onClick={() => {
								setRecordSchedule(r);
								setShowEditSchedule(true);
								setEditSchedule(true);
							}}
						/>
					</Tooltip>
					<Tooltip title='Đánh dấu hoàn thành'>
						<Popconfirm
							title='Đánh dấu lịch này là hoàn thành?'
							placement='topLeft'
							onConfirm={() => {
								handleCompleteMaintenanceSchedule(r._id as string).then((resData: any) => {
									message.success('Đã hoàn thành lịch bảo trì');
									if (resData?.nextSchedule) {
										message.info(
											`Hệ thống đã tự động tạo lịch bảo trì kỳ tiếp theo: ${new Date(resData.nextSchedule.scheduled_date).toLocaleDateString('vi-VN')}`,
										);
									}
									handleGetAllMaintenanceSchedule();
								});
							}}
							disabled={r.status === 'completed' || r.status === 'cancelled'}
						>
							<Button
								type='link'
								icon={<CloseCircleOutlined />}
								disabled={r.status === 'completed' || r.status === 'cancelled'}
							/>
						</Popconfirm>
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							title='Bạn có chắc muốn xóa?'
							placement='topLeft'
							onConfirm={() => {
								handleDeleteMaintenanceSchedule(r._id as string).then(() => {
									handleGetAllMaintenanceSchedule();
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
		handleGetAllMaintenanceSchedule();
	}, [refreshKey]);

	const filteredData = useMemo(() => {
		let data = infoAllMaintenanceSchedule || [];

		// Filter by status
		if (statusFilter !== "all") {
			data = data.filter(item => item.status === statusFilter);
		}

		// Filter by frequency
		if (frequencyFilter !== "all") {
			data = data.filter(item => item.frequency === frequencyFilter);
		}

		// Search filter
		const keyword = searchKeyword.trim().toLowerCase();
		if (keyword) {
			data = data.filter(item =>
				[item.title, item.frequency]
					.filter(Boolean)
					.some((val: any) => val.toString().toLowerCase().includes(keyword))
			);
		}

		return data;
	}, [infoAllMaintenanceSchedule, searchKeyword, statusFilter, frequencyFilter]);

	return (
		<>
			<div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, gap: 16 }}>
				<div style={{
					width: 50, height: 50,
					backgroundColor: '#e6f4ff',
					borderRadius: 12,
					display: 'flex', alignItems: 'center', justifyContent: 'center',
				}}>
					<CalendarOutlined style={{ fontSize: 22, color: '#1677ff' }} />
				</div>
				<div>
					<Title level={3} style={{ margin: 0 }}>Lịch bảo trì</Title>
					<div style={{ color: '#8c8c8c', fontSize: 14, marginTop: 4 }}>
						Lên lịch và theo dõi các hoạt động bảo trì định kỳ của tòa nhà
					</div>
				</div>
			</div>

			<Divider style={{ margin: '5px 0 20px' }} />

			<div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 20 }}>
				<Input.Search
					allowClear
					placeholder="Tìm kiếm theo tiêu đề lịch bảo trì..."
					value={searchKeyword}
					onChange={(e) => setSearchKeyword(e.target.value)}
					onSearch={setSearchKeyword}
					style={{ width: 400, maxWidth: '100%' }}
				/>
			</div>

			<FilterBar
				statusFilter={statusFilter}
				frequencyFilter={frequencyFilter}
				onStatusFilterChange={setStatusFilter}
				onFrequencyFilterChange={setFrequencyFilter}
			/>

			<TableStaticData
				columns={scheduleColumns}
				data={filteredData}
				loading={loadingInfoAllMaintenanceSchedule}
				showEdit={showEditSchedule}
				hasCreate={true}
				onReload={() => handleGetAllMaintenanceSchedule()}
				Form={FormMaintenanceSchedule}
				formProps={{
					initialValues: recordSchedule,
					setShowEdit: setShowEditSchedule,
					edit: editSchedule,
				}}
				setShowEdit={(val) => {
					setShowEditSchedule(val);
					if (!val) {
						setRecordSchedule({});
						setEditSchedule(false);
					}
				}}
				widthDrawer={620}
				addStt
			/>
		</>
	);
};

export default MaintenanceSchedulePage;
