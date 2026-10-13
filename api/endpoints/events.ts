import { Methods } from "../constants/methods";
import { CONSTANTS } from "../constants/constants";
import { ApiClient, ApiRequest } from "../helpers/api-clients";
import { ApiResponse } from "../helpers/api-clients";
import {
  CreateEventInput,
  EventDeleteResponse,
  EventErrorResponse,
  EventMutationResponse,
  EventResponse,
  EventsResponse,
} from "../models/events";

export class Events {
  constructor(private readonly token: string) {}

  public async getEvents() {
    return this.send<EventsResponse>({
      url: "events",
      method: Methods.GET,
    });
  }

  public async createEvent(event: Partial<CreateEventInput>) {
    return this.send<EventMutationResponse | EventErrorResponse>({
      url: "events",
      method: Methods.POST,
      body: event,
    });
  }

  public async getEventById(id: number) {
    return this.send<EventResponse | EventErrorResponse>({
      url: `events/${id}`,
      method: Methods.GET,
    });
  }

  public async updateEvent(id: number, event: Partial<CreateEventInput>) {
    return this.send<EventMutationResponse | EventErrorResponse>({
      url: `events/${id}`,
      method: Methods.PUT,
      body: event,
    });
  }

  public async deleteEvent(id: number) {
    return this.send<EventDeleteResponse | EventErrorResponse>({
      url: `events/${id}`,
      method: Methods.DELETE,
    });
  }

  private async send<T>(request: Omit<ApiRequest, "headers">): Promise<ApiResponse<T>> {
    const apiClient: ApiClient = await ApiClient.create(CONSTANTS.API_BASE_URL);
    const eventRequest: ApiRequest = {
      ...request,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    };
    return apiClient.send<T>(eventRequest);
  }
}
