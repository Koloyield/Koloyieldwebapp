import { useState } from "react";
import Badge from "./Badge";
import Btn from './Button'
import  Input  from "./Input";
import  Select  from "./Select";

export default  function SettingsModal({ addrs, onChange, onClose }) {
  const [circle,   setCircle]   = useState(addrs.circle);
  const [personal, setPersonal] = useState(addrs.personal);
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.6)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:16 }}>
      <div style={{ background:"#fff", borderRadius:24, width:"100%", maxWidth:440, padding:24 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <h2 style={{ margin:0, fontSize:18, fontWeight:800 }}>⚙️ Contract Settings</h2>
          <button onClick={onClose} style={{ background:"#F1F5F9", border:"none", borderRadius:50, width:32, height:32, cursor:"pointer", fontSize:16 }}>×</button>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div>
            <label style={{ display:"block", fontSize:13, fontWeight:600, color:"#374151", marginBottom:6 }}>CircleSavings Address</label>
            <input value={circle} onChange={e=>setCircle(e.target.value)} placeholder="0x..." style={{ width:"100%", padding:"10px 14px", border:"1.5px solid #E2E8F0", borderRadius:12, fontSize:13, fontFamily:"monospace", outline:"none", boxSizing:"border-box" }}/>
          </div>
          <div>
            <label style={{ display:"block", fontSize:13, fontWeight:600, color:"#374151", marginBottom:6 }}>PersonalSavings Address</label>
            <input value={personal} onChange={e=>setPersonal(e.target.value)} placeholder="0x..." style={{ width:"100%", padding:"10px 14px", border:"1.5px solid #E2E8F0", borderRadius:12, fontSize:13, fontFamily:"monospace", outline:"none", boxSizing:"border-box" }}/>
          </div>
          <div style={{ background:"#F0FDF4", borderRadius:12, padding:12, fontSize:13, color:"#065F46" }}>
            🔗 Targeting <strong>Base Mainnet</strong> (Chain ID: 8453). Make sure MetaMask is on Base.
          </div>
          <Btn label="Save & Reload Data" onClick={()=>{onChange({circle,personal});onClose();}} />
        </div>
      </div>
    </div>
  );
}