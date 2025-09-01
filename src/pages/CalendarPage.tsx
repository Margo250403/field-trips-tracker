import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import Navbar from "../components/Navbar";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import type { EventPropGetter } from "react-big-calendar";
import {
  addDays,
  addMonths,
  format,
  getDay,
  parse,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { type Trip, loadTrips } from "../store/types";
import { enUS } from "date-fns/locale";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/* ---------- i18n / localizer ---------- */
const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

/* ---------- helpers ---------- */
const MONTH_FULL = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function ymValue(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

/* ---------- types ---------- */
type TripEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date; // end is EXCLUSIVE for month view
  direction: string;
  participants: string[];
  purpose?: string;
  teams?: string[];
  comment?: string;
};

/* ---------- compact event: ONLY 2 LINES ---------- */
function EventCompact({ event }: { event: TripEvent }) {
  const people = event.participants?.length ?? 0;

  return (
    <CompactWrap title={`${event.direction} — ${people} ${people === 1 ? "person" : "people"}`}>
      <Row>
        <PinIcon />
        <span className="ellipsis">{event.direction}</span>
      </Row>
      <Row>
        <UsersIcon />
        <span>
          {people} {people === 1 ? "person" : "people"}
        </span>
      </Row>
    </CompactWrap>
  );
}

/* icons (inherit currentColor -> yellow) */
const PinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden>
    <path d="M12 22s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12z" fill="currentColor" />
  </svg>
);

const UsersIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden>
    <circle cx="12" cy="8" r="3.5" fill="currentColor" />
    <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

