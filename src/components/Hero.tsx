import styled from "styled-components";

const Wrap = styled.section`
  width: 1391px;
  margin: 0 auto;
  text-align: center;

  @media (max-width: 1440px) {
    width: 100%;
    padding: 0 40px;
  }

  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

const Title = styled.h1`
  margin-top: 134px;
  margin-bottom: 0px;
  font-weight: 700;
  font-size: 70px;
  color: #fff;

  @media (max-width: 1024px) {
    font-size: 54px;
    margin-top: 100px;
  }

  @media (max-width: 768px) {
    font-size: 42px;
    margin-top: 80px;
  }

  @media (max-width: 480px) {
    font-size: 32px;
    margin-top: 60px;
  }
`;

const Subtitle = styled.p`
  margin: 24px 0 0;
  font-weight: 500;
  font-size: 24px;
  color: #cfcfcf;

  @media (max-width: 1024px) {
    font-size: 20px;
  }

  @media (max-width: 768px) {
    font-size: 18px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

export default function Hero() {
  return (
    <Wrap>
      <Title>Field Trips Tracker</Title>
      <Subtitle>System for planning and visualizing field team trips</Subtitle>
    </Wrap>
  );
}
