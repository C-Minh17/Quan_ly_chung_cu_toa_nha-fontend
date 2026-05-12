declare module MInvoice {
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

    apartment?: MApartment.IRecord;

    createdAt?: string;
    updatedAt?: string;
  }
}
