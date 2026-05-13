declare module MPayment {
  type PaymentMethod = 'cash' | 'bank_transfer' | 'momo' | 'vnpay';
  type InvoiceStatus = 'unpaid' | 'partial' | 'paid' | 'overdue';

  interface IFeeType {
    _id: string;
    name: string;
    description?: string;
  }

  interface IInvoiceDetail {
    _id: string;
    invoice_id: string;
    fee_type_id: IFeeType;
    amount: number;
  }

  interface IRecord {
    _id: string;
    invoice_id: any;
    amount: number;
    payment_method: PaymentMethod;
    transaction_code?: string;
    paid_at: string;
    note?: string;
    received_by?: { _id: string; full_name: string } | null;
    createdAt?: string;
    updatedAt?: string;
  }

  interface IInvoiceLookup {
    _id: string;
    invoice_code: string;
    apartment_id: string;
    billing_month: number;
    billing_year: number;
    total_amount: number;
    paid_amount: number;
    remaining: number;
    due_date: string;
    status: InvoiceStatus;
    details: IInvoiceDetail[];
    payments: IRecord[];
    message?: string;
  }
}
