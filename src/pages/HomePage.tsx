import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ButtonsRow from "../components/ButtonsRow";

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#000", // чорний фон
        fontFamily: "Inter, sans-serif",
        color: "#fff",
      }}
    >
        <Navbar />
        <Hero />
        <ButtonsRow />
    </div>
  );
}
