declare module MFeeType {
  interface IRecord {
    _id?: string;
    name?: string;
    fee_category?: string;
    unit_price?: number;
    unit?: string;
    description?: string;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
  }
}
