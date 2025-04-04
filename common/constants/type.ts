export type Roles = {
    id: number;
    roleName: string;
    displayName: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  

export interface Address {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    address:string;
  }
  
export  interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    city: string;
    state: string;
    specialization: string;
    country: string;
    about: string;
    isFacilityManagerApproved: boolean;
    addresses: Address[];
    password? :string
    gender?:string
    interests? :[]
    weight? : string
    height? : string
    activities : []
  }
  
  export type UserInfo = {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    gender?: string;
  };

  export type RoleListT = {
    id: number;
    role_name: string;
    display_name: string;
    description: string;
    is_active: boolean;
    is_default: boolean;
    created_at: string;
    updated_at: string;
  };
  