/* ====================================================================== */
export default function CalendarPage() {
  const [trips, setTrips] = useState<Trip[]>(() => loadTrips());
  const [selected, setSelected] = useState<TripEvent | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(() => startOfMonth(new Date()));
  const calRef = useRef<HTMLDivElement>(null);

  /* sync with external updates */
  useEffect(() => {
    const onExternal = () => setTrips(loadTrips());
    window.addEventListener("storage", onExternal);
    window.addEventListener("trips-updated", onExternal);
    return () => {
      window.removeEventListener("storage", onExternal);
      window.removeEventListener("trips-updated", onExternal);
    };
  }, []);

  /* trips -> calendar events (end +1 day so single-day events render in month view) */
  const events: TripEvent[] = useMemo(
    () =>
      trips.map((t) => {
        const d = new Date(t.date);
        return {
          id: t.id,
          title: t.direction,
          start: d,
          end: addDays(d, 1),
          direction: t.direction,
          participants: t.participants ?? [],
          purpose: t.purpose,
          teams: t.teams,
          comment: t.comment, // <— без any
        };
      }),
    [trips]
  );

  /* Re-measure after month / events change (fix "sticking") */
  useLayoutEffect(() => {
    const id = setTimeout(() => window.dispatchEvent(new Event("resize")), 0);
    return () => clearTimeout(id);
  }, [currentDate, events.length]);

  /* transparent container for compact events */
  const eventPropGetter: EventPropGetter<TripEvent> = () => ({
    style: {
      background: "transparent",
      border: 0,
      padding: 0,
      margin: "2px 0",
    },
  });

  /* export to PDF (screenshot calendar block) */
  const onExport = async () => {
    if (!calRef.current) return;

    const hidden = document.querySelectorAll<HTMLElement>("[data-hide-on-export]");
    hidden.forEach((el) => (el.style.display = "none"));

    const canvas = await html2canvas(calRef.current, { scale: 2, backgroundColor: "#0b0b0c" });
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "pt", "a4");
    const pw = pdf.internal.pageSize.getWidth();
    const ph = pdf.internal.pageSize.getHeight();
    const ratio = Math.min(pw / canvas.width, ph / canvas.height);
    const w = canvas.width * ratio;
    const h = canvas.height * ratio;

    pdf.addImage(img, "PNG", (pw - w) / 2, (ph - h) / 2, w, h);
    pdf.save("calendar.pdf");

    hidden.forEach((el) => (el.style.display = ""));
  };

  /* date navigation */
  const goPrev = () => setCurrentDate((d) => subMonths(d, 1));
  const goNext = () => setCurrentDate((d) => addMonths(d, 1));
  const goToday = () => setCurrentDate(startOfMonth(new Date()));

  /* month dropdown options */
  const baseYear = new Date().getFullYear();

  const monthOptions = useMemo(() => {
    const res: { value: string; label: string }[] = [];
    for (let y = baseYear - 2; y <= baseYear + 2; y++) {
      for (let m = 0; m < 12; m++) {
        res.push({
          value: `${y}-${String(m + 1).padStart(2, "0")}`,
          label: `${MONTH_FULL[m]} ${y}`,
        });
      }
    }
    return res;
  }, [baseYear]);

  const handleMonthSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [yy, mm] = e.target.value.split("-").map(Number);
    if (yy && mm) setCurrentDate(new Date(yy, mm - 1, 1));
  };

  return (
    <Page>
      <PrintReset />
      <Navbar />

      <Header>
        <HeaderSideLeft>
          <MonthSelectWrap>
            <MonthSelect
              value={ymValue(currentDate)}
              onChange={handleMonthSelect}
              aria-label="Select month"
            >
              {monthOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </MonthSelect>
            <Caret aria-hidden>▾</Caret>
          </MonthSelectWrap>

          <Btn onClick={goPrev}>Back</Btn>
          <Btn onClick={goToday}>Today</Btn>
          <Btn onClick={goNext}>Next</Btn>
        </HeaderSideLeft>

        <HeaderSideRight>
          <ExportBtn onClick={onExport}>Export PDF</ExportBtn>
        </HeaderSideRight>
      </Header>

      <CalendarWrapper ref={calRef} id="calendar-export-root">
        <Calendar
          key={ymValue(currentDate)} // force remount -> re-measure
          localizer={localizer}
          date={currentDate}
          onNavigate={setCurrentDate}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "calc(100vh - 220px)" }}
          views={[Views.MONTH]}
          toolbar={false}
          popup
          selectable
          components={{ event: EventCompact }}
          eventPropGetter={eventPropGetter}
          onSelectEvent={(event) => setSelected(event as TripEvent)}
        />
      </CalendarWrapper>

      {/* Side panel with full info */}
      {selected && (
        <Modal onClick={() => setSelected(null)} data-hide-on-export>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{format(selected.start, "EEEE, MMMM d")}</ModalTitle>
              <CloseBtn onClick={() => setSelected(null)} aria-label="Close">
                ×
              </CloseBtn>
            </ModalHeader>

            <BigPlace>{selected.direction}</BigPlace>

            <RowDetail>
              <strong>Participants:</strong>{" "}
              {selected.participants?.length ? selected.participants.join(", ") : "—"}
            </RowDetail>

            {selected.purpose && (
              <RowDetail>
                <strong>Purpose:</strong> {selected.purpose}
              </RowDetail>
            )}

            {selected.teams && selected.teams.length > 0 && (
              <TagBlock>
                {selected.teams.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </TagBlock>
            )}

            {/* Comments */}
            {selected.comment && (
              <CommentBlock>
                <strong>Comment:</strong>
                <p>{selected.comment}</p>
              </CommentBlock>
            )}
          </ModalCard>
        </Modal>
      )}
    </Page>
  );
}

/* ---------- print reset ---------- */
const PrintReset = createGlobalStyle`
  @media print {
    body {
      background: #0b0b0c;
    }
  }
`;

/* ---------- layout + controls ---------- */
const Page = styled.div`
  background: #0b0b0c;
  color: #fff;
  font-family: "Inter", sans-serif;
`;

const Header = styled.header`
  max-width: 1391px;
  margin: 20px auto 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const HeaderSideLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const HeaderSideRight = styled.div`
  display: flex;
  align-items: center;
`;

const Btn = styled.button`
  height: 40px;
  padding: 0 14px;
  border-radius: 10px;
  background: #1a1a1a;
  color: #ffd500;
  border: 1px solid #ffd500;
  font-weight: 700;
  cursor: pointer;
`;

const MonthSelectWrap = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

const MonthSelect = styled.select`
  appearance: none;
  height: 44px;
  padding: 0 42px 0 16px;
  border-radius: 12px;
  background: #101010;
  border: 1px solid #2a2a2a;
  color: #fff;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;

  &:focus {
    outline: 0;
    border-color: #ffd500;
  }
`;

const Caret = styled.span`
  position: absolute;
  right: 12px;
  pointer-events: none;
  font-size: 16px;
  color: #cfcfcf;
`;

const ExportBtn = styled.button`
  height: 46px;
  padding: 0 24px;
  border-radius: 12px;
  background: #ffd500;
  color: #000;
  border: 0;
  font-weight: 700;
  font-size: 20px;
  cursor: pointer;
