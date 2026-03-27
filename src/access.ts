import type { IInitialState } from './services/base/typing';
import { ALLOWED_CU_DAN_ROLES, ALLOWED_NHAN_VIEN_ROLES, ALLOWED_QUAN_LY_ROLES, ALLOWED_SUPER_ADMIN_ROLES } from './utils/access-roles';

/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: IInitialState) {
	const roles = initialState.currentUser?.realm_access?.roles || [];

	const isSuperAdmin = roles.some((r) => ALLOWED_SUPER_ADMIN_ROLES.includes(r as any));
	const isManager = roles.some((r) => ALLOWED_QUAN_LY_ROLES.includes(r as any));
	const isStaff = roles.some((r) => ALLOWED_NHAN_VIEN_ROLES.includes(r as any));
	const isResident = roles.some((r) => ALLOWED_CU_DAN_ROLES.includes(r as any));

	return {
		// chỉ admin
		canAccessSuperAdmin: isSuperAdmin,
		// quản lý và admin
		canAccessManager: isManager,
		// nhân viên
		canAccessStaff: isStaff,
		// cư dân
		canAccessResident: isResident,
	};
}
