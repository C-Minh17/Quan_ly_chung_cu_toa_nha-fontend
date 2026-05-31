import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import { CloseCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Button, Popconfirm, Tag, Tooltip, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import FormMaintenanceSchedule from '../components/FormSchedule';

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

	return (
		<>
			<Title level={2} style={{ marginTop: 10, marginBottom: 24 }}>
				Lịch bảo trì
			</Title>

			<TableStaticData
				columns={scheduleColumns}
				data={infoAllMaintenanceSchedule || []}
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
