import { faker } from "@faker-js/faker";
import { CreateEventInput } from "../api/models/events";

export function createUniqueEventInput(): CreateEventInput {
  return {
    title: `${faker.company.name()} ${faker.string.alphanumeric(8)}`,
    description: faker.lorem.sentence(),
    category: "Conference",
    venue: faker.location.streetAddress(),
    city: faker.location.city(),
    eventDate: faker.date.soon({ days: 90 }).toISOString(),
    price: faker.number.int({ min: 50, max: 1000 }),
    totalSeats: faker.number.int({ min: 20, max: 200 }),
    imageUrl: faker.image.url(),
  };
}
