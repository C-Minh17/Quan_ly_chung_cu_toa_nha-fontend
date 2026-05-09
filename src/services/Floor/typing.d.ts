declare module MFloor {
  interface IRecord {
    _id?: string;
    id?: string;
    floor_number?: number;
    building?: MBuilding.IRecord;
    building_id?: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
  }
}
