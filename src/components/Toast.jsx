export default function Toast({ msg, type }) {
  const icon = type === "error" ? "❌" : type === "info" ? "ℹ️" : type === "warn" ? "⚠️" : "✅";
  const bdr  = type === "error" ? "#FCA5A5" : type === "info" ? "#BFDBFE" : "#BBF7D0";
  return (
    <div style={{ background:"#fff", borderRadius:14, padding:"12px 18px", boxShadow:"0 8px 32px rgba(0,0,0,0.12)", border:`1px solid ${bdr}`, display:"flex", gap:10, alignItems:"center", maxWidth:360, animation:"fadeSlide 0.3s ease" }}>
      <span style={{ fontSize:16 }}>{icon}</span>
      <span style={{ fontSize:13, color:"#1E293B", flex:1 }}>{msg}</span>
    </div>
  );
}