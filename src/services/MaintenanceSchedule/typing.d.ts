declare module MMaintenanceSchedule {
  interface IRecord {
    _id?: string;
    id?: string;
    Maintenance_Schedules_id?: string;
    title?: string;
    description?: string;
    frequency?: 'once' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    scheduled_date?: string;
    assigned_to?: string;
    status?: 'scheduled' | 'completed' | 'cancelled';
    created_at?: string;
  }
}
