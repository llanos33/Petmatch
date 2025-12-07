import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  UtensilsCrossed,
  Gamepad2,
  Pill,
  Sparkles,
  SprayCan,
  MoreHorizontal,
  Cat,
  MapPin,
  Stethoscope
} from "lucide-react";
import "./mega-menu.css";

const ICONS = {
  alimento: UtensilsCrossed,
  juguetes: Gamepad2,
  farmapet: Pill,
  accesorios: Sparkles,
  higiene: SprayCan,
  mas: MoreHorizontal,
  arena: Cat,
  puntos: MapPin,
  consultas: Stethoscope
};

export default function MegaMenu({ label, sections }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const btnRef = useRef(null);
  const closeTimer = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };
  const cancelClose = () => clearTimeout(closeTimer.current);

  return (
    <div
      ref={rootRef}
      className="mega-root"
      onMouseLeave={scheduleClose}
      onMouseEnter={cancelClose}
    >
      <button
        ref={btnRef}
        className="mega-trigger"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
      >
        {label}
        <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M5 7l5 6 5-6" fill="currentColor" />
        </svg>
      </button>

      <div
        className={`mega-panel ${open ? "open" : ""}`}
        role="menu"
        aria-label={`Subcategorias de ${typeof label === "string" ? label : "menu"}`}
        onMouseEnter={cancelClose}
      >
        <div className="mega-grid">
          {sections.map((section, idx) => {
            const Icon = section.icon ? ICONS[section.icon] : null;
            return (
              <div className="mega-col" key={`${section.titulo}-${idx}`}>
                <div className="mega-col-header">
                  <div className="mega-title">
                    {Icon && (
                      <span className="mega-title-icon">
                        <Icon size={18} />
                      </span>
                    )}
                    <span>{section.titulo}</span>
                  </div>
                </div>
                <ul className="mega-list">
                  {section.items.map((it, i) => (
                    <li key={`${it.to}-${i}`}>
                      <NavLink
                        className={({ isActive }) =>
                          "mega-link" + (isActive ? " active" : "")
                        }
                        to={it.to}
                        role="menuitem"
                        tabIndex={0}
                      >
                        {it.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
                {section.verTodo && (
                  <Link className="mega-ver-todo" to={section.verTodo}>
                    Ver todo
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
