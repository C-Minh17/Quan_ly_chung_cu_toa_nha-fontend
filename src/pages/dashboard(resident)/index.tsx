import React, { useEffect, useState } from 'react';
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
	Timeline,
	Skeleton,
	message,
	Empty
} from 'antd';
import { 
	UserOutlined, 
	HomeOutlined, 
	CreditCardOutlined, 
	ToolOutlined, 
	CarOutlined, 
	CalendarOutlined, 
	ClockCircleOutlined, 
	CheckCircleOutlined,
	RightOutlined
} from '@ant-design/icons';
import { 
	getResidentMetrics, 
	getResidentBills, 
	getResidentBookings, 
	getResidentMaintenance 
} from '@/services/Dashboard';
import { history } from 'umi';

const DashboardResident = () => {
	const [loading, setLoading] = useState<boolean>(true);
	const [residentInfo, setResidentInfo] = useState<any>(null);
	const [metrics, setMetrics] = useState<any>(null);
	const [bills, setBills] = useState<any[]>([]);
	const [bookings, setBookings] = useState<any[]>([]);
	const [maintenance, setMaintenance] = useState<any[]>([]);

	// Fetch data from backend APIs
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const [resMetrics, resBills, resBookings, resMaint] = await Promise.allSettled([
					getResidentMetrics(),
					getResidentBills(),
					getResidentBookings(),
					getResidentMaintenance()
				]);

				if (resMetrics.status === 'fulfilled' && resMetrics.value?.success) {
					setResidentInfo(resMetrics.value.data.resident_info);
					setMetrics(resMetrics.value.data.metrics);
				}
				if (resBills.status === 'fulfilled' && resBills.value?.success) {
					setBills(resBills.value.data);
				}
				if (resBookings.status === 'fulfilled' && resBookings.value?.success) {
					setBookings(resBookings.value.data);
				}
				if (resMaint.status === 'fulfilled' && resMaint.value?.success) {
					setMaintenance(resMaint.value.data);
				}
			} catch (error) {
				console.error('Lỗi khi tải dữ liệu Dashboard Cư dân:', error);
				message.error('Không thể kết nối máy chủ để tải dữ liệu thống kê.');
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	// Format currency helper
	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
	};

	// Format ISO date to DD/MM/YYYY
	const formatDate = (dateString: string) => {
		if (!dateString) return 'Chưa xác định';
		const date = new Date(dateString);
		if (isNaN(date.getTime())) return dateString;
		return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
	};

	return (
		<div style={{ padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh', width: '100%', overflowX: 'hidden', boxSizing: 'border-box' }}>
			
			{/* Banner chào mừng & Thông tin căn hộ */}
			<div style={{
				background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
				borderRadius: '16px',
				padding: '24px 32px',
				marginBottom: '24px',
				boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.06), 0 8px 10px -6px rgba(59, 130, 246, 0.06)',
				border: '1px solid #dbeafe',
				color: '#1e293b',
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				flexWrap: 'wrap',
				gap: '20px'
			}}>
				{loading ? (
					<Skeleton active paragraph={{ rows: 1 }} />
				) : (
					<>
						<div>
							<h2 style={{ color: '#1e293b', fontSize: '24px', fontWeight: 700, margin: '0 0 8px 0' }}>
								Xin chào, {residentInfo?.name || 'Cư dân'}!
							</h2>
							<p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
								Chúc bạn một ngày tốt lành. Dưới đây là thông tin tổng hợp cho căn hộ của bạn tại {residentInfo?.building || 'tòa nhà'}.
							</p>
						</div>
						<div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
							<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
								<Avatar style={{ backgroundColor: '#ffffff', color: '#2563eb', boxShadow: '0 2px 8px rgba(37, 99, 235, 0.08)' }} icon={<HomeOutlined />} />
								<div>
									<div style={{ fontSize: '12px', color: '#64748b' }}>Căn hộ</div>
									<div style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>{residentInfo?.apartment_code || 'Chưa rõ'}</div>
								</div>
							</div>
							<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
								<Avatar style={{ backgroundColor: '#ffffff', color: '#2563eb', boxShadow: '0 2px 8px rgba(37, 99, 235, 0.08)' }} icon={<UserOutlined />} />
								<div>
									<div style={{ fontSize: '12px', color: '#64748b' }}>Thành viên</div>
									<div style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>{residentInfo?.members_count || 0} người</div>
								</div>
							</div>
							<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
								<Avatar style={{ backgroundColor: '#ffffff', color: '#2563eb', boxShadow: '0 2px 8px rgba(37, 99, 235, 0.08)' }} icon={<CarOutlined />} />
								<div>
									<div style={{ fontSize: '12px', color: '#64748b' }}>Phương tiện</div>
									<div style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>{residentInfo?.vehicles_summary || '0 phương tiện'}</div>
								</div>
							</div>
						</div>
					</>
				)}
			</div>

			{/* Grid thẻ thông tin nhanh */}
			<Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
				{/* Cột 1: Hóa đơn chưa đóng */}
				<Col xs={24} sm={12} md={6}>
					<Card style={{
						borderRadius: '16px',
						boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
						border: '1px solid #f1f5f9',
						height: '100%'
					}} styles={{ body: { padding: '20px' } }}>
						{loading ? (
							<Skeleton active paragraph={{ rows: 2 }} />
						) : (
							<>
								<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
									<div style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>Chưa thanh toán</div>
									<Avatar style={{ backgroundColor: '#fef2f2', color: '#ef4444' }} icon={<CreditCardOutlined />} />
								</div>
								<div style={{ fontSize: '24px', fontWeight: 700, color: '#ef4444', marginBottom: '4px' }}>
									{formatCurrency(metrics?.unpaid_amount)}
								</div>
								<div style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>Hạn đóng: 10 hàng tháng</div>
								<Progress 
									percent={metrics?.total_bills_count ? Math.round((metrics?.paid_bills_count / metrics?.total_bills_count) * 100) : 0} 
									size="small" 
									strokeColor="#ef4444" 
									showInfo={false} 
								/>
								<div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
									<span style={{ fontSize: '12px', color: '#64748b' }}>Đã đóng {metrics?.paid_bills_count || 0}/{metrics?.total_bills_count || 0} mục</span>
									{metrics?.unpaid_amount > 0 && (
										<Button size="small" type="primary" danger style={{ borderRadius: '6px' }} onClick={() => history.push('/hoa-don-cua-toi')}>Đóng phí</Button>
									)}
								</div>
							</>
						)}
					</Card>
				</Col>

				{/* Cột 2: Yêu cầu sửa chữa */}
				<Col xs={24} sm={12} md={6}>
					<Card style={{
						borderRadius: '16px',
						boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
						border: '1px solid #f1f5f9',
						height: '100%'
					}} styles={{ body: { padding: '20px' } }}>
						{loading ? (
							<Skeleton active paragraph={{ rows: 2 }} />
						) : (
							<>
								<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
									<div style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>Hỗ trợ sửa chữa</div>
									<Avatar style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }} icon={<ToolOutlined />} />
								</div>
								<div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
									{metrics?.pending_maintenance_count || 0} Yêu cầu
								</div>
								<div style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>Đang chờ kỹ thuật xử lý</div>
								<Progress 
									percent={metrics?.pending_maintenance_count ? 50 : 100} 
									size="small" 
									strokeColor="#f59e0b" 
									showInfo={false} 
								/>
								<div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
									<span style={{ fontSize: '12px', color: '#64748b' }}>Chưa hoàn thành: {metrics?.pending_maintenance_count || 0}</span>
									<Button size="small" type="default" style={{ borderRadius: '6px' }} onClick={() => history.push('/quan-ly-bao-tri')}>Báo hỏng</Button>
								</div>
							</>
						)}
					</Card>
				</Col>

				{/* Cột 3: Đăng ký tiện ích */}
				<Col xs={24} sm={12} md={6}>
					<Card style={{
						borderRadius: '16px',
						boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
						border: '1px solid #f1f5f9',
						height: '100%'
					}} styles={{ body: { padding: '20px' } }}>
						{loading ? (
							<Skeleton active paragraph={{ rows: 2 }} />
						) : (
							<>
								<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
									<div style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>Đặt trước tiện ích</div>
									<Avatar style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }} icon={<CalendarOutlined />} />
								</div>
								<div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
									{metrics?.upcoming_bookings_count || 0} Lịch hẹn
								</div>
								<div style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>Hoạt động đăng ký tiện ích</div>
								<Progress 
									percent={metrics?.upcoming_bookings_count ? 100 : 0} 
									size="small" 
									strokeColor="#3b82f6" 
									showInfo={false} 
								/>
								<div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
									<span style={{ fontSize: '12px', color: '#64748b' }}>Đã duyệt: {metrics?.upcoming_bookings_count || 0}</span>
									<Button size="small" type="primary" ghost style={{ borderRadius: '6px' }} onClick={() => history.push('/dat-tien-ich')}>Đặt lịch</Button>
								</div>
							</>
						)}
					</Card>
				</Col>

				{/* Cột 4: Hợp đồng căn hộ */}
				<Col xs={24} sm={12} md={6}>
					<Card style={{
						borderRadius: '16px',
						boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
						border: '1px solid #f1f5f9',
						height: '100%'
					}} styles={{ body: { padding: '20px' } }}>
						{loading ? (
							<Skeleton active paragraph={{ rows: 2 }} />
						) : (
							<>
								<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
									<div style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>Trạng thái hợp đồng</div>
									<Avatar style={{ backgroundColor: '#ecfdf5', color: '#10b981' }} icon={<CheckCircleOutlined />} />
								</div>
								<div style={{ 
									fontSize: '24px', 
									fontWeight: 700, 
									color: metrics?.contract_status === 'active' ? '#10b981' : '#ef4444', 
									marginBottom: '4px' 
								}}>
									{metrics?.contract_status === 'active' ? 'Hiệu lực' : 'Hết hạn'}
								</div>
								<div style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>
									Thời hạn: {formatDate(metrics?.contract_expiry_date)}
								</div>
								<Progress 
									percent={metrics?.contract_status === 'active' ? 100 : 0} 
									size="small" 
									strokeColor={metrics?.contract_status === 'active' ? '#10b981' : '#ef4444'} 
									showInfo={false} 
								/>
								<div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
									<span style={{ fontSize: '12px', color: '#64748b' }}>Hợp đồng sở hữu</span>
									<Button size="small" type="link" style={{ padding: 0 }}>Xem hợp đồng</Button>
								</div>
							</>
						)}
					</Card>
				</Col>
			</Row>

			{/* Chi tiết tài chính & đặt tiện ích */}
			<Row gutter={[24, 24]}>
				{/* Bảng kê hóa đơn chi tiết */}
				<Col xs={24} lg={16}>
					<Card 
						title={<span style={{ fontWeight: 600 }}>Chi tiết phí dịch vụ tháng hiện tại</span>} 
						style={{
							borderRadius: '16px',
							boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
							border: '1px solid #f1f5f9'
						}} 
						extra={
							<Button 
								type="link" 
								icon={<RightOutlined />} 
								iconPosition="end" 
								style={{ padding: 0 }}
								onClick={() => history.push('/lich-su-thanh-toan')}
							>
								Lịch sử thanh toán
							</Button>
						}
					>
						<Table 
							dataSource={bills}
							pagination={false}
							size="middle"
							loading={loading}
							rowKey="id"
							columns={[
								{
									title: 'Dịch vụ',
									dataIndex: 'service',
									key: 'service',
									render: (text) => <strong>{text}</strong>
								},
								{
									title: 'Số tiền cần đóng',
									dataIndex: 'amount',
									key: 'amount',
									render: (val) => formatCurrency(val)
								},
								{
									title: 'Trạng thái',
									dataIndex: 'status',
									key: 'status',
									render: (status) => {
										return status === 'paid' 
											? <Badge status="success" text="Đã thanh toán" />
											: <Badge status="error" text="Chưa đóng" />;
									}
								}
							]}
						/>
					</Card>
				</Col>

				{/* Cột đặt chỗ tiện ích */}
				<Col xs={24} lg={8}>
					{/* Lịch hoạt động đặt chỗ */}
					<Card title={<span style={{ fontWeight: 600 }}>Lịch đặt tiện ích sắp tới</span>} style={{
						borderRadius: '16px',
						boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
						border: '1px solid #f1f5f9',
						height: '100%'
					}}>
						{loading ? (
							<Skeleton active paragraph={{ rows: 5 }} />
						) : bookings?.length === 0 ? (
							<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '180px' }}>
								<Empty description="Không có lịch đặt tiện ích sắp tới" image={Empty.PRESENTED_IMAGE_SIMPLE} />
							</div>
						) : (
							<Timeline style={{ marginTop: '8px' }}>
								{bookings.map(item => (
									<Timeline.Item 
										key={item.id} 
										color={item.status === 'approved' ? 'green' : item.status === 'pending' ? 'orange' : 'gray'} 
										dot={<CheckCircleOutlined style={{ fontSize: '16px' }} />}
									>
										<div style={{ fontWeight: 600, fontSize: '13px', color: '#1f2937' }}>
											{item.amenity_name}
										</div>
										<div style={{ fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
											<ClockCircleOutlined />
											{item.time_slot}
										</div>
										<div style={{ marginTop: '4px' }}>
											<Tag color={item.status === 'approved' ? 'success' : item.status === 'pending' ? 'warning' : 'default'}>
												{item.status === 'approved' ? 'Đã duyệt' : item.status === 'pending' ? 'Chờ duyệt' : 'Đã hủy'}
											</Tag>
										</div>
									</Timeline.Item>
								))}
							</Timeline>
						)}
					</Card>
				</Col>
			</Row>

			{/* Tiến trình xử lý yêu cầu sửa chữa (Báo hỏng) */}
			<Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
				<Col xs={24}>
					<Card title={<span style={{ fontWeight: 600 }}>Theo dõi tiến độ xử lý báo hỏng kỹ thuật</span>} style={{
						borderRadius: '16px',
						boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
						border: '1px solid #f1f5f9'
					}}>
						<Table
							dataSource={maintenance}
							pagination={false}
							size="middle"
							loading={loading}
							rowKey="id"
							columns={[
								{
									title: 'Yêu cầu',
									dataIndex: 'title',
									key: 'title',
									render: (title, record) => (
										<div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
											<Avatar style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }} icon={<ToolOutlined />} />
											<div>
												<div style={{ fontWeight: 600, color: '#374151' }}>{title}</div>
												<div style={{ fontSize: '12px', color: '#94a3b8' }}>Mã yêu cầu: {record.id} • Ngày gửi báo cáo: {formatDate(record.date)}</div>
											</div>
										</div>
									)
								},
								{
									title: 'Trạng thái',
									dataIndex: 'status_text',
									key: 'status_text',
									align: 'right',
									render: (status_text, record) => {
										let tagColor = 'default';
										if (record.status === 'in_progress') tagColor = 'processing';
										if (record.status === 'completed') tagColor = 'success';
										if (record.status === 'new') tagColor = 'error';
										return <Tag color={tagColor}>{status_text}</Tag>;
									}
								}
							]}
						/>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default DashboardResident;
