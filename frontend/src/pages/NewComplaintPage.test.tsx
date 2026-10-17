// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useParams } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createComplaint } from "../lib/api";
import type { Complaint, DeviceCategory } from "../lib/types";
import NewComplaintPage from "./NewComplaintPage";

vi.mock("../lib/api", () => ({
  createComplaint: vi.fn(),
}));

interface FormValues {
  category: DeviceCategory | "";
  title: string;
  description: string;
  customerName: string;
  customerPhone: string;
  address: string;
}

const validValues: FormValues = {
  category: "electrical",
  title: "Oven not heating",
  description: "The oven stops heating during use.",
  customerName: "Sam Example",
  customerPhone: "555-0100",
  address: "  12 Main Street  ",
};

const complaintResponse: Complaint = {
  id: "complaint-123",
  category: "electrical",
  title: "Oven not heating",
  description: "The oven stops heating during use.",
  customerName: "Sam Example",
  customerPhone: "555-0100",
  address: "12 Main Street",
  createdAt: "2025-01-01T12:00:00.000Z",
  status: "received",
};

function ComplaintDestination() {
  const { id } = useParams();
  return <p>Complaint ID: {id}</p>;
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/new-complaint"]}>
      <Routes>
        <Route path="/new-complaint" element={<NewComplaintPage />} />
        <Route
          path="/complaints/:id"
          element={<ComplaintDestination />}
        />
      </Routes>
    </MemoryRouter>,
  );
}

async function fillForm(overrides: Partial<FormValues> = {}) {
  const user = userEvent.setup();
  const values = { ...validValues, ...overrides };

  async function typeInto(label: RegExp, value: string) {
    if (value) {
      await user.type(screen.getByRole("textbox", { name: label }), value);
    }
  }

  await user.selectOptions(
    screen.getByRole("combobox", { name: /type of device/i }),
    values.category,
  );
  await typeInto(/short description/i, values.title);
  await typeInto(/what is wrong/i, values.description);
  await typeInto(/your name/i, values.customerName);
  await typeInto(/phone number/i, values.customerPhone);
  await typeInto(/address \/ premises/i, values.address);
}

async function submitForm() {
  await userEvent.setup().click(
    screen.getByRole("button", { name: /submit complaint/i }),
  );
}

describe("NewComplaintPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("shows all supported device categories", () => {
    renderPage();

    const categorySelect = screen.getByRole("combobox", {
      name: /type of device/i,
    });
    expect(categorySelect).toHaveDisplayValue("Select…");
    expect(screen.getByRole("option", { name: "Electrical device" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Mechanical device" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Plumbing" })).toBeInTheDocument();
    expect(
      screen.getByRole("option", {
        name: "Heating / ventilation / air conditioning",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Other" })).toBeInTheDocument();
  });

  it("requires a device category", async () => {
    renderPage();
    await fillForm({ category: "" });
    await submitForm();

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Please choose the type of device.",
    );
    expect(createComplaint).not.toHaveBeenCalled();
  });

  it("requires a title with at least five characters", async () => {
    renderPage();
    await fillForm({ title: "Oven" });
    await submitForm();

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Please give the device a short description (at least 5 characters).",
    );
    expect(createComplaint).not.toHaveBeenCalled();
  });

  it("requires a problem description with at least ten characters", async () => {
    renderPage();
    await fillForm({ description: "Broken" });
    await submitForm();

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Please describe the problem in a few words.",
    );
    expect(createComplaint).not.toHaveBeenCalled();
  });

  it("requires the customer's name", async () => {
    renderPage();
    await fillForm({ customerName: "" });
    await submitForm();

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Please tell us your name.",
    );
    expect(createComplaint).not.toHaveBeenCalled();
  });

  it("requires a phone number", async () => {
    renderPage();
    await fillForm({ customerPhone: "" });
    await submitForm();

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Please leave a phone number we can reach you on.",
    );
    expect(createComplaint).not.toHaveBeenCalled();
  });

  it("submits trimmed values and navigates to the created complaint", async () => {
    vi.mocked(createComplaint).mockResolvedValue(complaintResponse);
    renderPage();
    await fillForm();
    await submitForm();

    expect(
      await screen.findByText("Complaint ID: complaint-123"),
    ).toBeInTheDocument();
    expect(createComplaint).toHaveBeenCalledWith({
      category: "electrical",
      title: "Oven not heating",
      description: "The oven stops heating during use.",
      customerName: "Sam Example",
      customerPhone: "555-0100",
      address: "12 Main Street",
    });
  });

  it("displays API errors without navigating", async () => {
    vi.mocked(createComplaint).mockRejectedValue(
      new Error("Service is unavailable."),
    );
    renderPage();
    await fillForm();
    await submitForm();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Service is unavailable.",
    );
    expect(screen.queryByText(/Complaint ID:/)).not.toBeInTheDocument();
  });
});
