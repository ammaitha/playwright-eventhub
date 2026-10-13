export interface CreateEventInput {
  title: string;
  description?: string;
  category: string;
  venue: string;
  city: string;
  eventDate: string;
  price: number;
  totalSeats: number;
  imageUrl?: string;
}

export interface EventRecord extends Omit<CreateEventInput, "price" | "imageUrl"> {
  id: number;
  description?: string;
  price: number | string;
  availableSeats: number;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  isStatic?: boolean;
  userId?: number | null;
}

export interface EventsResponse {
  success: true;
  data: EventRecord[];
  pagination: Pagination;
}

export interface EventResponse {
  success: true;
  data: EventRecord;
}

export interface EventMutationResponse extends EventResponse {
  message: string;
}

export interface EventDeleteResponse {
  success: true;
  message: string;
}

export interface EventErrorResponse {
  success: false;
  error: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type Events = EventsResponse;
