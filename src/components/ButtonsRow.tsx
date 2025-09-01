import styled from "styled-components";
import { Link } from "react-router-dom";
import addIcon from "../assets/add.png";
import calendarIcon from "../assets/calendar.png";
import mapIcon from "../assets/map.png";

const Wrap = styled.section`
  width: 1391px;
  margin: 48px auto 0;

  @media (max-width: 1440px) {
    width: 100%;
    padding: 0 20px;
  }

  @media (max-width: 768px) {
    margin-top: 32px;
    padding: 0 16px;
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: center;
  gap: 32px;
  flex-wrap: wrap;

  @media (max-width: 1024px) {
    gap: 24px;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
`;

const Button = styled(Link)`
  width: 312px;
  height: 134px;
  border-radius: 10px;
  background: rgba(78, 78, 78, 0.5);
  border: 0;
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 0 24px;
  cursor: pointer;
  text-decoration: none;

  @media (max-width: 1024px) {
    width: 260px;
    height: 120px;
    gap: 14px;
  }

  @media (max-width: 600px) {
    width: 100%;
    height: 80px;
    justify-content: center;
  }
`;

const Icon = styled.img`
  width: 56px;
  height: 56px;
  object-fit: contain;

  @media (max-width: 1024px) {
    width: 48px;
    height: 48px;
  }

  @media (max-width: 600px) {
    width: 40px;
    height: 40px;
  }
`;

const Label = styled.span`
  font-weight: 500;
  font-size: 28px;
  color: #ffc507;
  line-height: 1.1;

  @media (max-width: 1024px) {
    font-size: 22px;
  }

  @media (max-width: 600px) {
    font-size: 18px;
  }
`;

export default function ButtonsRow() {
  return (
    <Wrap>
      <Row>
        <Button to="/trips">
          <Icon src={addIcon} alt="trips" />
          <Label>Add Trip</Label>
        </Button>

        <Button to="/calendar">
          <Icon src={calendarIcon} alt="calendar" />
          <Label>Open calendar</Label>
        </Button>

        <Button to="/maps">
          <Icon src={mapIcon} alt="maps" />
          <Label>See map</Label>
        </Button>
      </Row>
    </Wrap>
  );
}
