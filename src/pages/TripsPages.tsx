import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import TripsFilters from "../components/TripsFilters";
import type { FilterState } from "../components/TripsFilters";
import TripsList from "../components/TripsList";
import type { Trip } from "../store/types";
import AddTripModal, { type NewTripPayload } from "../components/AddTripModal";
import { loadTrips, saveTrips } from "../store/types";

const Page = styled.div` 
  background: #0b0b0c; 
`;

const FooterBar = styled.div`
  width: 1391px;
  margin: 32px auto; 
  display: flex; 
  justify-content: flex-end;
`;

const ExportBtn = styled.button`
  height: 52px; 
  padding: 0 24px; 
  border-radius: 12px;
  background: #ffd500; 
  color: #000; 
  border: 0;
  font-family: "Inter", sans-serif; 
  font-weight: 700; 
  font-size: 20px; 
  cursor: pointer;
`;

export default function TripsPage() {
  // Джерело істини
  const [trips, setTrips] = useState<Trip[]>(() => loadTrips());

  // Синхронізація у localStorage
  useEffect(() => {
    saveTrips(trips);
    window.dispatchEvent(new Event("trips-updated"));
  }, [trips]);

  // Модалки
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

  // Фільтри
  const [filters, setFilters] = useState<FilterState>({
    date: "", direction: "", participant: "", teams: "",
  });

  const filtered = useMemo(() => {
    const wantedTeams = filters.teams
      ? filters.teams.split(",").map((t) => t.trim().toUpperCase()).filter(Boolean)
      : [];

    return trips.filter((t) => {
      const byMonth = filters.date ? t.date.startsWith(filters.date) : true;
      const byDirection = filters.direction
        ? t.direction.toLowerCase().includes(filters.direction.toLowerCase())
        : true;
      const byParticipant = filters.participant
        ? t.participants.some((p) => p.toLowerCase().includes(filters.participant.toLowerCase()))
        : true;
      const byTeams =
        wantedTeams.length === 0
          ? true
          : t.teams.map((x) => x.toUpperCase()).some((team) => wantedTeams.includes(team));

      return byMonth && byDirection && byParticipant && byTeams;
    });
  }, [trips, filters]);

  // Додати
  function handleSaveTrip(data: NewTripPayload) {
    const newTrip: Trip = {
      id: String(Date.now()),
      date: data.date,
      direction: data.direction,
      participants: data.participants
        ? data.participants.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      teams: data.teams,
      purpose: data.purpose,
      comment: data.comment,
    };
    setTrips((prev) => [newTrip, ...prev]);
    setAddOpen(false);
  }

  // Редагувати
  function handleEditOpen(trip: Trip) {
    setEditingTrip(trip);
    setEditOpen(true);
  }
  function handleUpdateTrip(data: NewTripPayload) {
    if (!editingTrip) return;
    setTrips((prev) =>
      prev.map((t) =>
        t.id === editingTrip.id
          ? {
              ...t,
              date: data.date,
              direction: data.direction,
              participants: data.participants
                ? data.participants.split(",").map((s) => s.trim()).filter(Boolean)
                : [],
              teams: data.teams,
              purpose: data.purpose,
              comment: data.comment,
            }
          : t
      )
    );
    setEditOpen(false);
    setEditingTrip(null);
  }

  // Видалити
  const onDelete = (id: string) => {
    if (confirm("Delete this trip?")) {
      setTrips((prev) => prev.filter((t) => t.id !== id));
    }
  };

  // Export PDF
  const exportToPdf = async () => {
    try {
      const [{ jsPDF }, autoTable] = await Promise.all([
        import("jspdf"),
        import("jspdf-autotable"),
      ]);

      const doc = new jsPDF();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Field Trips — Export", 14, 16);

      const rows = filtered.map((t) => [
        t.date,
        t.direction,
        t.participants.join(", "),
        t.teams.join(", "),
        t.purpose,
        t.comment ?? "",
      ]);

      (autoTable).default(doc, {
        head: [["Date", "Direction", "Participants", "Teams", "Purpose", "Comment"]],
        body: rows,
        startY: 22,
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [255, 213, 0], textColor: [0, 0, 0] },
      });

      doc.save("field_trips.pdf");
    } catch (e) {
      console.error(e);
      alert("Cпробуй ще раз.");
    }
  };

  return (
    <Page>
      <Navbar />

      <TripsFilters
        value={filters}
        onChange={(p) => setFilters({ ...filters, ...p })}
        onReset={() => setFilters({ date: "", direction: "", participant: "", teams: "" })}
        onAddTrip={() => setAddOpen(true)}
      />

      <TripsList
        trips={filtered}
        onEdit={handleEditOpen}   // <-- відкриваємо редагування
        onDelete={onDelete}
      />

      <FooterBar>
        <ExportBtn onClick={exportToPdf}>Export to PDF</ExportBtn>
      </FooterBar>

      {/* Add */}
      <AddTripModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={handleSaveTrip}
        title="Add New Trip"
        submitText="Save Trip"
      />

      {/* Edit */}
      <AddTripModal
        open={editOpen}
        onClose={() => { setEditOpen(false); setEditingTrip(null); }}
        onSave={handleUpdateTrip}
        initial={
          editingTrip
            ? {
                date: editingTrip.date,
                direction: editingTrip.direction,
                participants: editingTrip.participants.join(", "),
                teams: editingTrip.teams,
                purpose: editingTrip.purpose,
                comment: editingTrip.comment ?? "",
              }
            : undefined
        }
        title="Edit Trip"
        submitText="Update Trip"
      />
    </Page>
  );
}

