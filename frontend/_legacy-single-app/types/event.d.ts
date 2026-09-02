export type EventType = 'entry_exit' | 'truck_log' | 'incoming_report';

export interface EntryExitInput {
  visitorName: string;
  visitDate: string;
  visitTime: string;
  purpose: string;
  personToMeet: string;
}

export interface TruckLogInput {
  driverName: string;
  vehicleNumber: string;
  material: string;
  quantity: number;
  rate: number;
}

export interface IncomingReportInput {
  materialName: string;
  quantity: number;
  price: number;
  vendorName: string;
  tradersCompany: string;
}

export interface LiveFeedItem {
  id: number;
  type: EventType;
  created_at: string;
  details: {
    // Entry / Exit
    visitorName?: string;
    visitDate?: string;
    visitTime?: string;
    purpose?: string;
    personToMeet?: string;

    // Truck Log
    driverName?: string;
    vehicleNumber?: string;
    material?: string;
    quantity?: number;
    rate?: number;

    // Incoming Report
    price?: number;
    vendorName?: string;
    tradersCompany?: string;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
  };
}
