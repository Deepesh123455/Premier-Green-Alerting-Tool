export type EventType = 'entry_exit' | 'truck_log' | 'incoming_report';
export type QuantityUnit = 'MT' | 'KG' | 'G';

export interface EntryExitInput {
  visitorName: string;
  visitDate: string;
  visitTime: string;
  purpose: string;
  personToMeet: string;
}

export interface EntryExitRecord {
  id: number;
  visitor_name: string;
  visit_date: string;
  visit_time: string;
  purpose: string;
  person_to_meet: string;
  created_at: string;
}

export interface TruckLogInput {
  driverName: string;
  vehicleNumber: string;
  material: string;
  quantity: number;
  quantityUnit: QuantityUnit;
  rate: number;
}

export interface TruckLogRecord {
  id: number;
  driver_name: string;
  vehicle_number: string;
  material_id: number;
  quantity: number;
  quantity_unit: QuantityUnit;
  rate: number;
  created_at: string;
  material?: string;
}

export interface IncomingReportInput {
  materialName: string;
  quantity: number;
  quantityUnit: QuantityUnit;
  price: number;
  vendorName: string;
  tradersCompany: string;
}

export interface IncomingReportRecord {
  id: number;
  material_id: number;
  vendor_id: number;
  quantity: number;
  quantity_unit: QuantityUnit;
  price: number;
  created_at: string;
  material?: string;
  vendor_name?: string;
  traders_company?: string;
}

export interface MaterialRecord {
  id: number;
  name: string;
}

export interface VendorRecord {
  id: number;
  vendor_name: string;
  traders_company: string | null;
}

export interface LiveFeedItem {
  id: number;
  type: EventType;
  created_at: string;
  details: Record<string, unknown>;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
  };
}
