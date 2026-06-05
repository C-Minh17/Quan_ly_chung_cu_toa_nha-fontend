import { useEffect, useState } from 'react';
import {
	Row,
	Col,
	Card,
	Table,
	Tag,
	Badge,
	Avatar,
	Button,
	Progress,
	List,
	Skeleton,
	message,
	Modal,
	Form,
	Input,
	Select
} from 'antd';
import {
	HomeOutlined,
	TeamOutlined,
	DollarOutlined,
	ToolOutlined,
	ArrowUpOutlined,
	ArrowDownOutlined,
	CalendarOutlined,
	BellOutlined,
	ClockCircleOutlined,
	RightOutlined,
	UserOutlined
} from '@ant-design/icons';
import CountUp from 'react-countup';
import Chart from 'react-apexcharts';
import {
	getDashboardMetrics,
	getRevenueStats,
	getMaintenanceStatusStats,
	getUrgentMaintenanceRequests,
	getOverdueInvoices,
	getRecentActivities,
	sendResidentNotification
} from '@/services/Dashboard';
import './components/style.less';

const TrangChu = () => {
	const [loading, setLoading] = useState<boolean>(true);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [submittingNotif, setSubmittingNotif] = useState<boolean>(false);
	const [form] = Form.useForm();
	const [metrics, setMetrics] = useState<any>(null);
	const [revenueData, setRevenueData] = useState<any>(null);
	const [maintenanceStats, setMaintenanceStats] = useState<any>(null);
	const [urgentRequests, setUrgentRequests] = useState<any[]>([]);
	const [overdueInvoices, setOverdueInvoices] = useState<any[]>([]);
	const [activities, setActivities] = useState<any[]>([]);

	// Date display
	const today = new Date();
	const formattedDate = `Thứ Sáu, ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;

	// Fetch data from backend APIs
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const [
					resMetrics,
					resRevenue,
					resMaintStats,
					resUrgent,
					resOverdue,
					resActivities
				] = await Promise.allSettled([
					getDashboardMetrics(),
					getRevenueStats(),
					getMaintenanceStatusStats(),
					getUrgentMaintenanceRequests(),
					getOverdueInvoices(),
					getRecentActivities()
				]);

				if (resMetrics.status === 'fulfilled' && resMetrics.value?.success) {
					setMetrics(resMetrics.value.data);
				}
				if (resRevenue.status === 'fulfilled' && resRevenue.value?.success) {
					setRevenueData(resRevenue.value.data);
				}
				if (resMaintStats.status === 'fulfilled' && resMaintStats.value?.success) {
					setMaintenanceStats(resMaintStats.value.data);
				}
				if (resUrgent.status === 'fulfilled' && resUrgent.value?.success) {
					setUrgentRequests(resUrgent.value.data);
				}
				if (resOverdue.status === 'fulfilled' && resOverdue.value?.success) {
					setOverdueInvoices(resOverdue.value.data);
				}
				if (resActivities.status === 'fulfilled' && resActivities.value?.success) {
					setActivities(resActivities.value.data);
				}
			} catch (error) {
				console.error('Lỗi khi tải dữ liệu Dashboard:', error);
				message.error('Không thể kết nối máy chủ để tải dữ liệu thống kê.');
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	// Submit notification to backend
	const handleSendNotification = async (values: any) => {
		setSubmittingNotif(true);
		try {
			const res = await sendResidentNotification({
				title: values.title,
				senderName: 'Ban Quản trị',
				receiverType: 'All', // Match EReceiverType.All
				type: 'OneSignalService', // Match standard OneSignal notification service
				content: values.content,
				description: `Phân loại: ${
					values.type === 'maintenance' 
						? 'Bảo trì / Kỹ thuật' 
						: values.type === 'finance' 
							? 'Tài chính / Phí dịch vụ' 
							: values.type === 'alert' 
								? 'Cảnh báo khẩn cấp' 
								: 'Thông báo chung'
				}. Đối tượng: ${
					values.recipient_type === 'building_a' 
						? 'Cư dân Tòa A' 
						: values.recipient_type === 'building_b' 
							? 'Cư dân Tòa B' 
							: 'Tất cả cư dân'
				}`,
				notificationInternal: false,
			});
			if (res?.success) {
				message.success('Gửi thông báo đến cư dân thành công!');
				setIsModalOpen(false);
				form.resetFields();
				// Optionally refresh activity feed
				getRecentActivities().then(resAct => {
					if (resAct?.success) setActivities(resAct.data);
				});
			} else {
				message.error(res?.message || 'Có lỗi xảy ra khi gửi thông báo.');
			}
		} catch (error) {
			console.error('Lỗi gửi thông báo:', error);
			message.error('Không thể kết nối máy chủ để gửi thông báo.');
		} finally {
			setSubmittingNotif(false);
		}
	};

	// ApexCharts - Revenue & Expenses Options
	const revenueChartOptions: any = {
		chart: {
			id: 'revenue-chart',
			toolbar: { show: false },
			fontFamily: 'inherit',
		},
		colors: ['#3b82f6', '#10b981'], // Ocean Blue & Emerald Green
		stroke: {
			curve: 'smooth',
			width: [3, 3],
		},
		fill: {
			type: 'gradient',
			gradient: {
				shadeIntensity: 1,
				opacityFrom: 0.3,
				opacityTo: 0.05,
				stops: [0, 90, 100]
			}
		},
		xaxis: {
			categories: revenueData?.categories || ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
			labels: {
				style: { colors: '#64748b', fontWeight: 500 }
			}
		},
		yaxis: {
			labels: {
				style: { colors: '#64748b', fontWeight: 500 },
				formatter: (value: number) => {
					// Dữ liệu từ API trả về dạng VNĐ (ví dụ 120,000,000), chia cho 1,000,000 để vẽ dạng Triệu (M)
					return `${(value / 1000000).toFixed(0)} M`;
				}
			}
		},
		grid: {
			borderColor: '#f1f5f9',
			strokeDashArray: 4,
		},
		tooltip: {
			y: {
				formatter: (value: number) => `${value.toLocaleString()} đ`
			}
		},
		legend: {
			position: 'top',
			horizontalAlign: 'right',
			labels: { colors: '#1e293b' },
			itemMargin: { horizontal: 10 }
		}
	};

	const revenueChartSeries = revenueData?.series || [];

	// ApexCharts - Maintenance Status (Donut)
	const maintenanceChartOptions: any = {
		chart: {
			fontFamily: 'inherit',
		},
		labels: ['Mới gửi', 'Đang xử lý', 'Hoàn thành', 'Tạm hoãn'],
		colors: ['#ef4444', '#f59e0b', '#10b981', '#64748b'],
		plotOptions: {
			pie: {
				donut: {
					size: '75%',
					labels: {
						show: true,
						total: {
							show: true,
							label: 'Tổng yêu cầu',
							fontSize: '14px',
							fontWeight: 600,
							color: '#64748b',
							formatter: () => {
								const total =
									(maintenanceStats?.new || 0) +
									(maintenanceStats?.in_progress || 0) +
									(maintenanceStats?.completed || 0) +
									(maintenanceStats?.closed || 0);
								return total.toString();
							}
						}
					}
				}
			}
		},
		legend: {
			position: 'bottom',
			horizontalAlign: 'center',
			labels: { colors: '#1e293b' }
		},
		dataLabels: {
			enabled: false
		}
	};

	const maintenanceChartSeries = [
		maintenanceStats?.new || 0,
		maintenanceStats?.in_progress || 0,
		maintenanceStats?.completed || 0,
		maintenanceStats?.closed || 0
	];

	// Table Data: Recent maintenance requests
	const maintenanceColumns = [
		{
			title: 'Căn hộ',
			dataIndex: 'apartment_code',
			key: 'apartment_code',
			render: (text: string) => <strong>{text}</strong>
		},
		{
			title: 'Nội dung',
			dataIndex: 'title',
			key: 'title',
		},
		{
			title: 'Mức độ',
			dataIndex: 'priority',
			key: 'priority',
			render: (priority: string) => {
				let color = 'blue';
				let label = priority;
				if (priority === 'urgent' || priority === 'Khẩn cấp') {
					color = 'red';
					label = 'Khẩn cấp';
				} else if (priority === 'medium' || priority === 'Trung bình') {
					color = 'orange';
					label = 'Trung bình';
				} else if (priority === 'low' || priority === 'Thường' || priority === 'Thấp') {
					color = 'blue';
					label = 'Thường';
				}
				return <Tag color={color}>{label}</Tag>;
			}
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			render: (status: string) => {
				let statusType: 'success' | 'processing' | 'default' | 'error' | 'warning' = 'default';
				let text = status;

				if (status === 'in_progress' || status === 'Đang xử lý') {
					statusType = 'processing';
					text = 'Đang xử lý';
				} else if (status === 'new' || status === 'Mới gửi') {
					statusType = 'error';
					text = 'Mới gửi';
				} else if (status === 'completed' || status === 'Hoàn thành') {
					statusType = 'success';
					text = 'Hoàn thành';
				} else if (status === 'closed' || status === 'Tạm hoãn') {
					statusType = 'default';
					text = 'Đã đóng';
				}
				return <Badge status={statusType} text={text} />;
			}
		}
	];

	// Table Data: Overdue invoices
	const invoiceColumns = [
		{
			title: 'Căn hộ',
			dataIndex: 'apartment_code',
			key: 'apartment_code',
			render: (text: string) => <strong>{text}</strong>
		},
		{
			title: 'Cư dân',
			dataIndex: 'resident_name',
			key: 'resident_name',
		},
		{
			title: 'Hạn thanh toán',
			dataIndex: 'due_date',
			key: 'due_date',
			render: (date: string) => {
				// Định dạng hiển thị DD/MM/YYYY từ ISO
				const dateObj = new Date(date);
				const formatted = isNaN(dateObj.getTime())
					? date
					: `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()}`;
				return <span style={{ color: '#ef4444', fontWeight: 500 }}>{formatted}</span>;
			}
		},
		{
			title: 'Số tiền',
			dataIndex: 'total_amount',
			key: 'total_amount',
			render: (val: number) => <strong>{val.toLocaleString()} đ</strong>
		},
		{
			title: 'Hành động',
			key: 'action',
			render: () => (
				<Button size="small" type="primary" ghost>
					Nhắc nhở
				</Button>
			)
		}
	];

	return (
		<div className="dashboard-container">
			{/* Dashboard Header */}
			<div className="dashboard-header">
				<div className="welcome-title">
					<h1>Tổng quan hệ thống</h1>
					<p>{formattedDate} • Xin chào, Ban Quản trị tòa nhà</p>
				</div>
				<div className="header-actions">
					<Button type="primary" icon={<BellOutlined />} onClick={() => setIsModalOpen(true)}>
						Gửi thông báo cư dân
					</Button>
					<Button icon={<CalendarOutlined />}>
						Lịch làm việc
					</Button>
				</div>
			</div>

			{/* Metric Cards Row */}
			<Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
				<Col xs={24} sm={12} md={6}>
					<Card className="stat-card apartments-card" bordered={false}>
						{loading ? (
							<Skeleton active paragraph={{ rows: 2 }} />
						) : (
							<>
								<div className="stat-card-icon">
									<HomeOutlined />
								</div>
								<div className="stat-card-value">
									<CountUp end={metrics?.apartments?.total || 0} duration={1.5} />
								</div>
								<div className="stat-card-label">Tổng căn hộ</div>
								<Progress
									percent={metrics?.apartments?.occupied_percentage || 0}
									size="small"
									strokeColor="#ff4d4f"
									showInfo={false}
								/>
								<div className="stat-card-footer">
									<span>Đã ở: {metrics?.apartments?.occupied || 0} căn ({metrics?.apartments?.occupied_percentage || 0}%)</span>
									<span className="trend-up"><ArrowUpOutlined /> +{metrics?.apartments?.trend_percentage || 0}%</span>
								</div>
							</>
						)}
					</Card>
				</Col>

				<Col xs={24} sm={12} md={6}>
					<Card className="stat-card residents-card" bordered={false}>
						{loading ? (
							<Skeleton active paragraph={{ rows: 2 }} />
						) : (
							<>
								<div className="stat-card-icon">
									<TeamOutlined />
								</div>
								<div className="stat-card-value">
									<CountUp end={metrics?.residents?.total || 0} duration={1.5} />
								</div>
								<div className="stat-card-label">Tổng số cư dân</div>
								<Progress
									percent={Math.round(((metrics?.residents?.permanent || 0) / (metrics?.residents?.total || 1)) * 100)}
									size="small"
									strokeColor="#1890ff"
									showInfo={false}
								/>
								<div className="stat-card-footer">
									<span>Thường trú: {metrics?.residents?.permanent || 0}</span>
									<span className="trend-up"><ArrowUpOutlined /> +{metrics?.residents?.trend_new || 0}</span>
								</div>
							</>
						)}
					</Card>
				</Col>

				<Col xs={24} sm={12} md={6}>
					<Card className="stat-card revenue-card" bordered={false}>
						{loading ? (
							<Skeleton active paragraph={{ rows: 2 }} />
						) : (
							<>
								<div className="stat-card-icon">
									<DollarOutlined />
								</div>
								<div className="stat-card-value">
									<CountUp end={metrics?.finance?.billing_month_total || 0} separator="." suffix=" đ" duration={1.8} />
								</div>
								<div className="stat-card-label">Hóa đơn tháng này</div>
								<Progress
									percent={metrics?.finance?.paid_percentage || 0}
									size="small"
									strokeColor="#52c41a"
									showInfo={false}
								/>
								<div className="stat-card-footer">
									<span>Thực tế đã thu: {metrics?.finance?.paid_percentage || 0}%</span>
									<span className="trend-up"><ArrowUpOutlined /> +{metrics?.finance?.trend_percentage || 0}%</span>
								</div>
							</>
						)}
					</Card>
				</Col>

				<Col xs={24} sm={12} md={6}>
					<Card className="stat-card maintenance-card" bordered={false}>
						{loading ? (
							<Skeleton active paragraph={{ rows: 2 }} />
						) : (
							<>
								<div className="stat-card-icon">
									<ToolOutlined />
								</div>
								<div className="stat-card-value">
									<CountUp end={metrics?.maintenance?.total_pending || 0} duration={1.2} />
								</div>
								<div className="stat-card-label">Bảo trì chưa hoàn thành</div>
								<Progress
									percent={Math.round((((metrics?.maintenance?.total_pending || 0) - (metrics?.maintenance?.urgent_count || 0)) / (metrics?.maintenance?.total_pending || 1)) * 100)}
									size="small"
									strokeColor="#faad14"
									showInfo={false}
								/>
								<div className="stat-card-footer">
									<span style={{ color: '#ef4444', fontWeight: 600 }}>{metrics?.maintenance?.urgent_count || 0} yêu cầu khẩn cấp</span>
									<span className="trend-down">
										{metrics?.maintenance?.trend_change >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
										{Math.abs(metrics?.maintenance?.trend_change || 0)}
									</span>
								</div>
							</>
						)}
					</Card>
				</Col>
			</Row>

			{/* Charts Row */}
			<Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
				<Col xs={24} lg={16}>
					<Card title="Dòng tiền & Thu phí dịch vụ (6 tháng gần đây)" className="chart-card" bordered={false}>
						{loading ? (
							<Skeleton active paragraph={{ rows: 10 }} />
						) : (
							<Chart
								options={revenueChartOptions}
								series={revenueChartSeries}
								type="line"
								height={350}
							/>
						)}
					</Card>
				</Col>
				<Col xs={24} lg={8}>
					<Card title="Trạng thái Yêu cầu Bảo trì" className="chart-card" bordered={false}>
						{loading ? (
							<Skeleton active paragraph={{ rows: 10 }} />
						) : (
							<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 350 }}>
								<Chart
									options={maintenanceChartOptions}
									series={maintenanceChartSeries}
									type="donut"
									width={320}
								/>
							</div>
						)}
					</Card>
				</Col>
			</Row>

			{/* Operational Details Tables */}
			<Row gutter={[24, 24]}>
				<Col xs={24} xl={12}>
					<Card
						title="Yêu cầu sửa chữa khẩn cấp"
						className="list-card"
						bordered={false}
						extra={
							<Button type="link" size="small" icon={<RightOutlined />} iconPosition="end">
								Tất cả yêu cầu
							</Button>
						}
					>
						<Table
							columns={maintenanceColumns}
							dataSource={urgentRequests}
							pagination={false}
							size="middle"
							loading={loading}
							rowKey={(record) => record.id || record.key}
						/>
					</Card>
				</Col>

				<Col xs={24} xl={12}>
					<Card
						title="Hóa đơn quá hạn chưa thanh toán"
						className="list-card"
						bordered={false}
						extra={
							<Button type="link" size="small" icon={<RightOutlined />} iconPosition="end">
								Tất cả hóa đơn
							</Button>
						}
					>
						<Table
							columns={invoiceColumns}
							dataSource={overdueInvoices}
							pagination={false}
							size="middle"
							loading={loading}
							rowKey={(record) => record.id}
						/>
					</Card>
				</Col>
			</Row>

			{/* Recent Activity Log Row */}
			<Row gutter={[24, 24]} style={{ marginTop: 24 }}>
				<Col xs={24}>
					<Card title="Nhật ký hoạt động vận hành gần đây" className="list-card" bordered={false}>
						{loading ? (
							<Skeleton active paragraph={{ rows: 6 }} />
						) : (
							<List
								itemLayout="horizontal"
								dataSource={activities}
								renderItem={(item) => {
									let avatarBg = '#f1f5f9';
									let avatarColor = '#64748b';
									let icon = <UserOutlined />;

									if (item.type === 'payment') {
										avatarBg = '#ecfdf5';
										avatarColor = '#10b981';
										icon = <DollarOutlined />;
									} else if (item.type === 'maintenance') {
										avatarBg = '#fef3c7';
										avatarColor = '#f59e0b';
										icon = <ToolOutlined />;
									}

									return (
										<List.Item>
											<List.Item.Meta
												avatar={
													<Avatar style={{ backgroundColor: avatarBg, color: avatarColor }} icon={icon} />
												}
												title={<strong>{item.title}</strong>}
												description={item.description}
											/>
											<div style={{ color: '#94a3b8', fontSize: '13px' }}>
												<ClockCircleOutlined style={{ marginRight: 4 }} />
												{item.time_ago || item.time}
											</div>
										</List.Item>
									);
								}}
							/>
						)}
					</Card>
				</Col>
			</Row>

			{/* Send Resident Notification Modal */}
			<Modal
				title={<strong>Gửi thông báo mới đến cư dân</strong>}
				open={isModalOpen}
				onCancel={() => {
					setIsModalOpen(false);
					form.resetFields();
				}}
				onOk={() => form.submit()}
				confirmLoading={submittingNotif}
				okText="Gửi thông báo"
				cancelText="Hủy"
				destroyOnClose
			>
				<Form
					form={form}
					layout="vertical"
					onFinish={handleSendNotification}
					initialValues={{
						type: 'general',
						recipient_type: 'all'
					}}
				>
					<Form.Item
						name="title"
						label="Tiêu đề thông báo"
						rules={[{ required: true, message: 'Vui lòng nhập tiêu đề thông báo' }]}
					>
						<Input placeholder="Nhập tiêu đề (Ví dụ: Thông báo bảo trì bể bơi...)" />
					</Form.Item>

					<Form.Item
						name="type"
						label="Loại thông báo"
						rules={[{ required: true, message: 'Vui lòng chọn loại thông báo' }]}
					>
						<Select placeholder="Chọn loại thông báo">
							<Select.Option value="general">Thông báo chung</Select.Option>
							<Select.Option value="maintenance">Bảo trì / Kỹ thuật</Select.Option>
							<Select.Option value="finance">Tài chính / Phí dịch vụ</Select.Option>
							<Select.Option value="alert">Cảnh báo khẩn cấp</Select.Option>
						</Select>
					</Form.Item>

					<Form.Item
						name="recipient_type"
						label="Đối tượng nhận thông báo"
						rules={[{ required: true, message: 'Vui lòng chọn đối tượng nhận' }]}
					>
						<Select placeholder="Chọn đối tượng nhận">
							<Select.Option value="all">Tất cả cư dân tòa nhà</Select.Option>
							<Select.Option value="building_a">Chỉ cư dân Tòa A</Select.Option>
							<Select.Option value="building_b">Chỉ cư dân Tòa B</Select.Option>
						</Select>
					</Form.Item>

					<Form.Item
						name="content"
						label="Nội dung thông báo"
						rules={[{ required: true, message: 'Vui lòng nhập nội dung chi tiết' }]}
					>
						<Input.TextArea 
							rows={5} 
							placeholder="Nhập nội dung chi tiết thông báo..." 
						/>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default TrangChu;
