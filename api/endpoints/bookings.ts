import { Methods } from "../constants/methods";
import { CONSTANTS } from "../constants/constants";
import { ApiClient, ApiRequest, ApiResponse } from "../helpers/api-clients";
import {
  BookingDeleteResponse,
  BookingErrorResponse,
  BookingMutationResponse,
  BookingQuery,
  BookingResponse,
  BookingsResponse,
  CreateBookingInput,
} from "../models/bookings";

export class Bookings {
  constructor(private readonly token: string) {}

  public async getBookings(query: BookingQuery = {}) {
    return this.send<BookingsResponse | BookingErrorResponse>({
      url: "bookings",
      method: Methods.GET,
      params: this.toParams(query),
    });
  }

  public async createBooking(booking: Partial<CreateBookingInput>) {
    return this.send<BookingMutationResponse | BookingErrorResponse>({
      url: "bookings",
      method: Methods.POST,
      body: booking,
    });
  }

  public async getBookingById(id: number) {
    return this.send<BookingResponse | BookingErrorResponse>({
      url: `bookings/${id}`,
      method: Methods.GET,
    });
  }

  public async getBookingByReference(reference: string) {
    return this.send<BookingResponse | BookingErrorResponse>({
      url: `bookings/ref/${encodeURIComponent(reference)}`,
      method: Methods.GET,
    });
  }

  public async cancelBooking(id: number) {
    return this.send<BookingDeleteResponse | BookingErrorResponse>({
      url: `bookings/${id}`,
      method: Methods.DELETE,
    });
  }

  private toParams(query: BookingQuery): Record<string, string | number> {
    return Object.fromEntries(
      Object.entries(query).filter((entry): entry is [string, string | number] => entry[1] !== undefined),
    );
  }

  private async send<T>(request: Omit<ApiRequest, "headers">): Promise<ApiResponse<T>> {
    const apiClient: ApiClient = await ApiClient.create(CONSTANTS.API_BASE_URL);
    const bookingRequest: ApiRequest = {
      ...request,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    };
    return apiClient.send<T>(bookingRequest);
  }
}
