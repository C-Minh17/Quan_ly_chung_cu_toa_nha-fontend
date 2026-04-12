declare module MFloor {
  interface IRecord {
    _id?: string;
    name: string;
    floor_number: number;
    building?: MBuilding.IRecord;
    building_id?: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
    id?: string;
  }
}
