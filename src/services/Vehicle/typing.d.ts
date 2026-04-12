declare module MVehicle {
  interface IRecord {
    _id: string;
    resident_id: string;
    license_plate: string;
    vehicle_type: 'motorbike' | 'car' | 'bicycle';
    brand?: string;
    color?: string;
    card_number?: string;
    is_active: boolean;
    deleted?: boolean;
    created_at: string;
    
    resident?: MResident.IRecord;
  }
}
