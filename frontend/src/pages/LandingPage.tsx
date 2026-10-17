import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <section className="hero">
      <div className="container hero__inner">
        <p className="hero__eyebrow">Electrical &amp; mechanical repair, on call</p>
        <h1>We come to your premises. You relax.</h1>
        <p className="hero__lead">
          Report a faulty device in seconds and the nearest available
          electrician or mechanic is assigned automatically — before you even
          hang up the phone.
        </p>
        <div className="hero__actions">
          <Link className="button button--primary" to="/new-complaint">
            Report a fault
          </Link>
          <Link className="button button--secondary" to="/technician">
            Technician queue
          </Link>
        </div>
      </div>
    </section>
  );
}
