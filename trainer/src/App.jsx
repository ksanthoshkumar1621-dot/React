import { useMemo, useState } from "react";
import "./App.css";

const INITIAL_SESSIONS = [
  {
    id: 1,
    title: "Morning HIIT Bootcamp",
    trainer: "Sarah Chen",
    date: "2026-06-16",
    time: "07:00",
    duration: 60,
    location: "Studio A",
    capacity: 20,
    attendees: [
      { id: 1, name: "Alex Rivera", status: "present", checkIn: "06:52" },
      { id: 2, name: "Jordan Lee", status: "present", checkIn: "06:58" },
      { id: 3, name: "Morgan Blake", status: "late", checkIn: "07:12" },
      { id: 4, name: "Taylor Kim", status: "absent", checkIn: null },
      { id: 5, name: "Casey Wong", status: "present", checkIn: "06:55" },
    ],
  },
  {
    id: 2,
    title: "Strength & Conditioning",
    trainer: "Marcus Johnson",
    date: "2026-06-16",
    time: "10:30",
    duration: 75,
    location: "Weight Room",
    capacity: 15,
    attendees: [
      { id: 6, name: "Riley Adams", status: "present", checkIn: "10:25" },
      { id: 7, name: "Sam Patel", status: "present", checkIn: "10:28" },
      { id: 8, name: "Drew Martinez", status: "present", checkIn: "10:22" },
      { id: 9, name: "Jamie Foster", status: "absent", checkIn: null },
    ],
  },
  {
    id: 3,
    title: "Yoga Flow & Recovery",
    trainer: "Priya Sharma",
    date: "2026-06-16",
    time: "17:00",
    duration: 45,
    location: "Studio B",
    capacity: 25,
    attendees: [
      { id: 10, name: "Chris Nguyen", status: "present", checkIn: "16:55" },
      { id: 11, name: "Avery Brooks", status: "late", checkIn: "17:08" },
      { id: 12, name: "Quinn Ellis", status: "present", checkIn: "16:58" },
      { id: 13, name: "Blake Turner", status: "present", checkIn: "17:01" },
      { id: 14, name: "Skyler Reed", status: "absent", checkIn: null },
      { id: 15, name: "Finley Gray", status: "present", checkIn: "16:50" },
    ],
  },
  {
    id: 4,
    title: "Boxing Fundamentals",
    trainer: "Marcus Johnson",
    date: "2026-06-17",
    time: "08:00",
    duration: 60,
    location: "Ring Area",
    capacity: 12,
    attendees: [
      { id: 16, name: "Alex Rivera", status: "present", checkIn: "07:55" },
      { id: 17, name: "Jordan Lee", status: "absent", checkIn: null },
      { id: 18, name: "Morgan Blake", status: "present", checkIn: "07:58" },
    ],
  },
  {
    id: 5,
    title: "Spin & Endurance",
    trainer: "Sarah Chen",
    date: "2026-06-17",
    time: "18:30",
    duration: 50,
    location: "Cycle Studio",
    capacity: 30,
    attendees: [
      { id: 19, name: "Taylor Kim", status: "present", checkIn: "18:25" },
      { id: 20, name: "Casey Wong", status: "present", checkIn: "18:28" },
      { id: 21, name: "Riley Adams", status: "late", checkIn: "18:40" },
      { id: 22, name: "Sam Patel", status: "present", checkIn: "18:22" },
    ],
  },
];

const STATUS_OPTIONS = ["present", "late", "absent"];

