import type {
  Complaint,
  ComplaintStatus,
  NewComplaintInput,
  Technician,
} from "./types";

/**
 * Base URL of the WeRepair backend API.
 *
 * The backend is expected to run in another container (see the root
 * `docker-compose.yml`). Until then this client talks to a placeholder
 * implementation so the UI can be developed and reviewed.
 */
const BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:3000/api";

export class ApiError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...init,
    });
  } catch {
    throw new ApiError(0, "Unable to reach the WeRepair service.");
  }
  if (!response.ok) {
    let message = `Request failed (${response.status}).`;
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // keep the default message
    }
    throw new ApiError(response.status, message);
  }
  return (await response.json()) as T;
}

export function createComplaint(input: NewComplaintInput): Promise<Complaint> {
  return request("/complaints", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getComplaint(id: string): Promise<Complaint> {
  return request(`/complaints/${id}`);
}

export function getTechnicianJobs(): Promise<Complaint[]> {
  return request("/technician/jobs");
}

export function updateComplaintStatus(
  id: string,
  status: ComplaintStatus,
): Promise<Complaint> {
  return request(`/complaints/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

/** Placeholder used while the backend container is not available yet. */
export function getTechnicians(): Promise<Technician[]> {
  return Promise.resolve([]);
}
