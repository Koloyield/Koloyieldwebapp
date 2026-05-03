
export default function StatCard({ label, value, sub, accent }) {
  return (
    <div style={{ background:"#fff", borderRadius:16, border:"1px solid #F1F5F9", padding:"16px 20px" }}>
      <div style={{ fontSize:11, color:"#94A3B8", fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:6 }}>{label}</div>
      <div style={{ fontSize:26, fontWeight:800, color:accent||"#0F172A", lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:12, color:"#64748B", marginTop:4 }}>{sub}</div>}
    </div>
  );
}