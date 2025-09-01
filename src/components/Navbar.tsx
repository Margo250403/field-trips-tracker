import { useEffect, useState, useCallback } from "react";
import styled, { css } from "styled-components";
import logo from "../assets/logo.png";

/* ---------- component ---------- */
export default function Navbar() {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);
  const toggle = () => setOpen(v => !v);

  // lock page scroll when menu open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : prev || "";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  return (
    <Frame>
      <Row>
        <Brand>
          <img src={logo} alt="IRC Logo" width={40} height={40} />
          <BrandTitle>Field Trips Tracker</BrandTitle>
        </Brand>

        {/* desktop menu */}
        <Menu aria-label="Main navigation">
          <MenuLink href="/">Home</MenuLink>
          <MenuLink href="/trips">Trips</MenuLink>
          <MenuLink href="/calendar">Calendar</MenuLink>
          <MenuLink href="/maps">Maps</MenuLink>
          <MenuLink href="/report">Report</MenuLink>
        </Menu>

        {/* burger button (tablet/phone) */}
        <BurgerBtn
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-controls="mobile-nav"
          aria-expanded={open}
          onClick={toggle}
          $open={open}
        >
          <span />
          <span />
          <span />
        </BurgerBtn>
      </Row>

      {/* overlay + drawer */}
      <Overlay $open={open} onClick={close} />
      <Drawer id="mobile-nav" role="dialog" aria-modal="true" $open={open}>
        <DrawerHeader>
          <BrandSmall>
            <img src={logo} alt="" width={28} height={28} />
            <strong>Menu</strong>
          </BrandSmall>
          <CloseX onClick={close} aria-label="Close menu">×</CloseX>
        </DrawerHeader>

        <DrawerNav>
          <DrawerLink href="/" onClick={close}>Home</DrawerLink>
          <DrawerLink href="/trips" onClick={close}>Trips</DrawerLink>
          <DrawerLink href="/calendar" onClick={close}>Calendar</DrawerLink>
          <DrawerLink href="/maps" onClick={close}>Maps</DrawerLink>
          <DrawerLink href="/report" onClick={close}>Report</DrawerLink>
        </DrawerNav>
      </Drawer>
    </Frame>
  );
}

/* ---------- styles ---------- */

const bpTablet = 1024; // <=1024: burger mode

const Frame = styled.header`
  width: 100%;
  margin: 0 auto;
  padding: 24px 65px 0;

  @media (max-width: ${bpTablet}px) {
    padding: 16px 20px 0;
  }
`;

const Row = styled.div`
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: ${bpTablet}px) {
    img { width: 32px; height: 32px; }
  }
`;

const BrandTitle = styled.div`
  font-weight: 700;
  font-size: 32px;
  color: #fff;

  @media (max-width: ${bpTablet}px) { font-size: 22px; }
`;

const Menu = styled.nav`
  display: flex;
  align-items: center;
  gap: 42px;

  @media (max-width: ${bpTablet}px) {
    display: none; /* hide desktop menu on tablet/phone */
  }
`;

const MenuLink = styled.a`
  text-decoration: none;
  color: #fff;
  font-weight: 700;
  font-size: 25px;

  &:hover { opacity: .9; }

  @media (max-width: 1280px) { font-size: 20px; }
`;

/* --- burger button --- */
const BurgerBtn = styled.button<{ $open: boolean }>`
  display: none;
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid #2a2a2a;
  background: #101010;
  cursor: pointer;

  @media (max-width: ${bpTablet}px) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  span {
    position: absolute;
    height: 2px;
    width: 22px;
    background: #fff;
    transition: transform .25s ease, opacity .2s ease, top .25s ease;
  }
  span:nth-child(1) { top: 14px; }
  span:nth-child(2) { top: 21px; }
  span:nth-child(3) { top: 28px; }

  ${({ $open }) =>
    $open &&
    css`
      span:nth-child(1) { top: 21px; transform: rotate(45deg); }
      span:nth-child(2) { opacity: 0; }
      span:nth-child(3) { top: 21px; transform: rotate(-45deg); }
    `}
`;

/* --- mobile drawer --- */
const Overlay = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.5);
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};
  transition: opacity .2s ease;
  z-index: 999;
`;

const Drawer = styled.aside<{ $open: boolean }>`
  position: fixed;
  top: 0; right: 0; bottom: 0;
  width: min(360px, 86vw);
  background: #0b0b0c;
  border-left: 2px solid #ffd500;
  transform: translateX(${({ $open }) => ($open ? "0%" : "100%")});
  transition: transform .25s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  padding: 16px 16px 24px;
`;

const DrawerHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding-bottom: 6px; border-bottom: 1px solid #2a2a2a;
`;

const BrandSmall = styled.div`
  display: flex; align-items: center; gap: 10px;
  color: #ffd500; font-weight: 800; font-size: 16px;
`;

const CloseX = styled.button`
  width: 40px; height: 40px; border-radius: 10px;
  border: 1px solid #ffd500; background: #1a1a1a; color: #ffd500;
  font-size: 24px; line-height: 0; cursor: pointer;
`;

const DrawerNav = styled.nav`
  display: flex; flex-direction: column; gap: 8px;
  padding-top: 12px;
`;

const DrawerLink = styled.a`
  display: block;
  padding: 12px 10px;
  border-radius: 10px;
  text-decoration: none;
  color: #fff;
  font-weight: 800;
  font-size: 18px;
  background: #101010;
  border: 1px solid #2a2a2a;

  &:hover { border-color: #ffd500; }
`;
