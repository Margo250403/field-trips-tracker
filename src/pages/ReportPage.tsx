import { useMemo } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import { loadTrips, type Trip, type TeamTag } from "../store/types";

// ----- helpers -----
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function uniq<T>(arr: T[]) { return Array.from(new Set(arr)); }

function parseISO(d: string) {
  const [y,m,day] = d.split("-").map(Number);
  return new Date(y, (m || 1) - 1, day || 1);
}

// ----- page -----
export default function ReportPage() {
  const trips = useMemo<Trip[]>(() => loadTrips(), []);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const tripsYTD = useMemo(() => {
    return trips.filter(t => parseISO(t.date).getFullYear() === currentYear);
  }, [trips, currentYear]);

  const tripsThisMonth = useMemo(() => {
    return tripsYTD.filter(t => parseISO(t.date).getMonth() === currentMonth);
  }, [tripsYTD, currentMonth]);

  // --- 3 cards (all this month) ---
  const totalTripsThisMonth = tripsThisMonth.length;

  const uniqueParticipantsThisMonth = useMemo(() => {
    const all = tripsThisMonth.flatMap(t =>
      t.participants.map(p => (p || "").trim()).filter(Boolean)
    );
    return uniq(all).length;
  }, [tripsThisMonth]);

  const uniqueDirectionsThisMonth = useMemo(() => {
    const dirs = tripsThisMonth.map(t => (t.direction || "").trim()).filter(Boolean);
    return uniq(dirs).length;
  }, [tripsThisMonth]);

  // Trips per month (YTD)
  const perMonth = useMemo(() => {
    const arr = Array(12).fill(0);
    for (const t of tripsYTD) {
      const d = parseISO(t.date);
      arr[d.getMonth()]++;
    }
    return arr;
  }, [tripsYTD]);

  // Trips per team (this month)
  const perTeamThisMonth = useMemo(() => {
    const counts = new Map<TeamTag, number>();
    for (const t of tripsThisMonth) {
      for (const team of t.teams || []) {
        counts.set(team, (counts.get(team) || 0) + 1);
      }
    }
    const order: TeamTag[] = ["HEHS","WPE","CP","EWBN","PRoL"];
    return order
      .filter(k => counts.get(k))
      .map(k => ({ team: k, value: counts.get(k)! }));
  }, [tripsThisMonth]);

  // Recent trips (this month)
  const recentThisMonth = useMemo(() => {
    return [...tripsThisMonth]
      .sort((a,b) => parseISO(b.date).getTime() - parseISO(a.date).getTime())
      .slice(0, 3);
  }, [tripsThisMonth]);

  const onExport = () => {
    window.print();
  };

  return (
    <Page>
      <Navbar />

      <Container>
        <Title>Monthly Field Trips Tracker — Report</Title>

        <Cards3>
          <StatCard>
            <Label>Total Trips</Label>
            <Value>{totalTripsThisMonth}</Value>
          </StatCard>

          <StatCard>
            <Label>Unique Participants</Label>
            <Value>{uniqueParticipantsThisMonth}</Value>
          </StatCard>

          <StatCard>
            <Label>Unique Directions</Label>
            <Value>{uniqueDirectionsThisMonth}</Value>
          </StatCard>
        </Cards3>

        <Grid2>
          <Panel>
            <PanelTitle>Trips per Months</PanelTitle>
            <LineChart months={MONTHS} values={perMonth} />
          </Panel>

          <Panel>
            <PanelTitle>Trips per Teams</PanelTitle>
            <Bars>
              {perTeamThisMonth.map(({team, value}) => (
                <BarRow key={team}>
                  <BarLabel>{team}</BarLabel>
                  <BarTrack>
                    <BarFill style={{ width: `${scaleToPercent(value, perTeamThisMonth)}` }} />
                  </BarTrack>
                  <BarValue>{value}</BarValue>
                </BarRow>
              ))}
              {perTeamThisMonth.length === 0 && <EmptyHint>No data yet</EmptyHint>}
            </Bars>
          </Panel>
        </Grid2>

        <Panel style={{ marginTop: 24 }}>
          <PanelTitle>Recent Trips</PanelTitle>
          <Table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Direction</th>
                <th>Participants</th>
                <th>Teams</th>
                <th>Purpose</th>
              </tr>
            </thead>
            <tbody>
              {recentThisMonth.map(t => (
                <tr key={t.id}>
                  <td>{formatDate(t.date)}</td>
                  <td>{t.direction}</td>
                  <td>{t.participants.join(", ")}</td>
                  <td>{t.teams.join(", ")}</td>
                  <td>{t.purpose}</td>
                </tr>
              ))}
              {recentThisMonth.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: 16, opacity: .7 }}>
                    No trips this month
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Panel>

        <FooterBar>
          <ExportBtn onClick={onExport}>Export to PDF</ExportBtn>
        </FooterBar>
      </Container>
    </Page>
  );
}

