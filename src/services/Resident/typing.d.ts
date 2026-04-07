declare module MResident {
  interface IRecord {
    _id: string
    user_id: string
    apartment_id: string
    id_card_number: string
    id_card_date: string
    id_card_place: string
    id_card_front_image: string
    id_card_back_image: string
    date_of_birth: string
    gender: 'male' | 'female' | 'other'
    permanent_address: string
    move_in_date: string
    move_out_date: string | null
    resident_type: string
    is_primary: boolean
    created_at: string

    user: MUser.IRecord
    apartment: MApartment.IRecord
  }
}
