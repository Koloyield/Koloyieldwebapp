export default function Input({ label, type="text", value, onChange, placeholder, step }) {
  return (
    <div>
      {label && <label style={{ display:"block", fontSize:13, fontWeight:600, color:"#374151", marginBottom:6 }}>{label}</label>}
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} step={step}
        style={{ width:"100%", padding:"10px 14px", border:"1.5px solid #E2E8F0", borderRadius:12, fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"'DM Sans', sans-serif" }} />
    </div>
  );
}