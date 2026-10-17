import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Complaint } from "../lib/types";
import { getComplaint, updateComplaintStatus } from "../lib/api";

const FLOW: Complaint["status"][] = [
  "received",
  "dispatched",
  "en-route",
  "in-progress",
  "resolved",
];

export default function ComplaintDetailPage() {
  const { id = "" } = useParams();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getComplaint(id)
      .then((loaded) => {
        if (!cancelled) setComplaint(loaded);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "This complaint could not be loaded.",
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function advanceStatus() {
    if (!complaint) return;
    const currentIndex = FLOW.indexOf(complaint.status);
    const next = currentIndex === -1 ? null : FLOW[currentIndex + 1];
    if (!next) return;
    setComplaint(await updateComplaintStatus(complaint.id, next));
  }

  if (error) {
    return (
      <section className="section">
        <div className="container container--narrow">
          <p className="alert" role="alert">
            {error}
          </p>
          <Link className="button button--secondary" to="/">
            Back to home
          </Link>
        </div>
      </section>
    );
  }

  if (!complaint) {
    return (
      <section className="section">
        <div className="container container--narrow">
          <p>Loading complaint…</p>
        </div>
      </section>
    );
  }

  const currentIndex = FLOW.indexOf(complaint.status);
  const currentStep =
    currentIndex === -1 ? FLOW.length - 1 : currentIndex;

  return (
    <section className="section">
      <div className="container container--narrow">
        <p>
          <Link to="/">← Back to home</Link>
        </p>
        <h1>Complaint {complaint.id}</h1>
        <p className="section__lead">
          {complaint.title} — {complaint.description}
        </p>

        <ol className="status-flow" aria-label="Progress">
          {FLOW.map((step, index) => (
            <li
              key={step}
              className={
                index < currentIndex
                  ? "is-done"
                  : index === currentIndex
                    ? "is-current"
                    : ""
              }
            >
              <span className="status-flow__dot" aria-hidden="true" />
              {step}
            </li>
          ))}
        </ol>

        {complaint.technician ? (
          <p>
            Assigned to <strong>{complaint.technician.name}</strong> (
            {complaint.technician.trade}) — call them on{" "}
            {complaint.technician.phone}.
          </p>
        ) : (
          <p>No technician assigned yet — we are finding the nearest one.</p>
        )}
        {complaint.scheduledAt && (
          <p>
            Best time to visit:{" "}
            {new Date(complaint.scheduledAt).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        )}

        <button
          className="button button--secondary"
          type="button"
          onClick={advanceStatus}
          disabled={currentStep >= FLOW.length - 1}
        >
          Simulate technician progress
        </button>
      </div>
    </section>
  );
}
