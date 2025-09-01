import styled from "styled-components";

/* ---------- STYLES ---------- */
const Bar = styled.div`
  width: 1391px;
  margin: 38px auto 0;
  display: grid;
  grid-template-columns: 214px 212px 220px 180px 200px 240px;
  gap: 24px;
  align-items: center;
`;

const Field = styled.div`
  position: relative;
  height: 52px;
  border-radius: 12px;
  background: #171717;
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 16px;
  font-family: "Inter", sans-serif;
  font-size: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);

  input,
  select {
    flex: 1;
    background: transparent;
    border: 0;
    outline: none;
    color: #fff;
    font: inherit;
  }
`;

const ResetBtn = styled.button`
  height: 52px;
  border-radius: 12px;
  background: #2a2a2a;
  color: #fff;
  border: 0;
  font-family: "Inter", sans-serif;
  font-weight: 700;
  font-size: 18px;
  cursor: pointer;

  &:hover {
    background: #ffd500;
    color: #000;
  }
`;

const AddBtn = styled.button`
  justify-self: end;
  height: 52px;
  padding: 0 22px;
  border-radius: 12px;
  background: #ffd500;
  color: #000;
  border: 0;
  font-family: "Inter", sans-serif;
  font-weight: 700;
  font-size: 20px;
  cursor: pointer;
`;

/* ---------- TYPES ---------- */
export interface FilterState {
  date: string; // YYYY-MM (для простоти)
  direction: string;
  participant: string;
  teams: string;
}

/* ---------- COMPONENT ---------- */
export default function TripsFilters({
  value,
  onChange,
  onReset,
  onAddTrip,
}: {
  value: FilterState;
  onChange: (patch: Partial<FilterState>) => void;
  onReset: () => void;
  onAddTrip: () => void;
}) {
  return (
    <Bar>
      <Field>
        <input
          type="month"
          value={value.date}
          onChange={(e) => onChange({ date: e.target.value })}
          aria-label="Date"
          placeholder="Date"
        />
      </Field>

      <Field>
        <input
          value={value.direction}
          onChange={(e) => onChange({ direction: e.target.value })}
          placeholder="Direction"
          aria-label="Direction"
        />
      </Field>

      <Field>
        <input
          value={value.participant}
          onChange={(e) => onChange({ participant: e.target.value })}
          placeholder="Participant"
          aria-label="Participant"
        />
      </Field>

      <Field>
        <input
          value={value.teams}
          onChange={(e) => onChange({ teams: e.target.value })}
          placeholder="Teams"
          aria-label="Teams"
        />
      </Field>

      <ResetBtn type="button" onClick={onReset}>
        Reset Filters
      </ResetBtn>

      <AddBtn type="button" onClick={onAddTrip}>
        + Add Trip
      </AddBtn>
    </Bar>
  );
}