`;

/* ---------- calendar skin ---------- */
const CalendarWrapper = styled.div`
  max-width: 1391px;
  margin: 0 auto 24px;

  /* Always 6 equal rows */
  .rbc-month-view {
    min-height: 720px;
    display: flex;
    flex-direction: column;
  }
  .rbc-month-row {
    flex: 1;
    min-height: 0 !important;
  }

  /* Dark theme + yellow grid */
  .rbc-calendar,
  .rbc-month-view,
  .rbc-month-row,
  .rbc-day-bg,
  .rbc-header {
    background: #0b0b0c;
    color: #ffd500;
  }

  .rbc-month-view {
    border: 2px solid #ffd500;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: inset 0 0 0 2px #ffd500;
  }

  .rbc-row-bg,
  .rbc-day-bg,
  .rbc-month-row {
    border-top: 1px solid #5a4a00;
  }
  .rbc-day-bg + .rbc-day-bg {
    border-left: 1px solid #5a4a00;
  }

  .rbc-month-row:last-child {
    border-bottom: 2px solid #ffd500;
  }

  .rbc-header {
    border-bottom: 2px solid #ffd500;
    padding: 10px 8px;
    font-weight: 800;
    text-transform: uppercase;
    background: #0b0b0c;
  }
  .rbc-header + .rbc-header {
    border-left: 1px solid #5a4a00;
  }

  .rbc-date-cell {
    padding: 6px 8px;
    font-weight: 700;
    color: #ffd500;
  }

  .rbc-off-range-bg {
    background: #141414 !important;
  }
  .rbc-off-range {
    color: #8f8f8f !important;
  }
  .rbc-today {
    background: rgba(255, 213, 0, 0.08) !important;
  }

  /* Inner padding so badges don't touch edges */
  .rbc-month-view .rbc-row-content {
    padding: 4px 6px;
  }

  /* Hide default event label (time/range) */
  .rbc-month-view .rbc-event-label {
    display: none !important;
  }

  /* Make events compact badges (not full width) */
  .rbc-event {
    width: auto !important;
    display: inline-block !important;
    padding: 0 !important;
    margin: 2px 0;
    box-shadow: none;
  }
  .rbc-event-content {
    white-space: normal !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  .rbc-show-more {
    color: #ffd500;
    font-weight: 800;
  }

  .rbc-toolbar {
    display: none;
  }
`;

/* ---------- compact event badge ---------- */
const CompactWrap = styled.div`
  color: #ffd500;
  font-weight: 700;
  line-height: 1.25;
  font-size: 13px;
  display: block;
  max-width: 100%;

  border: 1px solid rgba(255, 213, 0, 0.6);
  border-radius: 8px;
  padding: 4px 6px;
  background: rgba(255, 213, 0, 0.05);
  transition: background 0.2s, transform 0.2s;

  &:hover {
    background: rgba(255, 213, 0, 0.12);
    transform: translateY(-1px);
  }

  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 1px 0;
`;

/* ---------- modal ---------- */
const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: flex-end;
  z-index: 1000;
`;

const ModalCard = styled.div`
  width: min(460px, 92vw);
  height: 100%;
  background: #0b0b0c;
  border-left: 2px solid #ffd500;
  padding: 22px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.h3`
  font-size: 22px;
  font-weight: 800;
  color: #ffd500;
  margin: 0;
`;

const CloseBtn = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid #ffd500;
  background: #1a1a1a;
  color: #ffd500;
  font-size: 24px;
  cursor: pointer;
`;

const BigPlace = styled.div`
  font-size: 28px;
  font-weight: 800;
  margin-top: 4px;
`;

const RowDetail = styled.div`
  font-size: 16px;
  line-height: 1.5;
`;

const TagBlock = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Tag = styled.span`
  border: 2px solid #ffd500;
  border-radius: 8px;
  padding: 6px 10px;
  font-weight: 800;
  color: #ffd500;
`;

/* ---------- comments block ---------- */
const CommentBlock = styled.div`
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  background: rgba(255, 213, 0, 0.08);
  border: 1px solid rgba(255, 213, 0, 0.3);
  color: #ffd500;
  font-size: 15px;

  p {
    margin: 4px 0 0;
    white-space: pre-wrap;
  }
`;
