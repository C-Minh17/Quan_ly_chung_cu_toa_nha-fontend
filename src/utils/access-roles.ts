export enum RolePhanQuyen {
	// 'super_admin | manager | staff | resident'
	SUPER_ADMIN = "SUPER_ADMIN",
	QUAN_LY = "MANAGER",
	NHAN_VIEN = "STAFF",
	CU_DAN = "RESIDENT"
}

export const ALLOWED_SUPER_ADMIN_ROLES = [RolePhanQuyen.SUPER_ADMIN];
export const ALLOWED_NHAN_VIEN_ROLES = [RolePhanQuyen.NHAN_VIEN];
export const ALLOWED_CU_DAN_ROLES = [RolePhanQuyen.CU_DAN];
export const ALLOWED_QUAN_LY_ROLES = [RolePhanQuyen.QUAN_LY, RolePhanQuyen.SUPER_ADMIN];

// Users with ANY of these roles are allowed into the admin site (at least to see something)
export const AUTHORIZED_ROLES = [
	...ALLOWED_CU_DAN_ROLES,
	...ALLOWED_NHAN_VIEN_ROLES,
	...ALLOWED_QUAN_LY_ROLES,
	...ALLOWED_SUPER_ADMIN_ROLES
];
