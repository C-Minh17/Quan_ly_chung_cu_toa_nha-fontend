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
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
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
