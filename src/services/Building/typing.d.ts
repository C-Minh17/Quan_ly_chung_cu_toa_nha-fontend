declare module MBuilding {
  interface IRecord {
    _id?: string;
    name: string;
    address?: string;
    total_floors?: number;
    description?: string;
    status?: string | boolean;
    created_at?: string;
  }
}
