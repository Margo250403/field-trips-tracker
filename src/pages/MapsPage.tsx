/// <reference types="google.maps" />

import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import { loadTrips, saveTrips } from "../store/types";
import type { Trip } from "../store/types";

/* ========= типобезпечний window ========= */
type GWindow = Window &
  typeof globalThis & {
    google?: typeof google;
  };

/* ========= Мінімальний локальний "геокодер" ========= */
const GEO: Record<string, { lat: number; lng: number }> = {
  kyiv: { lat: 50.4501, lng: 30.5234 },
  kiev: { lat: 50.4501, lng: 30.5234 },
  lviv: { lat: 49.8397, lng: 24.0297 },
  dnipro: { lat: 48.467, lng: 35.04 },
  kharkiv: { lat: 49.9935, lng: 36.2304 },
  vinnytsia: { lat: 49.2331, lng: 28.4682 },
  mykolaiv: { lat: 46.975, lng: 31.9946 },
  chernihiv: { lat: 51.4982, lng: 31.2893 },
  odesa: { lat: 46.4825, lng: 30.7233 },
  zaporizhzhia: { lat: 47.8388, lng: 35.1396 },
};

export default function MapsPage() {
  const [selected, setSelected] = useState<Trip | null>(null);

  // Джерело даних
  const trips = useMemo(() => loadTrips(), []);

  // Карта
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  /* ========= Завантажувач Google Maps (без loading=async) ========= */
  const loadScript = () =>
    new Promise<void>((resolve, reject) => {
      const gwin = window as GWindow;
      if (gwin.google?.maps?.Map) return resolve();

      let s = document.getElementById("gmaps-sdk") as HTMLScriptElement | null;

      const onDone = () => resolve();
      const onErr = () => reject(new Error("Failed to load Google Maps"));

      if (!s) {
        s = document.createElement("script");
        s.id = "gmaps-sdk";
        s.src = `https://maps.googleapis.com/maps/api/js?key=${
          import.meta.env.VITE_GOOGLE_MAPS_KEY
        }&v=weekly`; // без loading=async
        s.async = true;
        s.defer = true;
        s.addEventListener("load", onDone, { once: true });
        s.addEventListener("error", onErr, { once: true });
        document.head.appendChild(s);
      } else {
        s.addEventListener("load", onDone, { once: true });
        s.addEventListener("error", onErr, { once: true });
      }
    });

  // Дочікуємося готовності конструктора Map
  const waitForMapCtor = () =>
    new Promise<void>((resolve) => {
      const tick = () => {
        if ((window as GWindow).google?.maps?.Map) resolve();
        else setTimeout(tick, 25);
      };
      tick();
    });

  // Ініціалізація карти
  useEffect(() => {
    (async () => {
      await loadScript();
      await waitForMapCtor();

      if (!mapDivRef.current) return;

      const map = new google.maps.Map(mapDivRef.current, {
        center: { lat: 49.0, lng: 31.0 },
        zoom: 6,
        mapTypeControl: false,
        fullscreenControl: true,
        streetViewControl: false,
        // Обмежуємо в межах України (приблизно)
        restriction: {
          latLngBounds: { north: 52.379, south: 44.386, west: 22.137, east: 40.227 },
          strictBounds: true,
        },
      });

      mapInstanceRef.current = map;
    })();
  }, []);

  // Рендер маркерів
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // прибрати старі маркери
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const bounds = new google.maps.LatLngBounds();
    let added = 0;

    trips.forEach((trip) => {
      const coord = GEO[trip.direction.trim().toLowerCase()];
      if (!coord) return;

      const marker = new google.maps.Marker({
        position: coord,
        map,
        title: `${trip.direction} — ${trip.purpose}`,
      });

      marker.addListener("click", () => setSelected(trip));
      markersRef.current.push(marker);
      bounds.extend(coord);
      added++;
    });

    if (added > 0) map.fitBounds(bounds, 40);
  }, [trips]);

  // Дії з картки
  const onEdit = (id: string) => {
    alert(`Edit trip ${id} (відкрити модал редагування)`);
  };

  const onDelete = (id: string) => {
    if (confirm("Видалити цю поїздку?")) {
      const next = loadTrips().filter((t) => t.id !== id);
      saveTrips(next);
      setSelected(null);
      window.dispatchEvent(new Event("trips-updated"));
      location.reload();
    }
  };

  return (
    <Page>
      <Navbar />
      <HeaderRow>
        <NavSpace />
      </HeaderRow>

      <MapWrap>
        <MapBox ref={mapDivRef} />
        {selected && (
          <OverlayCard>
            <SideDate>
              {new Date(selected.date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </SideDate>

            <SideTitle>{selected.direction}</SideTitle>

            <SideRow>{selected.participants.join(" \u00A0 ")}</SideRow>

            <SideLabel>Teams</SideLabel>
            <Chips>
              {selected.teams.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </Chips>

            <Buttons>
              <EditBtn onClick={() => onEdit(selected.id)}>Edit</EditBtn>
              <DeleteBtn onClick={() => onDelete(selected.id)}>Delete</DeleteBtn>
            </Buttons>
          </OverlayCard>
        )}
      </MapWrap>
    </Page>
  );
}

/* ================= styles ================= */

const Page = styled.div`
  background: #0b0b0c;
  min-height: 100vh;
  color: #fff;
  font-family: "Inter", system-ui, sans-serif;
`;

const HeaderRow = styled.div`
  max-width: 1391px;
  margin: 20px auto 8px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const NavSpace = styled.div``;

/* Контейнер під мапу: ширина як у навігації, карта на всю ширину */
const MapWrap = styled.div`
  position: relative;
  max-width: 1391px;
  margin: 0 auto 24px;
  padding: 0 24px;
`;

const MapBox = styled.div`
  height: calc(100vh - 200px);
  min-height: 520px;
  background: #0f0f10;
  border: 2px solid #ffd500;
  border-radius: 12px;
  overflow: hidden;
`;

/* Картка поверх карти (праворуч, як у дизайні) */
const OverlayCard = styled.div`
  position: absolute;
  right: 36px;
  top: 36px;
  width: min(420px, 92vw);
  background: #000;
  border: 2px solid #ffd500;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.5);

  @media (max-width: 720px) {
    right: 18px;
    left: 18px;
    width: auto;
  }
`;

const SideDate = styled.div`
  color: #ffd500;
  font-weight: 800;
  font-size: 20px;
  margin-bottom: 10px;
`;

const SideTitle = styled.div`
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 8px;
`;

const SideRow = styled.div`
  font-size: 18px;
  opacity: 0.95;
  margin-bottom: 18px;
`;

const SideLabel = styled.div`
  font-size: 16px;
  color: #d7d7d7;
  margin: 4px 0 6px;
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
`;

const Chip = styled.span`
  border: 2px solid #ffd500;
  color: #ffd500;
  background: #0b0b0c;
  border-radius: 8px;
  padding: 4px 10px;
  font-weight: 800;
`;

const Buttons = styled.div`
  display: flex;
  gap: 12px;
`;

const EditBtn = styled.button`
  flex: 1;
  height: 46px;
  border-radius: 10px;
  background: #ffd500;
  color: #000;
  font-weight: 800;
  border: none;
  cursor: pointer;
`;

const DeleteBtn = styled.button`
  flex: 1;
  height: 46px;
  border-radius: 10px;
  background: transparent;
  color: #ffd500;
  font-weight: 800;
  border: 2px solid #ffd500;
  cursor: pointer;
`;
