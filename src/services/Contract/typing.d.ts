declare module MContract {
  interface IRecord {
    _id: string;
    apartment_id: string;
    resident_id: string;
    contract_code: string;
    contract_type: 'purchase' | 'rent';
    start_date?: string;
    end_date?: string;
    monthly_price?: number;
    deposit?: number;
    status: 'active' | 'expired' | 'terminated';
    file_url?: string;
    notes?: string;
    created_at: string;
    updated_at: string;

    apartment?: MApartment.IRecord;
    resident?: MResident.IRecord;
    resident_user?: MUser.IRecord;
  }
}
