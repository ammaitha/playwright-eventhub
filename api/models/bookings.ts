import { EventRecord, EventErrorResponse, Pagination } from "./events";

export type BookingStatus = "confirmed" | "cancelled";

export interface CreateBookingInput {
  eventId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  quantity: number;
}

export interface BookingRecord extends CreateBookingInput {
  id: number;
  totalPrice: number | string;
  status: BookingStatus;
  bookingRef: string;
  createdAt: string;
  updatedAt: string;
  event: EventRecord;
}

export interface BookingResponse {
  success: true;
  data: BookingRecord;
}

export interface BookingMutationResponse extends BookingResponse {
  message: string;
}

export interface BookingsResponse {
  success: true;
  data: BookingRecord[];
  pagination: Pagination;
}

export interface BookingDeleteResponse {
  success: true;
  message: string;
}

export interface BookingErrorResponse extends EventErrorResponse {}

export interface BookingQuery {
  eventId?: number;
  status?: BookingStatus;
  page?: number;
  limit?: number;
}