function formatDate(dateStr) {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function getAttendanceStats(attendees) {
  const present = attendees.filter((a) => a.status === "present").length;
  const late = attendees.filter((a) => a.status === "late").length;
  const absent = attendees.filter((a) => a.status === "absent").length;
  const total = attendees.length;
  const rate = total ? Math.round(((present + late) / total) * 100) : 0;
  return { present, late, absent, total, rate };
}

function AttendanceRing({ rate }) {
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (rate / 100) * circumference;

  return (
    <div className="attendance-ring" aria-label={`${rate}% attendance`}>
      <svg viewBox="0 0 80 80" role="img">
        <circle className="ring-bg" cx="40" cy="40" r="36" />
        <circle
          className="ring-fill"
          cx="40"
          cy="40"
          r="36"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="ring-label">{rate}%</span>
    </div>
  );
}

function StatCard({ icon, label, value, trend, accent }) {
  return (
    <article className={`stat-card stat-card--${accent}`}>
      <div className="stat-card__icon" aria-hidden="true">
        {icon}
      </div>
      <div className="stat-card__body">
        <p className="stat-card__label">{label}</p>
        <p className="stat-card__value">{value}</p>
        {trend && <p className="stat-card__trend">{trend}</p>}
      </div>
    </article>
  );
}

function SessionCard({ session, isSelected, onSelect }) {
  const stats = getAttendanceStats(session.attendees);

  return (
    <button
      type="button"
      className={`session-card ${isSelected ? "session-card--active" : ""}`}
      onClick={() => onSelect(session.id)}
    >
      <div className="session-card__header">
        <span className="session-card__time">{session.time}</span>
        <span className={`badge badge--${stats.rate >= 80 ? "success" : stats.rate >= 60 ? "warning" : "danger"}`}>
          {stats.rate}%
        </span>
      </div>
      <h3 className="session-card__title">{session.title}</h3>
      <p className="session-card__meta">
        {session.trainer} · {session.location}
      </p>
      <div className="session-card__footer">
        <span>{formatDate(session.date)}</span>
        <span>
          {stats.present + stats.late}/{stats.total} checked in
        </span>
      </div>
    </button>
  );
}

function AttendeeRow({ attendee, onStatusChange }) {
  return (
    <li className="attendee-row">
      <div className="attendee-row__info">
        <span className="attendee-row__avatar" aria-hidden="true">
          {attendee.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </span>
        <div>
          <p className="attendee-row__name">{attendee.name}</p>
          {attendee.checkIn && (
            <p className="attendee-row__checkin">Checked in at {attendee.checkIn}</p>
          )}
        </div>
      </div>
      <div className="attendee-row__actions">
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status}
            type="button"
            className={`status-btn status-btn--${status} ${attendee.status === status ? "status-btn--active" : ""}`}
            onClick={() => onStatusChange(attendee.id, status)}
            aria-pressed={attendee.status === status}
            aria-label={`Mark ${attendee.name} as ${status}`}
          >
            {status}
          </button>
        ))}
      </div>
    </li>
  );
}

