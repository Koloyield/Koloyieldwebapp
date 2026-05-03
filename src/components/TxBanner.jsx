export default function TxBanner({ hash }) {
  if (!hash) return null;
  return (
    <div style={{ background:"#EFF6FF", border:"1px solid #BFDBFE", borderRadius:12, padding:"8px 16px", display:"flex", gap:10, alignItems:"center", fontSize:13 }}>
      <span>🔗</span>
      <span style={{ color:"#1E40AF" }}>Tx: </span>
      <a href={`https://basescan.org/tx/${hash}`} target="_blank" rel="noreferrer" style={{ color:"#2563EB", fontWeight:700, textDecoration:"none" }}>{hash.slice(0,10)}…{hash.slice(-6)}</a>
    </div>
  );
}