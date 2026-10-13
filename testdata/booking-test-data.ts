import { faker } from "@faker-js/faker";
import { CreateBookingInput } from "../api/models/bookings";

export interface BookingCustomerData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export function createUniqueBookingCustomer(): BookingCustomerData {
  return {
    customerName: faker.person.fullName(),
    customerEmail: faker.internet.email(),
    customerPhone: `+1${faker.string.numeric(10)}`,
  };
}

export function createUniqueBookingInput(eventId: number, quantity = 1): CreateBookingInput {
  return {
    eventId,
    ...createUniqueBookingCustomer(),
    quantity,
  };
}
