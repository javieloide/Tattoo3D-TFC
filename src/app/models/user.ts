export interface Roles {
  client?: boolean;
  admin?: boolean;
}

export interface UserInterface{
  id?: string;
  name?: string;
  email: string;
  password?: string;
  roles: Roles;
  city?: string;
  country?: string;
  id_user?: string;
  photo?: string;
  street?: string;
  zip_code?: string;
}

