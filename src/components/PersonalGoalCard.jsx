import Badge from "./Badge";
import Btn from './Button'
import  Input  from "./Input";
import  Select  from "./Select";
import { fmtAmt, daysUntil } from "../utils/helpers";
import { FREQS } from "../utils/constants";

export default function GoalCard({ goal, onContribute, onWithdraw, txLoading }) {
  const pct = goal.progress;
  const expired = goal.deadline < Date.now();
  return (
    <div style={{ background:"#fff", borderRadius:20, border:"1px solid #E2E8F0", padding:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
        <div>
          <h3 style={{ margin:0, fontSize:16, fontWeight:700, color:"#0F172A" }}>{goal.name}</h3>
          <span style={{ fontSize:12, color:"#94A3B8" }}>{goal.token} · {FREQS[goal.frequency]}</span>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:16, fontWeight:800, color:"#059669" }}>{fmtAmt(goal.currentAmount)}</div>
          <div style={{ fontSize:11, color:"#94A3B8" }}>of {fmtAmt(goal.targetAmount)}</div>
        </div>
      </div>
      {/* Progress bar */}
      <div style={{ height:8, background:"#E2E8F0", borderRadius:8, overflow:"hidden", marginBottom:8 }}>
        <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg, ${pct>=100?"#059669":"#10B981"}, ${pct>=100?"#047857":"#34D399"})`, borderRadius:8, transition:"width 0.5s" }}/>
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
        <span style={{ fontSize:12, color:"#94A3B8" }}>{pct}% saved · {goal.contributionCount} contributions</span>
        <span style={{ fontSize:12, color:expired?"#EF4444":"#10B981", fontWeight:600 }}>
          {expired ? "⏰ Deadline passed" : `${daysUntil(goal.deadline)}d remaining`}
        </span>
      </div>
      <div style={{ display:"flex", gap:8 }}>
        {goal.isActive && <Btn small label={`➕ Add ${fmtAmt(goal.contributionAmount)}`} onClick={()=>onContribute(goal)} disabled={txLoading} />}
        {goal.isActive && <Btn small label="↩️ Withdraw"                               onClick={()=>onWithdraw(goal)}    disabled={txLoading} variant="secondary" />}
        {goal.isYieldEnabled && <span style={{ fontSize:11, color:"#059669", fontWeight:600, alignSelf:"center", marginLeft:"auto" }}>📈 Yield ON</span>}
      </div>
    </div>
  );
}