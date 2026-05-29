export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
		],
	},

	// GROUP TITLE
	// {
	// 	name: 'DashboardGroup',
	// 	path: '/__group__/dashboard',
	// 	disabled: true,
	// },

	///////////////////////////////////

	// DEFAULT MENU

	// quản lý
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'AppstoreOutlined',
		// access: "canAccessManager"
	},
	{
		path: '/quan-ly-tai-khoan',
		name: 'Quản lý tài khoản',
		component: './Quan-ly-tai-khoan',
		icon: 'UserOutlined',
		access: "canAccessManager"
	},
	{
		path: '/quan-ly-toa-nha',
		name: 'Quản lý tòa nhà',
		component: './Quan-ly-toa-nha',
		icon: 'BankOutlined',
		access: "canAccessManager"
	},
	{
		path: '/quan-ly-tang',
		name: 'Quản lý tầng',
		component: './Quan-ly-tang',
		icon: 'ApartmentOutlined',
		access: "canAccessManager"
	},
	{
		path: '/quan-ly-can-ho',
		name: 'Quản lý căn hộ',
		component: './Quan-ly-can-ho',
		icon: 'HomeOutlined',
		access: "canAccessManager"
	},
	{
		path: '/quan-ly-dan-cu',
		name: 'Quản lý dân cư',
		component: './Quan-ly-dan-cu',
		icon: 'TeamOutlined',
		access: "canAccessManager"
	},
	{
		path: '/quan-ly-hop-dong',
		name: 'Quản lý hợp đồng',
		component: './Quan-ly-hop-dong',
		icon: 'FileTextOutlined',
		access: "canAccessManager"
	},
	{
		path: '/danh-sach-ghi-dich-vu',
		name: 'Danh sách ghi dịch vụ',
		component: './Ghi-dich-vu(staff)/Danh-sach',
		icon: 'FileTextOutlined',
		access: "canAccessManager"
	},
	{
		path: '/quan-ly-hoa-don',
		name: 'Quản lý hóa đơn',
		icon: 'FileTextOutlined',
		access: 'canAccessManager',
		routes: [
			{
				path: '/quan-ly-hoa-don/tao-hoa-don',
				name: 'Tạo hóa đơn',
				component: './Quan-ly-hoa-don/Tao-hoa-don',
				access: 'canAccessManager',
			},
			{
				path: '/quan-ly-hoa-don/danh-sach',
				name: 'Danh sách hóa đơn',
				component: './Quan-ly-hoa-don/Danh-sach-hoa-don',
			},
			{
				path: '/quan-ly-hoa-don/danh-sach-overdue',
				name: 'Hóa đơn quá hạn',
				component: './Quan-ly-hoa-don/Danh-sach-hoa-don-overdue',
			},
			{
				path: '/quan-ly-hoa-don/thanh-toan',
				name: 'Thanh toán hóa đơn',
				component: './Quan-ly-hoa-don/Thanh-toan',
			},
			{
				path: '/quan-ly-hoa-don/lich-su-thanh-toan-admin',
				name: 'Lịch sử thanh toán',
				component: './Quan-ly-hoa-don/Lich-su-thanh-toan-admin',
			},
		],
	},
	{
		path: '/quan-ly-phuong-tien',
		name: 'Quản lý phương tiện',
		component: './Quan-ly-phuong-tien',
		icon: 'CarOutlined',
		access: "canAccessManager"
	},

	{
		path: '/quan-ly-bao-tri-admin',
		name: 'Quản lý bảo trì',
		component: './Quan-ly-bao-tri(admin)',
		icon: 'ToolOutlined',
		path: '/quan-ly-loai-phi',
		name: 'Quản lý loại phí',
		component: './Quan-ly-loai-phi',
		icon: 'FileTextOutlined',
		access: "canAccessManager"
	},
	{
		path: '/quan-ly-tien-ich',
		name: 'Quản lý tiện ích',
		component: './Quan-ly-tien-ich(admin)',
		icon: 'AppstoreAddOutlined',
		access: "canAccessManager"
	},

	// cư dân
	{
		path: '/thong-tin-ca-nhan',
		name: 'Thông tin cá nhân',
		component: './Thong-tin-ca-nhan(resident)',
		icon: 'UserOutlined',
		access: "canAccessResident"
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/thong-tin-hop-dong',
		name: 'Thông tin hợp đồng',
		component: './Thong-tin-hop-dong(resident)',
		icon: 'FileTextOutlined',
		access: "canAccessResident"
	},
	{
		path: '/phuong-tien',
		name: 'Phương tiện',
		component: './Phuong-tien(resident)',
		icon: 'CarOutlined',
		access: "canAccessResident"
	},
	{
		path: '/quan-ly-bao-tri',
		name: 'Quản lý bảo trì',
		component: './Yeu-cau-bao-tri(resident)',
		icon: 'ToolOutlined',
		access: "canAccessResident"
	},
	{
		path: '/hoa-don-cua-toi',
		name: 'Hóa đơn của tôi',
		component: './Quan-ly-hoa-don/Hoa-don-cua-toi(resident)',
		icon: 'FileTextOutlined',
		access: "canAccessResident"
	},
	{
		path: '/lich-su-thanh-toan',
		name: 'Lịch sử thanh toán',
		component: './Quan-ly-hoa-don/Lich-su-thanh-toan',
		icon: 'HistoryOutlined',
		access: "canAccessResident"
	},
	{
		path: '/dat-tien-ich',
		name: 'Đặt tiện ích',
		component: './Dat-tien-ich(resident)',
		icon: 'CalendarOutlined',
		access: "canAccessResident"
	},


	// nhân viên
	{
		path: '/ghi-dich-vu',
		name: 'Ghi dịch vụ',
		icon: 'FileTextOutlined',
		access: "canAccessStaff",
		routes: [
			{
				path: '/ghi-dich-vu/ghi-chi-so',
				name: 'Ghi chỉ số',
				component: './Ghi-dich-vu(staff)/Ghi-chi-so',
				icon: 'FileTextOutlined',
			},
			{
				path: '/ghi-dich-vu/danh-sach',
				name: 'Danh sách',
				component: './Ghi-dich-vu(staff)/Danh-sach',
				icon: 'FileTextOutlined',
			},
		],
	},

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		path: '/*',
		component: './exception/404',
		layout: false,
	},
];
