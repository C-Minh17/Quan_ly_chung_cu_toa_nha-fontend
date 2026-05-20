declare module MInvoice {
  interface IDetail {
    id: string;
    fee_type_id: string;
    fee_type?: MFeeType.IRecord;
    quantity: number;
    unit_price: number;
    amount: number;
  }

  interface IRecord {
    _id: string;
    apartment_id: string;
    invoice_code: string;
    billing_month: number;
    billing_year: number;
    total_amount: number;
    paid_amount: number;
    due_date?: string;
    status: 'unpaid' | 'partial' | 'paid' | 'overdue';

    rental_amount?: number;

    apartment?: MApartment.IRecord;

    fixed_amount?: number;
    metered_amount?: number;
    parking_amount?: number;

    fee_breakdown?: {
      fixed_amount: number;
      metered_amount: number;
      parking_amount: number;
      items: IDetail[];
    };

    details?: IDetail[];

    createdAt?: string;
    updatedAt?: string;
    created_at?: string;
    updated_at?: string;
  }
}
