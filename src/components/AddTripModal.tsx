/* eslint-disable react-refresh/only-export-components */
import { useEffect, useMemo, useState } from "react";
import styled, { css } from "styled-components";

/* ======= layout ======= */
export const Backdrop = styled.div`
  position: fixed; inset: 0;
  background: rgba(0,0,0,.6);
  display: grid; place-items: center;
  z-index: 1000;

  @media (max-width: 480px) { padding: 10px; }
`;

export const Dialog = styled.div`
  width: 820px;
  max-width: calc(100% - 32px);
  background: #0b0b0c;
  color: #fff;
  border: 1px solid rgba(255,213,0,.4);
  border-radius: 14px;
  box-shadow: 0 20px 60px rgba(0,0,0,.6);
  font-family: "Inter", sans-serif;

  @media (max-width: 1024px) { width: 720px; }
  @media (max-width: 900px)  { width: 640px; }
  @media (max-width: 768px)  { width: 100%; max-width: none; }
  @media (max-width: 480px)  { border-radius: 12px; }
`;

export const Header = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  padding: 18px 22px;
  border-bottom: 1px solid rgba(255,213,0,.3);

  @media (max-width: 768px) { padding: 14px 16px; }
  @media (max-width: 480px) { padding: 12px 14px; }
`;

export const Title = styled.h3`
  margin: 0;
  font-weight: 800;
  font-size: 22px;
  letter-spacing: .2px;

  @media (max-width: 900px) { font-size: 20px; }
  @media (max-width: 480px){ font-size: 18px; }
