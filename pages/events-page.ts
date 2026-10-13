import { expect, Locator, Page } from "@playwright/test";
import { EventRecord } from "../api/models/events";
import { CONSTANTS } from "../api/constants/constants";

export class EventsPage {
  constructor(private readonly page: Page) {}

  public async open(): Promise<void> {
    await this.page.goto(`${CONSTANTS.WEB_BASE_URL}/events`);
  }

  public async openFirstEvent(): Promise<string> {
    const heading = this.page.locator("article").first().getByRole("heading", { level: 3 });
    const title = (await heading.textContent())?.trim();
    if (!title) {
      throw new Error("No event is available to open.");
    }
    await heading.click();
    return title;
  }

  public async expectBookingFormVisible(): Promise<void> {
    await expect(this.page.getByRole("heading", { name: "Book Tickets", exact: true })).toBeVisible();
    await expect(this.page.getByRole("textbox", { name: "Full Name*" })).toBeVisible();
    await expect(this.page.getByRole("textbox", { name: "Email*" })).toBeVisible();
    await expect(this.page.getByRole("textbox", { name: "Phone Number*" })).toBeVisible();
    await expect(this.page.getByRole("button", { name: "Confirm Booking" })).toBeVisible();
  }

  public async fillBookingCustomer(customer: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  }): Promise<void> {
    await this.page.getByRole("textbox", { name: "Full Name*" }).fill(customer.customerName);
    await this.page.getByRole("textbox", { name: "Email*" }).fill(customer.customerEmail);
    await this.page.getByRole("textbox", { name: "Phone Number*" }).fill(customer.customerPhone);
  }

  public async increaseAndRestoreTicketQuantity(): Promise<void> {
    const ticketCount = this.page.getByText("Tickets", { exact: true }).locator("..");
    const decreaseButton = this.page.getByRole("button", { name: "−", exact: true });

    await expect(decreaseButton).toBeDisabled();
    await this.page.getByRole("button", { name: "+", exact: true }).click();
    await expect(ticketCount.getByText("2", { exact: true })).toBeVisible();
    await expect(decreaseButton).toBeEnabled();
    await decreaseButton.click();
    await expect(ticketCount.getByText("1", { exact: true })).toBeVisible();
    await expect(decreaseButton).toBeDisabled();
  }

  public async expectEventVisible(event: EventRecord): Promise<void> {
    const heading = this.page.getByRole("heading", {
      level: 3,
      name: event.title,
      exact: true,
    });
    const card: Locator = this.page.locator("article").filter({ has: heading });

    await expect(card).toHaveCount(1);
    await expect(card).toContainText(event.category);
    await expect(card).toContainText(event.venue);
    await expect(card).toContainText(event.city);
    await expect(card).toContainText(`$${event.price}`);
    await expect(card).toContainText(`${event.availableSeats} seats available`);
  }
}
