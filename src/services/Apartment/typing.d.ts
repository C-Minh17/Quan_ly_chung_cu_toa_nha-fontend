declare module MApartment {
  interface IRecord {
    _id?: string;
    id?: string;
    apartment_code?: string;
    floor_id?: string;
    floor?: MFloor.IRecord;
    building_id?: string;
    area?: number;
    num_bedrooms?: number;
    num_bathrooms?: number;
    apartment_type?: string;
    status?: string;
    price?: number;
    contract_number?: string;
    contract_start_date?: string;
    contract_end_date?: string;
    contract_status?: string;
    contract_file?: string;
    created_at?: string;
    updated_at?: string;
  }
}
