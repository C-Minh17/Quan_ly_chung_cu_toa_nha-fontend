declare module MMaintenanceRequest {
  interface IRecord {
    _id?: string;
    id?: string;
    Maintenance_Requests_code?: string;
    apartment_id?: string;
    apartment?: MApartment.IRecord;
    resident_id?: string;
    resident?: any;
    title?: string;
    description?: string;
    category?: 'electrical' | 'plumbing' | 'structure' | 'appliance' | 'other';
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    status?: 'new' | 'assigned' | 'in_progress' | 'completed' | 'closed';
    assigned_to?: string;
    rating?: number;
    feedback?: string;
    created_at?: string;
    completed_at?: string;
  }
}
