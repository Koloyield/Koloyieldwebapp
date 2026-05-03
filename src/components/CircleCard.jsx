import Badge from "./Badge";
import Btn from './Button'
import  Input  from "./Input";
import  Select  from "./Select";
import { fmtAmt } from "../utils/helpers";
import { FREQS, VISIB, STATES, STCLRS } from "../utils/constants";
export default function CircleCard({ circle, onView, onJoin, isMember, txLoading }) {
  const pct  = circle.status.currentMembers / circle.maxMembers * 100;
  const state = circle.status.state;
  return (
    <div onClick={()=>onView(circle)} style={{ background:"#fff", borderRadius:20, border:"1px solid #E2E8F0", padding:20, cursor:"pointer", position:"relative", overflow:"hidden", transition:"box-shadow 0.2s" }}
      onMouseEnter={e=>e.currentTarget.style.boxShadow="0 8px 32px rgba(16,185,129,0.12)"}
      onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg, #10B981 ${pct}%, #E2E8F0 ${pct}%)` }}/>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
        <div>
          <h3 style={{ margin:0, fontSize:16, fontWeight:700, color:"#0F172A" }}>{circle.title}</h3>
          <p style={{ margin:"2px 0 0", fontSize:12, color:"#94A3B8" }}>{circle.description}</p>
        </div>
        <Badge label={STATES[state]} color={STCLRS[state]} bg={STCLRS[state]+"18"} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:14 }}>
        {[[fmtAmt(circle.contributionAmount),"Per Round","#0F172A","#F8FAFC"],[`${circle.status.currentMembers}/${circle.maxMembers}`,"Members","#10B981","#F0FDF4"],[FREQS[circle.frequency],"Freq","#D97706","#FFFBEB"]].map(([v,l,c,bg])=>(
          <div key={l} style={{ textAlign:"center", padding:"8px 4px", background:bg, borderRadius:10 }}>
            <div style={{ fontSize:15, fontWeight:800, color:c }}>{v}</div>
            <div style={{ fontSize:10, color:"#94A3B8", textTransform:"uppercase" }}>{l}</div>
          </div>
        ))}
      </div>
      {parseFloat(circle.yieldBonus||0) > 0 && (
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:12, background:"#ECFDF5", borderRadius:8, padding:"6px 10px" }}>
          <span style={{ fontSize:12 }}>📈</span>
          <span style={{ fontSize:12, color:"#065F46", fontWeight:600 }}>+${circle.yieldBonus} Uniswap Yield Earned</span>
        </div>
      )}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontSize:12, color:"#94A3B8" }}>Token: <strong style={{ color:"#475569" }}>{circle.token}</strong></span>
        {state === 0 && !isMember
          ? <Btn label={txLoading?"⏳ Wait...":"Join Circle"} small onClick={e=>{e.stopPropagation();onJoin(circle);}} disabled={txLoading} />
          : isMember ? <span style={{ fontSize:12, color:"#10B981", fontWeight:700 }}>✓ Member</span> : null}
      </div>
    </div>
  );
}