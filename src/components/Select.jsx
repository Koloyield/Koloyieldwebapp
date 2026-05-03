export default function Select({ label, value, onChange, options }) {
  return (
    <div>
      {label && <label style={{ display:"block", fontSize:13, fontWeight:600, color:"#374151", marginBottom:6 }}>{label}</label>}
      <select value={value} onChange={e=>onChange(e.target.value)}
        style={{ width:"100%", padding:"10px 14px", border:"1.5px solid #E2E8F0", borderRadius:12, fontSize:14, outline:"none", boxSizing:"border-box", background:"#fff", fontFamily:"'DM Sans', sans-serif" }}>
        {options.map(([v,l])=><option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  );
}