`;

export const CloseBtn = styled.button`
  background: transparent;
  border: 1px solid rgba(255,213,0,.35);
  color: #ffd500;
  width: 36px; height: 36px;
  border-radius: 10px;
  font-size: 22px; line-height: 1;
  cursor: pointer;
  transition: all .2s ease;
  &:hover{ background:#ffd500; color:#0b0b0c; }

  @media (max-width: 768px) { width: 34px; height: 34px; font-size: 20px; }
  @media (max-width: 480px) { width: 32px; height: 32px; font-size: 18px; }
`;

export const Form = styled.form`
  padding: 18px 22px 22px;

  @media (max-width: 768px) { padding: 16px; }
  @media (max-width: 480px) { padding: 12px; }
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 14px;

  @media (max-width: 900px) { gap: 14px; }
  @media (max-width: 720px){ grid-template-columns: 1fr; gap: 12px; }
`;

export const Field = styled.div<{ full?: boolean }>`
  display: flex; flex-direction: column;
  ${(p) => p.full && `grid-column: 1 / -1;`}
`;

export const Label = styled.label`
  margin-bottom: 8px;
  font-size: 13px;
  color: #cfcfcf;

  @media (max-width: 480px) { font-size: 12px; margin-bottom: 6px; }
`;

/* ======= controls ======= */
export const controlBase = css<{ $invalid?: boolean }>`
  height: 48px;
  border-radius: 10px;
  border: 1px solid rgba(255,213,0,.35);
  background: #141414;
  color: #fff;
  padding: 0 14px;
  font-size: 16px;
  outline: none;
  transition: border-color .15s ease;
  &::placeholder{ color:#9b9b9b; }
  &:focus{ border-color:#ffd500; }
  ${(p)=>p.$invalid && `
    border-color:#ff5c5c;
    box-shadow: 0 0 0 2px rgba(255,92,92,.15) inset;
  `}

  @media (max-width: 768px) { height: 44px; font-size: 15px; padding: 0 12px; }
  @media (max-width: 480px) { height: 42px; font-size: 14px; padding: 0 10px; }
`;

export const Input = styled.input<{ $invalid?: boolean }>`
  ${controlBase}
`;

export const Textarea = styled.textarea<{ $invalid?: boolean }>`
  ${controlBase}
  height: auto;
  padding: 12px 14px;

  @media (max-width: 768px) { padding: 10px 12px; }
  @media (max-width: 480px) { padding: 8px 10px; }
`;

export const Hint = styled.span`
  margin-top: 6px;
  font-size: 12px;
  color: #9b9b9b;

  @media (max-width: 480px) { font-size: 11px; margin-top: 4px; }
`;

export const ErrorText = styled.span`
  margin-top: 6px;
  font-size: 12px;
  color: #ff5c5c;

  @media (max-width: 480px) { font-size: 11px; margin-top: 4px; }
`;


export const Pills = styled.div<{ $invalid?: boolean }>`
  display: flex; flex-wrap: wrap; gap: 8px;
  ${(p)=>p.$invalid && `
    outline: 2px solid rgba(255,92,92,.6);
    outline-offset: 4px;
    border-radius: 12px;
    padding: 4px;
  `}
  @media (max-width: 480px) { gap: 6px; }
`;

export const Pill = styled.button<{ $active?: boolean }>`
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 12px;
  border-radius: 10px;
  border: 2px solid #ffd500;
  background: ${(p)=>p.$active ? "#ffd500" : "#0b0b0c"};
  color: ${(p)=>p.$active ? "#0b0b0c" : "#fff"};
  font-weight: 700; font-size: 14px;
  cursor: pointer;
  transition: all .15s ease;
  &:hover{ background:#ffd500; color:#0b0b0c; }

  @media (max-width: 768px) { padding: 7px 10px; font-size: 13px; }
  @media (max-width: 480px) { padding: 6px 8px;  font-size: 12px; }
`;

export const Tick = styled.span`
  display: inline-block; width: 14px; height: 14px; border-radius: 3px;
  border: 2px solid currentColor; position: relative;
  &::after{
    content:""; position:absolute; left:3px; top:0px;
    width:5px; height:9px;
    border: 2px solid currentColor; border-top:0; border-left:0;
    transform: rotate(45deg);
  }
  @media (max-width: 480px) {
    width: 12px; height: 12px;
    &::after{ left:2px; height:7px; width:4px; }
  }
`;

export const Actions = styled.div`
  display: flex; justify-content: flex-end; gap: 10px;
  margin-top: 8px;

  @media (max-width: 720px) {
    flex-direction: column-reverse;
    gap: 8px;
  }
`;

export const Save = styled.button<{ disabled?: boolean }>`
  min-width: 120px; height: 48px;
  border-radius: 12px;
  background: #ffd500; color:#0b0b0c;
  border: 1px solid #ffd500;
  font-weight: 800; font-size: 16px;
  cursor: pointer;
  transition: opacity .12s ease, transform .07s ease;
  &:active{ transform: translateY(1px); }
  ${(p)=>p.disabled && `opacity:.6; cursor:not-allowed;`}

  @media (max-width: 768px) { height: 46px; font-size: 15px; }
  @media (max-width: 720px) { width: 100%; }
`;

export const Cancel = styled.button`
  min-width: 120px; height: 48px;
  border-radius: 12px;
  background: #0b0b0c; color:#fff;
  border: 1px solid rgba(255,213,0,.35);
  font-weight: 700; font-size: 16px;
  cursor: pointer;
  &:hover{ border-color:#ffd500; }

  @media (max-width: 768px) { height: 46px; font-size: 15px; }
  @media (max-width: 720px) { width: 100%; }
`;


type TeamKey = "HEHS" | "WPE" | "CP" | "PRoL" | "EWBN";
const ALL_TEAMS: TeamKey[] = ["HEHS", "WPE", "CP", "PRoL", "EWBN"];

export interface NewTripPayload {
  date: string;          // ISO yyyy-mm-dd
  direction: string;     // текст
  participants: string;  // кома-роздільно
  teams: TeamKey[];      // вибрані команди
  purpose: string;
  comment: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: NewTripPayload) => void;
  initial?: NewTripPayload;   // для режиму "Edit"
  title?: string;             // заголовок вікна
  submitText?: string;        // текст на кнопці збереження
}


const isRealDate = (iso: string) => {
  if (!iso) return false;
  // Перевірка формату та валідності
  const m = /^\d{4}-\d{2}-\d{2}$/.test(iso);
  const d = new Date(iso);
  return m && !isNaN(d.getTime());
};

const parseNames = (raw: string): string[] => {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length >= 2);
};


export default function AddTripModal({
  open,
  onClose,
  onSave,
  initial,
  title,
  submitText,
}: Props) {
  const [date, setDate] = useState("");
  const [direction, setDirection] = useState("");
  const [participants, setParticipants] = useState("");
  const [teams, setTeams] = useState<TeamKey[]>([]);
  const [purpose, setPurpose] = useState("");
  const [comment, setComment] = useState("");

  // touched — показувати помилки після взаємодії з полем
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // автозаповнення при відкритті (режим Edit)
  useEffect(() => {
    if (!open) return;
    if (initial) {
      setDate(initial.date || "");
      setDirection(initial.direction || "");
      setParticipants(initial.participants || "");
      setTeams(initial.teams || []);
      setPurpose(initial.purpose || "");
      setComment(initial.comment || "");
      setTouched({});
    } else {
      setDate(""); setDirection(""); setParticipants("");
      setTeams([]); setPurpose(""); setComment("");
      setTouched({});
    }
  }, [open, initial]);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};

    if (!isRealDate(date)) e.date = "Оберіть коректну календарну дату.";

    if (!direction.trim() || direction.trim().length < 2) {
      e.direction = "Вкажіть напрямок (мінімум 2 символи).";
    }

    const names = parseNames(participants);
    if (names.length === 0) {
      e.participants = "Додайте щонайменше одне ім’я (імена через кому).";
    }

    if (teams.length === 0) {
      e.teams = "Оберіть принаймні одну команду.";
    }

    return e;
  }, [date, direction, participants, teams]);

  const formInvalid = Object.keys(errors).length > 0;

  if (!open) return null;

  function toggleTeam(t: TeamKey) {
    setTeams((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();

    // позначаємо всі як touched, щоб показати підказки
    setTouched({
      date: true,
      direction: true,
      participants: true,
      teams: true,
      purpose: true,
      comment: true,
    });

    if (formInvalid) return;

    // нормалізація значень перед збереженням
    const cleanDirection = direction.trim();
    const cleanParticipants = parseNames(participants).join(", ");
    const cleanPurpose = purpose.trim();
    const cleanComment = comment.trim();

    onSave({
      date,
      direction: cleanDirection,
      participants: cleanParticipants,
      teams,
      purpose: cleanPurpose,
      comment: cleanComment,
    });

    // скидаємо форму та закриваємо
    setDate(""); setDirection(""); setParticipants("");
    setTeams([]); setPurpose(""); setComment("");
    setTouched({});
    onClose();
  }

  return (
    <Backdrop onClick={onClose} role="presentation">
      <Dialog
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-trip-title"
      >
        <Header>
          <Title id="add-trip-title">{title ?? "Add New Trip"}</Title>
          <CloseBtn onClick={onClose} aria-label="Close">×</CloseBtn>
        </Header>

        <Form onSubmit={handleSave} noValidate>
          <Row>
            <Field>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, date: true }))}
                aria-invalid={!!errors.date}
                aria-describedby={errors.date ? "err-date" : undefined}
                $invalid={touched.date && !!errors.date}
              />
              {touched.date && errors.date && (
                <ErrorText id="err-date">{errors.date}</ErrorText>
              )}
            </Field>

            <Field>
              <Label htmlFor="direction">Direction</Label>
              <Input
                id="direction"
                type="text"
                placeholder="e.g., Kyiv"
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, direction: true }))}
                aria-invalid={!!errors.direction}
                aria-describedby={errors.direction ? "err-direction" : undefined}
                $invalid={touched.direction && !!errors.direction}
              />
              {touched.direction && errors.direction && (
                <ErrorText id="err-direction">{errors.direction}</ErrorText>
              )}
            </Field>
          </Row>

          <Row>
            <Field>
              <Label htmlFor="participants">Participants</Label>
              <Input
                id="participants"
                type="text"
                placeholder="John Doe, Anna Smith"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, participants: true }))}
                aria-invalid={!!errors.participants}
                aria-describedby={
                  errors.participants ? "err-participants" : "hint-participants"
                }
                $invalid={touched.participants && !!errors.participants}
              />
              {!errors.participants && (
                <Hint id="hint-participants">Вводьте імена через кому.</Hint>
              )}
              {touched.participants && errors.participants && (
                <ErrorText id="err-participants">
                  {errors.participants}
                </ErrorText>
              )}
            </Field>

            <Field>
              <Label>Teams</Label>
              <Pills
                role="group"
                aria-invalid={!!errors.teams}
                aria-describedby={errors.teams ? "err-teams" : undefined}
                $invalid={touched.teams && !!errors.teams}
              >
                {ALL_TEAMS.map((t) => (
                  <Pill
                    key={t}
                    type="button"
                    $active={teams.includes(t)}
                    onClick={() => toggleTeam(t)}
                    aria-pressed={teams.includes(t)}
                    onBlur={() => setTouched((s) => ({ ...s, teams: true }))}
                  >
                    <Tick aria-hidden="true" /> {t}
                  </Pill>
                ))}
              </Pills>
              {touched.teams && errors.teams && (
                <ErrorText id="err-teams">{errors.teams}</ErrorText>
              )}
            </Field>
          </Row>

          <Row>
            <Field>
              <Label htmlFor="purpose">Purpose</Label>
              <Input
                id="purpose"
                type="text"
                placeholder="Needs Assessment / Distribution / Training..."
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </Field>
          </Row>

          <Row>
            <Field full>
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                rows={4}
                placeholder="Optional notes..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Field>
          </Row>

          <Actions>
            <Cancel type="button" onClick={onClose}>Cancel</Cancel>
            <Save type="submit" disabled={formInvalid}>
              {submitText ?? "Save Trip"}
            </Save>
          </Actions>
        </Form>
      </Dialog>
    </Backdrop>
  );
}

