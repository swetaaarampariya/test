
import { JSX, ReactNode } from 'react';


type Data = {
  [key: string]: string | number | boolean | null | { [key: string]: any };
};

export type TableDataT<K = Data> = {
  data: K[];
  totalCount: number;
  isSuccess: boolean;
  error: string;
  isLoading: boolean;
};

export type ColumnT<K = any> = {
  header: string | ReactNode;
  name?: string;
  width?: string;
  maxWidth?: string;
  filterable?: boolean;
  value: (cell: K, i?: number) => JSX.Element | null;
};

export type FilterT = {
  pageSize: number;
  pageIndex: number;
  sortBy: string;
  search: string;
  sortDirection: boolean;
  updateData: boolean;
};

export type customerDetailsT = {
  id: number;
  user_id: any;
  record_id: string;
  account_owner_id: string;
  account_owner: string;
  account_name: string;
  phone: string;
  fax: string;
  parent_account_id: any;
  parent_account: string;
  website: string;
  account_type: string;
  modified_by_id: string;
  modified_by: string;
  modified_time: string;
  billing_street: string;
  billing_city: string;
  billing_code: string;
  last_activity_time: string;
  layout_id: string;
  layout: string;
  tag: any;
  territories: any;
  change_log_time: string;
  locked: string;
  last_enriched_time: any;
  enrich_status: any;
  ship_to_address: string;
  email: string;
  other_email: string;
  group: string;
  dea_lic_num: string;
  dea_expiration: string;
  pharmacy_expiration: string;
  pharmacy_lic_num: string;
  zoho_account_number: string;
  do_not_contact: string;
  ship_to_city: string;
  ship_to_postal_code: string;
  idn_parent: string;
  lead_stage: string;
  idn_or_health_system_affiliation: string;
  dea_license_expiration_date: string;
  price_list: string;
  lead_source1: string;
  shipped_to_state: string;
  billed_to_state: string;
  net_payment_terms: string;
  group_purchasing_organization: string;
  primary_distributor: string;
  bed_size: string;
  onboarding_date: string;
  fishbowl_id: string;
  dummy_deal_creation_field_do_not_edit: string;
  cc_form_on_file: string;
  account_sub_type: string;
  specialty: string;
  automation_field_only: string;
  additional_locations_contacts: string;
  facebook: string;
  tbd_create_deal: string;
  acct_import_deal_creation: string;
  deal_owner_id: any;
  deal_owner: string;
  medical_license_number: string;
  medical_license_expiration_date: string;
  account_bdr_id: any;
  account_bdr: any;
  account_sdr_id: any;
  account_sdr: string;
  npi_expiration: string;
  npi_lic_num: string;
  dotti: string;
  lpg_representative_name: string;
  lpg_representative_email: string;
  representative_code: string;
  representative_first_name: string;
  account: string;
  representative_last_name: string;
  is_invited: boolean;
  is_active: boolean;
};