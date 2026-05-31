declare module MAmenity {
	export interface IRecord {
		_id?: string;
		id?: string;
		amenities_code?: string;
		name: string;
		description?: string;
		capacity?: number;
		open_time?: string;
		close_time?: string;
		is_active?: boolean;
		created_at?: string;
		updated_at?: string;
	}
}
