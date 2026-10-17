import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Complaint } from "../lib/types";
import { getTechnicianJobs } from "../lib/api";

/**
 * Queue of complaints assigned to the technician using this browser.
 *
 * Authentication and the automatic assignment itself live in the backend;
 * until then this page demonstrates the shape of the data.
 */
export default function TechnicianPage() {
  const [complaints, setComplaints] = useState<Complaint[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getTechnicianJobs()
      .then((jobs) => {
        if (!cancelled) setComplaints(jobs);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "The technician queue is unavailable.",
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="section">
      <div className="container container--narrow">
        <h1>Technician queue</h1>
        <p className="section__lead">
          Complaints assigned to you will appear here, together with the contact
          details of the customer.
        </p>
        {error && (
          <p className="alert" role="alert">
            {error}
          </p>
        )}
        {complaints === null && !error && <p>Loading…</p>}
        {complaints !== null && complaints.length === 0 && (
          <p>You have no assigned complaints.</p>
        )}
        {complaints !== null && complaints.length > 0 && (
          <ul className="job-list">
            {complaints.map((complaint) => (
              <li className="job" key={complaint.id}>
                <div>
                  <strong>{complaint.title}</strong>
                  <p>{complaint.description}</p>
                  <p className="job__meta">
                    {complaint.customerName} · {complaint.customerPhone} ·{" "}
                    {complaint.address}
                  </p>
                </div>
                <Link className="button button--secondary" to={`/complaints/${complaint.id}`}>
                  Open
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
