declare module MUser {
  interface IRecord {
    _id: String;
    sub: string;
    ssoId: string;

    name: string;
    given_name: string;
    family_name: string;
    preferred_username: string;

    email: string;
    email_verified: boolean;
    phone: string;

    role: string;
    realm_access?: {
      roles: string[];
    };

    picture: string;
    is_active: boolean;

    created_at: string;
    updated_at: string;
  }
}