import styled from "styled-components";

const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 8px;
  border: 2px solid #ffd500;
  background: #0b0b0c;
  color: #fff;
  font-family: "Inter", sans-serif;
  font-weight: 700;
  font-size: 14px;
  line-height: 1;

  @media (max-width: 1024px) {
    font-size: 13px;
    padding: 3px 8px;
  }

  @media (max-width: 600px) {
    font-size: 12px;
    padding: 2px 6px;
  }
`;

const Tick = styled.span`
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 2px solid #ffd500;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    left: 3px;
    top: 1px;
    width: 6px;
    height: 7px;
    border: 2px solid #ffd500;
    border-top: 0;
    border-left: 0;
    transform: rotate(45deg);
  }

  @media (max-width: 600px) {
    width: 12px;
    height: 12px;

    &::after {
      left: 2px;
      top: 1px;
      width: 5px;
      height: 6px;
    }
  }
`;

export default function Tag({ children }: { children: React.ReactNode }) {
  return (
    <Pill>
      <Tick />
      {children}
    </Pill>
  );
}

