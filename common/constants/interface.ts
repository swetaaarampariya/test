export interface CountryOption {
    value: string | number;
    label: string;
}
  
export interface SelectOption {
    value: string | number;
    label: string;
  }
  
export interface CountryList {
    isoCode: string;
    name: string;
  }

  export interface StateList {
    isoCode: string;
    name: string;
  }

  export interface CityList {
    name: string;
  }

  export interface SpecializationList {
    isActive:boolean;
    id:number;
    specializationName: string;
  }

  export interface InterestList {
    isActive:boolean;
    id:number;
    interestName: string;
  }
  
  export interface Role {
    id: number; 
    displayName: string;
}

export interface ActivityList {
  isActive:boolean;
  id:number;
  activityName: string;
  }

  export interface AddEditActivityProps {
    toggleModal: () => void;
    title?: string | boolean;
    data?: { id?: string; activityName?: string };
    setTableFilter: (filter: (prev: any) => any) => void;
    tableData?: { data: { activityName: string }[] };
    collapsed?: boolean;
  }

  export interface AddEditInterestsProps {
    toggleModal: () => void;
    title?: string | boolean;
    data?: { id?: string; interestName?: string };
    setTableFilter: (filter: (prev: any) => any) => void;
    tableData?: { data: { interestName: string }[] };
    collapsed?: boolean;
  }

  export interface AddEditSpecializationProps {
    toggleModal: () => void;
    title?: string | boolean;
    data?: { id?: string; specializationName?: string };
    setTableFilter: (filter: (prev: any) => any) => void;
    tableData?: { data: { specializationName: string }[] };
    collapsed?: boolean;
  }