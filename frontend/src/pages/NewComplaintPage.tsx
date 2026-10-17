import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { DeviceCategory } from "../lib/types";
import { createComplaint } from "../lib/api";

const CATEGORIES: DeviceCategory[] = [
  "electrical",
  "mechanical",
  "hvac",
  "plumbing",
  "other",
];

interface FormState {
  category: DeviceCategory | "";
  title: string;
  description: string;
  customerName: string;
  customerPhone: string;
  address: string;
}

const initialForm: FormState = {
  category: "",
  title: "",
  description: "",
  customerName: "",
  customerPhone: "",
  address: "",
};

export default function NewComplaintPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function validate(): string | null {
    if (form.title.trim().length < 5)
      return "Please give the device a short description (at least 5 characters).";
    if (form.description.trim().length < 10)
      return "Please describe the problem in a few words.";
    if (form.customerName.trim().length === 0)
      return "Please tell us your name.";
    if (form.customerPhone.trim().length === 0)
      return "Please leave a phone number we can reach you on.";
    return null;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.category) {
      setError("Please choose the type of device.");
      return;
    }
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const complaint = await createComplaint({
        category: form.category,
        title: form.title.trim(),
        description: form.description.trim(),
        customerName: form.customerName.trim(),
        customerPhone: form.customerPhone.trim(),
        address: form.address.trim(),
      });
      setSubmitting(false);
      navigate(`/complaints/${complaint.id}`, { replace: true });
    } catch (err) {
      setSubmitting(false);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  return (
    <section className="section">
      <div className="container container--narrow">
        <h1>Report a fault</h1>
        <p className="section__lead">
          Tell us what broke and where. A technician is assigned automatically
          and will come to your premises as soon as possible.
        </p>
        {error && (
          <p className="alert" role="alert">
            {error}
          </p>
        )}
        <form className="form" onSubmit={onSubmit} noValidate>
          <div className="field">
            <label htmlFor="category">Type of device *</label>
            <select
              id="category"
              value={form.category}
              onChange={(event) =>
                update("category", event.target.value as DeviceCategory | "")
              }
            >
              <option value="">Select…</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {labelFor(category)}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="title">Short description *</label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={(event) => update("title", event.target.value)}
              placeholder="e.g. The oven stops heating"
            />
          </div>
          <div className="field">
            <label htmlFor="description">What is wrong? *</label>
            <textarea
              id="description"
              rows={4}
              value={form.description}
              onChange={(event) => update("description", event.target.value)}
              placeholder="Describe the symptoms so we can prepare the right parts."
            />
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="customerName">Your name *</label>
              <input
                id="customerName"
                type="text"
                value={form.customerName}
                onChange={(event) => update("customerName", event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="customerPhone">Phone number *</label>
              <input
                id="customerPhone"
                type="tel"
                value={form.customerPhone}
                onChange={(event) => update("customerPhone", event.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="address">Address / premises</label>
            <input
              id="address"
              type="text"
              value={form.address}
              onChange={(event) => update("address", event.target.value)}
              placeholder="Street, number, postcode"
            />
          </div>
          <button className="button button--primary" type="submit" disabled={submitting}>
            {submitting ? "Sending…" : "Submit complaint"}
          </button>
        </form>
      </div>
    </section>
  );
}

function labelFor(category: DeviceCategory): string {
  switch (category) {
    case "electrical":
      return "Electrical device";
    case "mechanical":
      return "Mechanical device";
    case "hvac":
      return "Heating / ventilation / air conditioning";
    case "plumbing":
      return "Plumbing";
    default:
      return "Other";
  }
}
