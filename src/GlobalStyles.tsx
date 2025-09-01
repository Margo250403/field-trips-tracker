import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  /* Шрифт Inter */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;700&display=swap');

  :root{
    --bg: #0B0B0C;
    --white: #FFFFFF;
    --yellow: #FFC507;
    --btn-bg: rgba(78, 78, 78, 0.5);
  }

  *{ box-sizing: border-box; }
  html, body, #root { height: 100%; }
  body{
    margin: 0;
    background: var(--bg);
    color: var(--white);
    font-family: "Inter", sans-serif;
  }

  img{ display:block; max-width:100%; height:auto; }
`;
