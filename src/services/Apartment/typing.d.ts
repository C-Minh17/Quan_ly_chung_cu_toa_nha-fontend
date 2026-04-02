declare module MApartment {
  interface IRecord {
    _id?: string;
    apartment_code: string;
    floor_id?: string;
    floor?: MFloor.IRecord;
    area: number;
    num_bedrooms: number;
    num_bathrooms: number;
    apartment_type: string;
    status: string;
    price: number;
    created_at?: string;
    updated_at?: string;
  }
}