export default function App() {
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [selectedId, setSelectedId] = useState(INITIAL_SESSIONS[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [trainerFilter, setTrainerFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const trainers = useMemo(
    () => [...new Set(sessions.map((s) => s.trainer))].sort(),
    [sessions]
  );

  const dates = useMemo(
    () => [...new Set(sessions.map((s) => s.date))].sort(),
    [sessions]
  );

  const filteredSessions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return sessions.filter((session) => {
      const matchesTrainer = trainerFilter === "all" || session.trainer === trainerFilter;
      const matchesDate = dateFilter === "all" || session.date === dateFilter;
      const matchesSearch =
        !query ||
        session.title.toLowerCase().includes(query) ||
        session.trainer.toLowerCase().includes(query) ||
        session.location.toLowerCase().includes(query);
      return matchesTrainer && matchesDate && matchesSearch;
    });
  }, [sessions, searchQuery, trainerFilter, dateFilter]);

  const selectedSession = sessions.find((s) => s.id === selectedId) ?? filteredSessions[0];

  const dashboardStats = useMemo(() => {
    const allAttendees = sessions.flatMap((s) => s.attendees);
    const stats = getAttendanceStats(allAttendees);
    const todaySessions = sessions.filter((s) => s.date === "2026-06-16").length;
    const avgRate =
      sessions.length > 0
        ? Math.round(
            sessions.reduce((sum, s) => sum + getAttendanceStats(s.attendees).rate, 0) /
              sessions.length
          )
        : 0;

    return {
      totalSessions: sessions.length,
      avgAttendance: avgRate,
      activeTrainers: trainers.length,
      todaySessions,
      ...stats,
    };
  }, [sessions, trainers]);

  function updateAttendeeStatus(sessionId, attendeeId, status) {
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id !== sessionId) return session;
        return {
          ...session,
          attendees: session.attendees.map((attendee) => {
            if (attendee.id !== attendeeId) return attendee;
            const now = new Date();
            const checkIn =
              status === "absent"
                ? null
                : `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
            return { ...attendee, status, checkIn };
          }),
        };
      })
    );
  }

  const sessionStats = selectedSession ? getAttendanceStats(selectedSession.attendees) : null;

  return (
    <div className="dashboard">
      <div className="dashboard__bg" aria-hidden="true" />

      <header className="header">
        <div className="header__brand">
          <div className="header__logo" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none">
              <rect x="4" y="8" width="24" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
              <path d="M10 14h12M10 18h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="24" cy="12" r="3" fill="currentColor" />
            </svg>
          </div>
          <div>
            <p className="header__eyebrow">FitTrack Pro</p>
            <h1 className="header__title">Trainer Session Attendance</h1>
          </div>
        </div>
        <div className="header__date">
          <span className="header__date-label">Today</span>
          <time dateTime="2026-06-16">Monday, June 16, 2026</time>
        </div>
      </header>

      <section className="stats-grid" aria-label="Dashboard statistics">
        <StatCard
          icon="📋"
          label="Total Sessions"
          value={dashboardStats.totalSessions}
          trend="This week"
          accent="blue"
        />
        <StatCard
          icon="✓"
          label="Avg. Attendance"
          value={`${dashboardStats.avgAttendance}%`}
          trend="+4% vs last week"
          accent="green"
        />
        <StatCard
          icon="👤"
          label="Active Trainers"
          value={dashboardStats.activeTrainers}
          trend="All certified"
          accent="purple"
        />
        <StatCard
          icon="📅"
          label="Today's Sessions"
          value={dashboardStats.todaySessions}
          trend="3 scheduled"
          accent="orange"
        />
      </section>

      <div className="toolbar">
        <div className="search-box">
          <svg className="search-box__icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
            <path d="M14 14l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            className="search-box__input"
            placeholder="Search sessions, trainers, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search sessions"
          />
        </div>
        <div className="toolbar__filters">
          <select
            className="filter-select"
            value={trainerFilter}
            onChange={(e) => setTrainerFilter(e.target.value)}
            aria-label="Filter by trainer"
          >
            <option value="all">All Trainers</option>
            {trainers.map((trainer) => (
              <option key={trainer} value={trainer}>
                {trainer}
              </option>
            ))}
          </select>
          <select
            className="filter-select"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            aria-label="Filter by date"
          >
            <option value="all">All Dates</option>
            {dates.map((date) => (
              <option key={date} value={date}>
                {formatDate(date)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <main className="main-layout">
        <aside className="session-list" aria-label="Session list">
          <h2 className="section-title">
            Sessions
            <span className="section-title__count">{filteredSessions.length}</span>
          </h2>
          <div className="session-list__scroll">
            {filteredSessions.length === 0 ? (
              <p className="empty-state">No sessions match your filters.</p>
            ) : (
              filteredSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  isSelected={selectedSession?.id === session.id}
                  onSelect={setSelectedId}
                />
              ))
            )}
          </div>
        </aside>

        <section className="session-detail" aria-label="Session details">
          {selectedSession ? (
            <>
              <div className="session-detail__hero">
                <div className="session-detail__info">
                  <span className="session-detail__badge">{selectedSession.duration} min</span>
                  <h2 className="session-detail__title">{selectedSession.title}</h2>
                  <p className="session-detail__subtitle">
                    Led by <strong>{selectedSession.trainer}</strong> · {selectedSession.location}
                  </p>
                  <div className="session-detail__chips">
                    <span className="chip">
                      <svg viewBox="0 0 16 16" aria-hidden="true">
                        <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" fill="none" />
                        <path d="M2 6h12M5 1v3M11 1v3" stroke="currentColor" strokeLinecap="round" />
                      </svg>
                      {formatDate(selectedSession.date)}
                    </span>
                    <span className="chip">
                      <svg viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6" stroke="currentColor" fill="none" />
                        <path d="M8 5v3.5l2 1.5" stroke="currentColor" strokeLinecap="round" />
                      </svg>
                      {selectedSession.time}
                    </span>
                    <span className="chip">
                      <svg viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M3 12V6l5-3 5 3v6l-5 3-5-3z" stroke="currentColor" fill="none" />
                      </svg>
                      {sessionStats.total}/{selectedSession.capacity} enrolled
                    </span>
                  </div>
                </div>
                {sessionStats && <AttendanceRing rate={sessionStats.rate} />}
              </div>

              <div className="attendance-summary">
                <div className="attendance-summary__item attendance-summary__item--present">
                  <span className="attendance-summary__num">{sessionStats.present}</span>
                  <span className="attendance-summary__label">Present</span>
                </div>
                <div className="attendance-summary__item attendance-summary__item--late">
                  <span className="attendance-summary__num">{sessionStats.late}</span>
                  <span className="attendance-summary__label">Late</span>
                </div>
                <div className="attendance-summary__item attendance-summary__item--absent">
                  <span className="attendance-summary__num">{sessionStats.absent}</span>
                  <span className="attendance-summary__label">Absent</span>
                </div>
              </div>

              <div className="attendee-panel">
                <h3 className="attendee-panel__title">Mark Attendance</h3>
                <ul className="attendee-list">
                  {selectedSession.attendees.map((attendee) => (
                    <AttendeeRow
                      key={attendee.id}
                      attendee={attendee}
                      onStatusChange={(attendeeId, status) =>
                        updateAttendeeStatus(selectedSession.id, attendeeId, status)
                      }
                    />
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <p className="empty-state">Select a session to view attendance.</p>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>Trainer Session Attendance Dashboard · FitTrack Pro</p>
      </footer>
    </div>
  );
}
