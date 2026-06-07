import { BulbOutlined, CheckSquareOutlined, CoffeeOutlined, FileTextOutlined, HomeOutlined, RightOutlined, TeamOutlined, ToolOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Card, Checkbox, Col, List, Progress, Row, Skeleton, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { history, useModel } from 'umi';

const DashboardStaff = () => {
	const {
		loading,
		staffInfo,
		metrics,
		tasks,
		recentLogs,
		handleGetStaffData,
		handleUpdateStaffTaskStatus
	} = useModel('dashboard.staff');

	const [hoveredCard, setHoveredCard] = useState<string | null>(null);
	const [hoveredShortcut, setHoveredShortcut] = useState<number | null>(null);

	useEffect(() => {
		handleGetStaffData();
	}, []);

	const handleToggleTask = async (id: string, currentStatus: boolean) => {
		await handleUpdateStaffTaskStatus(id, currentStatus);
	};

	const getPercent = (value: number, total: number) => {
		if (!total) return 0;
		return Math.round((value / total) * 100);
	};

	const shortcuts = [
		{
			id: 1,
			title: 'Ghi chỉ số mới',
			description: 'Nhập chỉ số điện nước định kỳ',
			icon: <BulbOutlined style={{ fontSize: '24px', color: '#6366f1' }} />,
			color: '#e0e7ff',
			borderColor: '#c7d2fe',
			route: '/ghi-dich-vu/ghi-chi-so'
		},
		{
			id: 2,
			title: 'Danh sách Căn hộ',
			description: 'Tra cứu sơ đồ căn hộ, trạng thái',
			icon: <HomeOutlined style={{ fontSize: '24px', color: '#10b981' }} />,
			color: '#d1fae5',
			borderColor: '#a7f3d0',
			route: '/danh-sach-can-ho'
		},
		{
			id: 3,
			title: 'Thông tin Dân cư',
			description: 'Danh sách cư dân, liên hệ khẩn cấp',
			icon: <TeamOutlined style={{ fontSize: '24px', color: '#f59e0b' }} />,
			color: '#fef3c7',
			borderColor: '#fde68a',
			route: '/thong-tin-dan-cu'
		},
		{
			id: 4,
			title: 'Lịch sử ghi số',
			description: 'Nhật ký chỉ số dịch vụ đã ghi',
			icon: <FileTextOutlined style={{ fontSize: '24px', color: '#ec4899' }} />,
			color: '#fce7f3',
			borderColor: '#fbcfe8',
			route: '/ghi-dich-vu/danh-sach'
		}
	];

	return (
		<div style={{
			padding: '24px',
			backgroundColor: '#f8fafc',
			minHeight: '100vh',
			width: '100%',
			overflowX: 'hidden',
			boxSizing: 'border-box'
		}}>
			<div style={{
				background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
				borderRadius: '20px',
				padding: '28px 32px',
				marginBottom: '28px',
				boxShadow: '0 10px 25px -5px rgba(124, 58, 237, 0.08), 0 8px 10px -6px rgba(124, 58, 237, 0.08)',
				border: '1px solid #ddd6fe',
				color: '#1e293b',
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				flexWrap: 'wrap',
				gap: '20px',
				transition: 'all 0.3s ease'
			}}>
				{loading ? (
					<Skeleton active paragraph={{ rows: 2 }} />
				) : (
					<>
						<div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
							<div>
								<h2 style={{ color: '#1e293b', fontSize: '24px', fontWeight: 700, margin: '0 0 6px 0' }}>
									Chào ngày làm việc mới, {staffInfo?.name}!
								</h2>
								<div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
									<Tag color="purple" style={{ fontSize: '13px', padding: '2px 10px', borderRadius: '6px', fontWeight: 500 }}>
										{staffInfo?.role}
									</Tag>
								</div>
							</div>
						</div>
						<div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
							<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
								<Avatar style={{ backgroundColor: '#ffffff', color: '#7c3aed', boxShadow: '0 2px 8px rgba(124, 58, 237, 0.08)' }} icon={<CoffeeOutlined />} />
								<div>
									<div style={{ fontSize: '12px', color: '#64748b' }}>Hỗ trợ kỹ thuật</div>
									<div style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>{staffInfo?.phone}</div>
								</div>
							</div>
						</div>
					</>
				)}
			</div>

			<Row gutter={[24, 24]} style={{ marginBottom: '28px' }}>
				<Col xs={24} sm={12} md={6}>
					<Card
						style={{
							borderRadius: '16px',
							boxShadow: hoveredCard === 'meters' ? '0 12px 20px -5px rgba(99, 102, 241, 0.15)' : '0 4px 6px -1px rgba(0, 0, 0, 0.03)',
							border: hoveredCard === 'meters' ? '1px solid #818cf8' : '1px solid #f1f5f9',
							transform: hoveredCard === 'meters' ? 'translateY(-4px)' : 'translateY(0)',
							transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
							height: '100%',
							cursor: 'pointer'
						}}
						styles={{ body: { padding: '20px' } }}
						onMouseEnter={() => setHoveredCard('meters')}
						onMouseLeave={() => setHoveredCard(null)}
					>
						{loading ? (
							<Skeleton active paragraph={{ rows: 2 }} />
						) : (
							<>
								<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
									<div style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>Chỉ số điện nước</div>
									<Avatar style={{ backgroundColor: '#e0e7ff', color: '#6366f1' }} icon={<BulbOutlined />} />
								</div>
								<div style={{ fontSize: '26px', fontWeight: 700, color: '#1e1b4b', marginBottom: '4px' }}>
									{metrics?.recorded_meters || 0} / {metrics?.total_meters || 0}
								</div>
								<div style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>Căn hộ đã hoàn tất ghi chỉ số</div>
								<Progress
									percent={getPercent(metrics?.recorded_meters || 0, metrics?.total_meters || 0)}
									size="small"
									strokeColor="#6366f1"
									showInfo={false}
								/>
								<div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
									<span style={{ fontSize: '12px', color: '#64748b' }}>Đạt {getPercent(metrics?.recorded_meters || 0, metrics?.total_meters || 0)}% kế hoạch</span>
									<Button
										size="small"
										type="primary"
										style={{ borderRadius: '6px', backgroundColor: '#6366f1', borderColor: '#6366f1' }}
										onClick={() => history.push('/ghi-dich-vu/ghi-chi-so')}
									>
										Ghi tiếp
									</Button>
								</div>
							</>
						)}
					</Card>
				</Col>

				<Col xs={24} sm={12} md={6}>
					<Card
						style={{
							borderRadius: '16px',
							boxShadow: hoveredCard === 'repairs' ? '0 12px 20px -5px rgba(245, 158, 11, 0.15)' : '0 4px 6px -1px rgba(0, 0, 0, 0.03)',
							border: hoveredCard === 'repairs' ? '1px solid #fbbf24' : '1px solid #f1f5f9',
							transform: hoveredCard === 'repairs' ? 'translateY(-4px)' : 'translateY(0)',
							transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
							height: '100%',
							cursor: 'pointer'
						}}
						styles={{ body: { padding: '20px' } }}
						onMouseEnter={() => setHoveredCard('repairs')}
						onMouseLeave={() => setHoveredCard(null)}
					>
						{loading ? (
							<Skeleton active paragraph={{ rows: 2 }} />
						) : (
							<>
								<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
									<div style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>Yêu cầu bảo trì</div>
									<Avatar style={{ backgroundColor: '#fffbeb', color: '#d97706' }} icon={<ToolOutlined />} />
								</div>
								<div style={{ fontSize: '26px', fontWeight: 700, color: '#78350f', marginBottom: '4px' }}>
									{metrics?.pending_repairs || 0} Nhiệm vụ
								</div>
								<div style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>Đang chờ xử lý trong ca trực</div>
								<Progress
									percent={40}
									size="small"
									strokeColor="#f59e0b"
									showInfo={false}
								/>
								<div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
									<span style={{ fontSize: '12px', color: '#64748b' }}>Cần gấp: 2 yêu cầu</span>
									<Tag color="warning" style={{ borderRadius: '4px', margin: 0 }}>Đang chờ</Tag>
								</div>
							</>
						)}
					</Card>
				</Col>

				<Col xs={24} sm={12} md={6}>
					<Card
						style={{
							borderRadius: '16px',
							boxShadow: hoveredCard === 'apartments' ? '0 12px 20px -5px rgba(16, 185, 129, 0.15)' : '0 4px 6px -1px rgba(0, 0, 0, 0.03)',
							border: hoveredCard === 'apartments' ? '1px solid #34d399' : '1px solid #f1f5f9',
							transform: hoveredCard === 'apartments' ? 'translateY(-4px)' : 'translateY(0)',
							transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
							height: '100%',
							cursor: 'pointer'
						}}
						styles={{ body: { padding: '20px' } }}
						onMouseEnter={() => setHoveredCard('apartments')}
						onMouseLeave={() => setHoveredCard(null)}
					>
						{loading ? (
							<Skeleton active paragraph={{ rows: 2 }} />
						) : (
							<>
								<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
									<div style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>Lấp đầy căn hộ</div>
									<Avatar style={{ backgroundColor: '#ecfdf5', color: '#059669' }} icon={<HomeOutlined />} />
								</div>
								<div style={{ fontSize: '26px', fontWeight: 700, color: '#064e3b', marginBottom: '4px' }}>
									{metrics?.occupied_apartments || 0} / {metrics?.total_apartments || 0}
								</div>
								<div style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>Căn hộ đã có dân cư sinh sống</div>
								<Progress
									percent={getPercent(metrics?.occupied_apartments || 0, metrics?.total_apartments || 0)}
									size="small"
									strokeColor="#10b981"
									showInfo={false}
								/>
								<div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
									<span style={{ fontSize: '12px', color: '#64748b' }}>Trống {(metrics?.total_apartments || 0) - (metrics?.occupied_apartments || 0)} căn hộ</span>
									<Button
										size="small"
										type="link"
										style={{ padding: 0, color: '#10b981' }}
										onClick={() => history.push('/danh-sach-can-ho')}
									>
										Chi tiết
									</Button>
								</div>
							</>
						)}
					</Card>
				</Col>

				<Col xs={24} sm={12} md={6}>
					<Card
						style={{
							borderRadius: '16px',
							boxShadow: hoveredCard === 'tasks' ? '0 12px 20px -5px rgba(124, 58, 237, 0.15)' : '0 4px 6px -1px rgba(0, 0, 0, 0.03)',
							border: hoveredCard === 'tasks' ? '1px solid #a78bfa' : '1px solid #f1f5f9',
							transform: hoveredCard === 'tasks' ? 'translateY(-4px)' : 'translateY(0)',
							transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
							height: '100%',
							cursor: 'pointer'
						}}
						styles={{ body: { padding: '20px' } }}
						onMouseEnter={() => setHoveredCard('tasks')}
						onMouseLeave={() => setHoveredCard(null)}
					>
						{loading ? (
							<Skeleton active paragraph={{ rows: 2 }} />
						) : (
							<>
								<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
									<div style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>Nhiệm vụ ca trực</div>
									<Avatar style={{ backgroundColor: '#f5f3ff', color: '#7c3aed' }} icon={<CheckSquareOutlined />} />
								</div>
								<div style={{ fontSize: '26px', fontWeight: 700, color: '#3b0764', marginBottom: '4px' }}>
									{metrics?.today_tasks_done || 0} / {metrics?.today_tasks_total || 0}
								</div>
								<div style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>Đã hoàn thành trong ngày</div>
								<Progress
									percent={getPercent(metrics?.today_tasks_done || 0, metrics?.today_tasks_total || 0)}
									size="small"
									strokeColor="#7c3aed"
									showInfo={false}
								/>
								<div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
									<span style={{ fontSize: '12px', color: '#64748b' }}>Còn {(metrics?.today_tasks_total || 0) - (metrics?.today_tasks_done || 0)} nhiệm vụ</span>
									<span style={{ fontSize: '12px', fontWeight: 600, color: '#7c3aed' }}>
										{getPercent(metrics?.today_tasks_done || 0, metrics?.today_tasks_total || 0)}%
									</span>
								</div>
							</>
						)}
					</Card>
				</Col>
			</Row>

			<h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', marginBottom: '16px' }}>
				Lối tắt thao tác nhanh
			</h3>
			<Row gutter={[20, 20]} style={{ marginBottom: '28px' }}>
				{shortcuts.map((shortcut) => {
					const isHovered = hoveredShortcut === shortcut.id;
					return (
						<Col xs={24} sm={12} md={6} key={shortcut.id}>
							<div
								style={{
									backgroundColor: '#ffffff',
									border: isHovered ? `1px solid ${shortcut.borderColor}` : '1px solid #e2e8f0',
									borderRadius: '16px',
									padding: '20px',
									display: 'flex',
									alignItems: 'center',
									gap: '16px',
									cursor: 'pointer',
									boxShadow: isHovered ? '0 10px 15px -3px rgba(0, 0, 0, 0.04)' : 'none',
									transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
									transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
								}}
								onMouseEnter={() => setHoveredShortcut(shortcut.id)}
								onMouseLeave={() => setHoveredShortcut(null)}
								onClick={() => history.push(shortcut.route)}
							>
								<div style={{
									backgroundColor: shortcut.color,
									width: '48px',
									height: '48px',
									borderRadius: '12px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center'
								}}>
									{shortcut.icon}
								</div>
								<div style={{ flex: 1 }}>
									<div style={{ fontWeight: 600, fontSize: '15px', color: '#0f172a', marginBottom: '2px' }}>
										{shortcut.title}
									</div>
									<div style={{ fontSize: '12px', color: '#64748b' }}>
										{shortcut.description}
									</div>
								</div>
								<RightOutlined style={{ color: '#94a3b8', fontSize: '12px' }} />
							</div>
						</Col>
					);
				})}
			</Row>

			<Row gutter={[24, 24]}>
				<Col xs={24} lg={14}>
					<Card
						title={
							<span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
								<FileTextOutlined style={{ color: '#6366f1' }} />
								Nhật ký ghi chỉ số điện nước gần đây
							</span>
						}
						style={{
							borderRadius: '16px',
							boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03)',
							border: '1px solid #f1f5f9'
						}}
						extra={
							<Button
								type="link"
								icon={<RightOutlined />}
								iconPosition="end"
								style={{ padding: 0, color: '#6366f1' }}
								onClick={() => history.push('/ghi-dich-vu/danh-sach')}
							>
								Xem tất cả
							</Button>
						}
					>
						<Table
							dataSource={recentLogs}
							pagination={false}
							size="middle"
							loading={loading}
							rowKey="id"
							columns={[
								{
									title: 'Căn hộ',
									dataIndex: 'apartment',
									key: 'apartment',
									render: (text) => <strong style={{ color: '#374151' }}>{text}</strong>
								},
								{
									title: 'Loại hình',
									dataIndex: 'type',
									key: 'type',
									render: (type) => (
										<Tag color={type === 'Điện' ? 'blue' : 'cyan'} style={{ borderRadius: '4px' }}>
											{type}
										</Tag>
									)
								},
								{
									title: 'Giá trị ghi',
									dataIndex: 'value',
									key: 'value',
									render: (val) => <span style={{ fontWeight: 600, color: '#111827' }}>{val}</span>
								},
								{
									title: 'Thời gian',
									dataIndex: 'time',
									key: 'time',
									render: (time) => <span style={{ color: '#6b7280', fontSize: '13px' }}>{time}</span>
								},
								{
									title: 'Trạng thái',
									dataIndex: 'status',
									key: 'status',
									render: () => <Badge status="success" text="Đã lưu" />
								}
							]}
						/>
					</Card>
				</Col>

				<Col xs={24} lg={10}>
					<Card
						title={
							<span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
								<UnorderedListOutlined style={{ color: '#7c3aed' }} />
								Nhiệm vụ kiểm tra trong ca
							</span>
						}
						style={{
							borderRadius: '16px',
							boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03)',
							border: '1px solid #f1f5f9',
							height: '100%'
						}}
					>
						{loading ? (
							<Skeleton active paragraph={{ rows: 6 }} />
						) : (
							<List
								itemLayout="horizontal"
								dataSource={tasks}
								renderItem={(item) => (
									<List.Item
										style={{
											padding: '12px 0',
											borderBottom: '1px solid #f1f5f9',
											opacity: item.completed ? 0.7 : 1,
											transition: 'all 0.2s'
										}}
									>
										<div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', width: '100%' }}>
											<Checkbox
												checked={item.completed}
												onChange={() => handleToggleTask(item.id, item.completed)}
												style={{ marginTop: '2px' }}
											/>
											<div style={{ flex: 1 }}>
												<span style={{
													fontSize: '14px',
													color: item.completed ? '#94a3b8' : '#334155',
													textDecoration: item.completed ? 'line-through' : 'none',
													fontWeight: 500
												}}>
													{item.text}
												</span>
												<div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
													<Tag style={{ fontSize: '11px', borderRadius: '4px', margin: 0 }}>
														{item.category}
													</Tag>
													{item.priority === 'high' && (
														<Tag color="red" style={{ fontSize: '11px', borderRadius: '4px', margin: 0 }}>
															Ưu tiên cao
														</Tag>
													)}
													{item.priority === 'medium' && (
														<Tag color="orange" style={{ fontSize: '11px', borderRadius: '4px', margin: 0 }}>
															Trung bình
														</Tag>
													)}
												</div>
											</div>
										</div>
									</List.Item>
								)}
							/>
						)}
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default DashboardStaff;
