import { expect, Locator, Page } from "@playwright/test";
import { BookingRecord } from "../api/models/bookings";
import { CONSTANTS } from "../api/constants/constants";
export class BookingsPage {
  constructor(private readonly page: Page) {}

  public async open(): Promise<void> {
    await this.page.goto(`${CONSTANTS.WEB_BASE_URL}/bookings`);
  }

  public async expectBookingsPageLoaded(): Promise<void> {
    await expect(this.page.getByRole("heading", { name: "My Bookings", exact: true })).toBeVisible();
    await expect(this.page.getByText("View and manage all your ticket bookings", { exact: true })).toBeVisible();
  }

  public async expectBookingVisible(booking: BookingRecord): Promise<void> {
    const eventHeading = this.page.getByRole("heading", {
      level: 3,
      name: booking.event.title,
      exact: true,
    });
    const bookingCard: Locator = eventHeading.locator(
      `xpath=ancestor::div[.//a[@href="/bookings/${booking.id}"]][1]`,
    );

    await expect(eventHeading).toBeVisible();
    await expect(bookingCard).toHaveCount(1);
    await expect(bookingCard.getByText(booking.bookingRef, { exact: true })).toBeVisible();
    await expect(bookingCard.getByText(booking.status, { exact: true })).toBeVisible();
    await expect(bookingCard.getByText(`#${booking.id}`, { exact: true })).toBeVisible();
    await expect(bookingCard).toContainText(`${booking.quantity} ticket${booking.quantity === 1 ? "" : "s"}`);
    await expect(bookingCard).toContainText(booking.event.city);
    await expect(bookingCard).toContainText(
      new Date(booking.event.eventDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    );
    const formattedTotal = Number(booking.totalPrice).toLocaleString("en-US");
    await expect(bookingCard.getByText(`$${formattedTotal}`, { exact: true })).toBeVisible();
  }
}
