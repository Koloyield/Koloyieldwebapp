export default function Badge({ label, color, bg }) {
  return <span style={{ background: bg, color, borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700 }}>{label}</span>;
}
