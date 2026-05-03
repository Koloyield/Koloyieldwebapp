import { useState } from "react";
import Badge from "./Badge";
import Btn from './Button'
import  Input  from "./Input";
import  Select  from "./Select";
import { fmtAmt } from "../utils/helpers";
import { FREQS, VISIB } from "../utils/constants";

export default function CreateGoalModal({ onClose, onCreate, txLoading }) {
  const [form, setForm] = useState({ name:"", targetAmount:"", contributionAmount:"", frequency:3, deadline:"", enableYield:false, token:"USDC" });
  const upd = (k,v) => setForm(f=>({...f,[k]:v}));
  const ok  = form.name && form.targetAmount && form.contributionAmount && form.deadline;

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.6)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:16 }}>
      <div style={{ background:"#fff", borderRadius:24, width:"100%", maxWidth:460, maxHeight:"90vh", overflow:"auto" }}>
        <div style={{ padding:24 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <h2 style={{ margin:0, fontSize:20, fontWeight:800, color:"#0F172A" }}>🎯 New Savings Goal</h2>
            <button onClick={onClose} style={{ background:"#F1F5F9", border:"none", borderRadius:50, width:32, height:32, cursor:"pointer", fontSize:16 }}>×</button>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Input label="Goal Name"            value={form.name}               onChange={v=>upd("name",v)}               placeholder="e.g. Emergency Fund" />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <Input label="Target Amount ($)"  type="number" value={form.targetAmount}        onChange={v=>upd("targetAmount",v)}        placeholder="2000" />
              <Input label="Per Contribution ($)" type="number" value={form.contributionAmount} onChange={v=>upd("contributionAmount",v)} placeholder="100" />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <Select label="Frequency" value={form.frequency} onChange={v=>upd("frequency",parseInt(v))} options={FREQS.map((f,i)=>[i,f])}/>
              <Select label="Token"     value={form.token}     onChange={v=>upd("token",v)}               options={[["USDC","USDC"],["USDT","USDT"]]}/>
            </div>
            <Input label="Deadline" type="date" value={form.deadline} onChange={v=>upd("deadline",v)} />
            <label style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", fontSize:14, color:"#374151", fontWeight:600 }}>
              <input type="checkbox" checked={form.enableYield} onChange={e=>upd("enableYield",e.target.checked)} style={{ width:16, height:16, accentColor:"#10B981" }}/>
              Enable Yield (Uniswap)
            </label>
            <button onClick={()=>onCreate(form)} disabled={!ok||txLoading}
              style={{ background:ok&&!txLoading?"#10B981":"#E2E8F0", color:ok&&!txLoading?"#fff":"#94A3B8", border:"none", borderRadius:14, padding:14, fontSize:15, fontWeight:700, cursor:ok&&!txLoading?"pointer":"default", fontFamily:"'DM Sans', sans-serif" }}>
              {txLoading ? "⏳ Creating…" : "🎯 Create Goal"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}