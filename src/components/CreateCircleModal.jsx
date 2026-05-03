import { useState } from "react";
import Badge from "./Badge";
import Btn from './Button'
import  Input  from "./Input";
import  Select  from "./Select";
import { fmtAmt } from "../utils/helpers";
import { FREQS, VISIB } from "../utils/constants";
export default function CreateCircleModal({ onClose, onCreate, txLoading }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ title:"", description:"", contributionAmount:"", frequency:3, maxMembers:10, visibility:0, token:"USDC" });
  const upd = (k,v) => setForm(f=>({...f,[k]:v}));
  const ok  = form.title && form.contributionAmount;

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.6)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:16 }}>
      <div style={{ background:"#fff", borderRadius:24, width:"100%", maxWidth:480, maxHeight:"90vh", overflow:"auto" }}>
        <div style={{ padding:"24px 24px 0" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
            <h2 style={{ margin:0, fontSize:20, fontWeight:800, color:"#0F172A" }}>Create Circle</h2>
            <button onClick={onClose} style={{ background:"#F1F5F9", border:"none", borderRadius:50, width:32, height:32, cursor:"pointer", fontSize:16 }}>×</button>
          </div>
          <div style={{ display:"flex", gap:6, marginBottom:20 }}>
            {[1,2].map(s=><div key={s} style={{ flex:1, height:3, borderRadius:3, background:step>=s?"#10B981":"#E2E8F0" }}/>)}
          </div>
        </div>
        <div style={{ padding:"0 24px 24px", display:"flex", flexDirection:"column", gap:14 }}>
          {step===1 && <>
            <Input label="Circle Name"    value={form.title}              onChange={v=>upd("title",v)}              placeholder="e.g. Lagos Alpha Savers" />
            <div>
              <label style={{ display:"block", fontSize:13, fontWeight:600, color:"#374151", marginBottom:6 }}>Description</label>
              <textarea value={form.description} onChange={e=>upd("description",e.target.value)} placeholder="What's this circle about?" rows={3}
                style={{ width:"100%", padding:"10px 14px", border:"1.5px solid #E2E8F0", borderRadius:12, fontSize:14, outline:"none", resize:"none", boxSizing:"border-box", fontFamily:"'DM Sans', sans-serif" }}/>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <Input label="Contribution ($)" type="number" value={form.contributionAmount} onChange={v=>upd("contributionAmount",v)} placeholder="100" />
              <Input label="Max Members"      type="number" value={form.maxMembers}         onChange={v=>upd("maxMembers",parseInt(v)||2)} />
            </div>
            <Btn label="Continue →" onClick={()=>setStep(2)} disabled={!ok} />
          </>}
          {step===2 && <>
            <div>
              <label style={{ display:"block", fontSize:13, fontWeight:600, color:"#374151", marginBottom:8 }}>Frequency</label>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {FREQS.map((f,i)=>(
                  <button key={f} onClick={()=>upd("frequency",i)} style={{ padding:10, border:`2px solid ${form.frequency===i?"#10B981":"#E2E8F0"}`, borderRadius:12, background:form.frequency===i?"#F0FDF4":"#fff", fontSize:13, fontWeight:600, color:form.frequency===i?"#065F46":"#475569", cursor:"pointer" }}>{f}</button>
                ))}
              </div>
            </div>
            <Select label="Token" value={form.token} onChange={v=>upd("token",v)} options={[["USDC","USDC"],["USDT","USDT"]]}/>
            <div>
              <label style={{ display:"block", fontSize:13, fontWeight:600, color:"#374151", marginBottom:8 }}>Visibility</label>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {VISIB.map((v,i)=>(
                  <button key={v} onClick={()=>upd("visibility",i)} style={{ padding:10, border:`2px solid ${form.visibility===i?"#10B981":"#E2E8F0"}`, borderRadius:12, background:form.visibility===i?"#F0FDF4":"#fff", fontSize:13, fontWeight:600, color:form.visibility===i?"#065F46":"#475569", cursor:"pointer" }}>{i===0?"🌐 ":"🔒 "}{v}</button>
                ))}
              </div>
            </div>
            {/* Summary */}
            <div style={{ background:"#F8FAFC", borderRadius:14, padding:14 }}>
              {[["Circle",form.title],["Amount",`${fmtAmt(form.contributionAmount)} ${form.token} ${FREQS[form.frequency]}`],["Members",`Up to ${form.maxMembers}`]].map(([k,v])=>(
                <div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:4 }}>
                  <span style={{ color:"#94A3B8" }}>{k}</span>
                  <span style={{ fontWeight:600, color:"#0F172A" }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <Btn label="← Back"      onClick={()=>setStep(1)}            variant="secondary" />
              <button onClick={()=>onCreate(form)} disabled={txLoading} style={{ flex:2, background:"#10B981", color:"#fff", border:"none", borderRadius:14, padding:14, fontSize:15, fontWeight:700, cursor:txLoading?"default":"pointer", opacity:txLoading?0.7:1, fontFamily:"'DM Sans', sans-serif" }}>
                {txLoading ? "⏳ Creating…" : "🍯 Create Circle"}
              </button>
            </div>
          </>}
        </div>
      </div>
    </div>
  );
}