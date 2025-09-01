
export const EditIcon = ({ color = "#FFFFFF" }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Z" stroke={color} strokeWidth="1.5" fill="none"/>
    <path d="M20.71 7.04a1 1 0 0 0 0-1.41L18.37 3.3a1 1 0 0 0-1.41 0l-1.34 1.34 3.75 3.75 1.34-1.34Z" fill={color}/>
  </svg>
);

export const TrashIcon = ({ color = "#FFFFFF" }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M3 6h18" stroke={color} strokeWidth="1.5"/>
    <path d="M8 6V4h8v2" stroke={color} strokeWidth="1.5"/>
    <path d="M19 6l-1 14H6L5 6" stroke={color} strokeWidth="1.5"/>
    <path d="M10 10v8M14 10v8" stroke={color} strokeWidth="1.5"/>
  </svg>
);
