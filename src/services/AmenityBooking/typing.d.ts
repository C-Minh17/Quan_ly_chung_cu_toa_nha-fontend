declare module MAmenityBooking {
	export interface IRecord {
		_id?: string;
		id?: string;
		amenities_code?: string;
		resident_id?: any; // có thể là user object hoặc string
		amenity_id?: any; // có thể là amenity object hoặc string
		booking_date?: string | Date;
		start_time?: string | Date;
		end_time?: string | Date;
		num_people?: number;
		status?: 'pending' | 'approved' | 'rejected' | 'cancelled';
		created_at?: string | Date;
		updated_at?: string | Date;
	}
}
