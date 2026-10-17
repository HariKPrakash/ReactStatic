import { useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/new-complaint", label: "Report a fault" },
  { to: "/technician", label: "Technician queue" },
];

export default function Layout() {
  // Collapse the mobile menu whenever the route changes.
  const location = useLocation();
  useEffect(() => {
    document.getElementById("menu-toggle")?.removeAttribute("aria-expanded");
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container site-header__inner">
          <Link to="/" className="brand" aria-label="WeRepair home">
            <span className="brand__mark" aria-hidden="true">
              ⚡
            </span>
            <span className="brand__name">
              We<em>Repair</em>
            </span>
          </Link>
          <button
            id="menu-toggle"
            className="menu-toggle"
            type="button"
            aria-controls="primary-menu"
            aria-expanded="false"
            onClick={() => {
              const toggle = document.getElementById("menu-toggle");
              const menu = document.getElementById("primary-menu");
              const expanded =
                toggle?.getAttribute("aria-expanded") === "true";
              toggle?.setAttribute("aria-expanded", String(!expanded));
              menu?.classList.toggle("is-open", !expanded);
            }}
          >
            <span className="visually-hidden">Toggle navigation</span>
            ☰
          </button>
          <nav id="primary-menu" className="primary-menu" aria-label="Main">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  isActive ? "primary-menu__link is-active" : "primary-menu__link"
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="site-main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container">
          <p>
            ⚡ Repair electrical and mechanical devices — on call, right at your
            premises.
          </p>
        </div>
      </footer>
    </div>
  );
}
