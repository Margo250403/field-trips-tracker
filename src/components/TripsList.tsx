import styled from "styled-components";
import Tag from "./Tag";
import { EditIcon, TrashIcon } from "./Icons";
import type { Trip } from "../store/types";

const TableWrap = styled.div`
  width: 1391px;
  margin: 34px auto 0;
`;

const Head = styled.div`
  display: grid;
  grid-template-columns: 140px 160px 220px 240px 240px 240px 120px;
  gap: 16px;
  align-items: end;
  height: 48px;
  padding: 0 0 12px 0;
  border-bottom: 2px solid #ffd500;
  color: #fff;
  font-family: "Inter", sans-serif;
  font-weight: 700;
  font-size: 18px;
`;

const Row = styled.div<{ odd?: boolean }>`
  display: grid;
  grid-template-columns: 140px 160px 220px 240px 240px 240px 120px;
  gap: 16px;
  align-items: center;
  min-height: 82px;
  padding: 18px 0;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  background: ${({ odd }) => (odd ? "#111111" : "#0b0b0c")};
  color: #fff;
  font-family: "Inter", sans-serif;
  font-size: 18px;
`;

const Participants = styled.div` display: grid; gap: 2px; `;
const TeamsCell = styled.div` display: flex; flex-wrap: wrap; gap: 8px; `;
const PurposeCell = styled.div``;
const CommentCell = styled.div``;

const Actions = styled.div`
  display: flex; align-items: center; gap: 14px;
  button{ background: transparent; border: 0; padding: 0; cursor: pointer; }
  button:hover svg path, button:hover svg { stroke: #ffd500; fill: #ffd500; }
`;

export default function TripsList({
  trips,
  onEdit,
  onDelete,
}: {
  trips: Trip[];
  onEdit: (trip: Trip) => void;    // <-- передаємо весь trip
  onDelete: (id: string) => void;
}) {
  return (
    <TableWrap>
      <Head>
        <div>Date</div>
        <div>Direction</div>
        <div>Participants</div>
        <div>Teams</div>
        <div>Purpose</div>
        <div>Comment</div>
      </Head>

      {trips.map((t, i) => (
        <Row key={t.id} odd={i % 2 === 1}>
          <div>{new Date(t.date).toLocaleDateString("uk-UA")}</div>
          <div>{t.direction}</div>
          <Participants>{t.participants.map((p) => <span key={p}>{p}</span>)}</Participants>
          <TeamsCell>{t.teams.map((tag) => <Tag key={tag}>{tag}</Tag>)}</TeamsCell>
          <PurposeCell>{t.purpose}</PurposeCell>
          <CommentCell>{t.comment}</CommentCell>
          <Actions>
            <button aria-label="Edit" onClick={() => onEdit(t)}>
              <EditIcon />
            </button>
            <button aria-label="Delete" onClick={() => onDelete(t.id)}>
              <TrashIcon />
            </button>
          </Actions>
        </Row>
      ))}
    </TableWrap>
  );
}
