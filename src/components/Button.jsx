export default function Btn({ label, onClick, disabled, variant="primary", small }) {
  const styles = {
    primary:   { background:"#10B981", color:"#fff" },
    secondary: { background:"#F1F5F9", color:"#475569" },
    danger:    { background:"#FEF2F2", color:"#DC2626" },
    dark:      { background:"#0F172A", color:"#fff" },
  };
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ ...styles[variant], border:"none", borderRadius:small?12:14, padding:small?"6px 14px":"12px 20px", fontSize:small?12:14, fontWeight:700, cursor:disabled?"default":"pointer", opacity:disabled?0.6:1, fontFamily:"'DM Sans', sans-serif", whiteSpace:"nowrap" }}>
      {label}
    </button>
  );
}