// ---------- tiny charts ----------
function scaleToPercent(value: number, arr: {value: number}[]) {
  const max = Math.max(1, ...arr.map(a => a.value));
  return `${(value / max) * 100}%`;
}

function formatDate(iso: string) {
  const d = parseISO(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth()+1).padStart(2, "0");
  const yy = d.getFullYear();
  return `${dd}.${mm}.${yy}`;
}

function LineChart({ months, values }: { months: string[]; values: number[] }) {
  const max = Math.max(1, ...values);
  const W = 560, H = 220, P = 24;
  const stepX = (W - P * 2) / (values.length - 1 || 1);
  const toX = (i: number) => P + i * stepX;
  const toY = (v: number) => H - P - (v / max) * (H - P * 2);

  const d = values
    .map((v, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toY(v)}`)
    .join(" ");

  return (
    <SvgBox>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
        <line x1={P} y1={H-P} x2={W-P} y2={H-P} stroke="#333" />
        <path d={d} fill="none" stroke="#FFD500" strokeWidth="3" />
        {values.map((v,i)=>(
          <circle key={i} cx={toX(i)} cy={toY(v)} r="3.5" fill="#FFD500" />
        ))}
      </svg>
      <Months>
        {months.map((m,i)=> <span key={m+i}>{m}</span>)}
      </Months>
    </SvgBox>
  );
}

const Page = styled.div`
  background: #0b0b0c;
  min-height: 100vh;
  color: #fff;
  font-family: "Inter", sans-serif;
`;

const Container = styled.div`
  max-width: 1391px;
  margin: 0 auto;
  padding: 18px 12px 48px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin: 8px 0 20px;
  border-top: 2px solid #ffd500;
  padding-top: 16px;
`;

const Cards3 = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
`;

const StatCard = styled.div`
  background: #101010;
  border: 2px solid #282828;
  border-radius: 24px;
  padding: 22px 26px;
`;

const Label = styled.div`
  color: #cfcfcf;
  font-size: 16px;
  margin-bottom: 8px;
`;

const Value = styled.div`
  font-weight: 800;
  font-size: 32px;
  letter-spacing: .5px;
`;

const Grid2 = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 18px;
  margin-top: 24px;
  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.div`
  background: #101010;
  border-radius: 24px;
  border: 2px solid #282828;
  padding: 18px 20px 12px;
`;

const PanelTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  margin: 6px 0 14px;
`;

const SvgBox = styled.div`
  width: 100%;
`;

const Months = styled.div`
  margin-top: 6px;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  font-size: 12px;
  color: #cfcfcf;
  opacity: .9;
  span { text-align: center; }
`;

const Bars = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const BarRow = styled.div`
  display: grid;
  grid-template-columns: 64px 1fr 42px;
  align-items: center;
  gap: 10px;
`;

const BarLabel = styled.div`
  font-weight: 700;
`;

const BarTrack = styled.div`
  height: 14px;
  background: #1b1b1b;
  border: 1px solid #3a3a3a;
  border-radius: 8px;
  overflow: hidden;
`;

const BarFill = styled.div`
  height: 100%;
  background: #2f78ff;
`;

const BarValue = styled.div`
  text-align: right;
  color: #cfcfcf;
`;

const EmptyHint = styled.div`
  color: #cfcfcf;
  opacity: .7;
  padding: 6px 0 2px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
  th, td {
    border-bottom: 1px solid #2a2a2a;
    padding: 10px 8px;
    text-align: left;
    font-size: 15px;
  }
  th {
    color: #cfcfcf;
    font-weight: 700;
  }
`;

const FooterBar = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 14px;
`;

const ExportBtn = styled.button`
  height: 48px;
  margin-top: 12px;
  margin-bottom: 12px;
  padding: 0 22px;
  border-radius: 12px;
  background: #ffd500;
  color: #000;
  border: 0;
  font-weight: 700;
  font-size: 18px;
  cursor: pointer;
  transition: transform .06s ease-in-out;
  &:active { transform: translateY(1px); }
`;
