declare module MUtilityReading {
  interface IRecord {
    _id: string;
    apartment_id: string;
    fee_type_id: string;
    reading_month: number;
    reading_year: number;
    previous_reading: number | null;
    current_reading: number | null;
    consumption: number | null;
    recorded_by: string | null;
    recorded_at: string;

    apartment?: MApartment.IRecord;
    fee_type?: MFeeType.IRecord;
    recorder?: MUser.IRecord;
  }
}
