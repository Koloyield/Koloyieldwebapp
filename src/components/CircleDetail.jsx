import { useState } from "react";
import { fmtAmt, fmtDate, daysUntil, shortA } from "../utils/helpers";
import { FREQS, VISIB, STATES } from "../utils/constants";
import Badge from "./Badge";
import Btn from './Button'
import  Input  from "./Input";
import  Select  from "./Select";
export default function CircleDetail({ circle, account, onClose, onContribute, onInitVote, onCastVote, txLoading }) {
  const [tab, setTab] = useState("overview");
  const [members, setMembers] = useState([]);
  const roundPct = circle.status.totalRounds > 0 ? Math.round(circle.status.currentRound / circle.status.totalRounds * 100) : 0;
  const urgency  = circle.nextDeadline && daysUntil(circle.nextDeadline) <= 3;

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.65)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:1000 }}>
      <div style={{ background:"#fff", borderRadius:"24px 24px 0 0", width:"100%", maxWidth:540, maxHeight:"92vh", overflow:"auto" }}>
        {/* Header */}
        <div style={{ background:"linear-gradient(135deg,#064E3B,#065F46)", padding:"24px 24px 20px", position:"relative" }}>
          <button onClick={onClose} style={{ position:"absolute", top:16, right:16, background:"rgba(255,255,255,0.15)", border:"none", borderRadius:50, width:32, height:32, color:"#fff", cursor:"pointer", fontSize:18 }}>×</button>
          <Badge label={STATES[circle.status.state]} color="#6EE7B7" bg="rgba(255,255,255,0.15)" />
          <h2 style={{ margin:"8px 0 2px", fontSize:22, fontWeight:800, color:"#fff" }}>{circle.title}</h2>
          <p style={{ margin:"0 0 16px", fontSize:13, color:"#A7F3D0" }}>{circle.description}</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
            {[[fmtAmt(circle.contributionAmount),"Per Round"],[`${circle.status.currentMembers}/${circle.maxMembers}`,"Members"],[FREQS[circle.frequency],"Frequency"]].map(([v,l])=>(
              <div key={l} style={{ background:"rgba(255,255,255,0.1)", borderRadius:12, padding:"10px 12px", textAlign:"center" }}>
                <div style={{ fontSize:16, fontWeight:800, color:"#fff" }}>{v}</div>
                <div style={{ fontSize:10, color:"#6EE7B7", textTransform:"uppercase" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", borderBottom:"1px solid #E2E8F0" }}>
          {["overview","members","vote"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{ flex:1, padding:"12px 0", border:"none", background:"none", fontSize:13, fontWeight:tab===t?700:500, color:tab===t?"#10B981":"#94A3B8", borderBottom:`2px solid ${tab===t?"#10B981":"transparent"}`, cursor:"pointer", textTransform:"capitalize" }}>{t}</button>
          ))}
        </div>

        <div style={{ padding:20 }}>
          {tab === "overview" && (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {/* Round progress */}
              <div style={{ background:"#F8FAFC", borderRadius:14, padding:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <span style={{ fontSize:13, fontWeight:600, color:"#374151" }}>Round Progress</span>
                  <span style={{ fontSize:12, color:"#94A3B8" }}>Round {circle.status.currentRound} / {circle.status.totalRounds}</span>
                </div>
                <div style={{ height:8, background:"#E2E8F0", borderRadius:8, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${roundPct}%`, background:"linear-gradient(90deg,#10B981,#059669)", borderRadius:8 }}/>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:8 }}>
                  <span style={{ fontSize:12, color:"#94A3B8" }}>Paid this round: {circle.status.contributionsThisRound}/{circle.status.currentMembers}</span>
                  <span style={{ fontSize:12, color:"#94A3B8" }}>Pot: {fmtAmt(circle.status.totalPot)}</span>
                </div>
              </div>
              {/* Deadline */}
              {circle.nextDeadline && (
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:urgency?"#FFFBEB":"#F0FDF4", borderRadius:12, padding:"12px 16px", border:`1px solid ${urgency?"#FDE68A":"#D1FAE5"}` }}>
                  <div>
                    <div style={{ fontSize:11, color:"#94A3B8", fontWeight:600 }}>NEXT DEADLINE</div>
                    <div style={{ fontSize:14, fontWeight:700, color:"#0F172A" }}>{fmtDate(circle.nextDeadline)}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:24, fontWeight:800, color:urgency?"#D97706":"#10B981" }}>{daysUntil(circle.nextDeadline)}</div>
                    <div style={{ fontSize:11, color:"#94A3B8" }}>days</div>
                  </div>
                </div>
              )}
              {/* Contribute */}
              {circle.status.state === 1 && (
                <button onClick={onContribute} disabled={txLoading}
                  style={{ background:txLoading?"#D1FAE5":"#10B981", color:"#fff", border:"none", borderRadius:16, padding:16, fontSize:16, fontWeight:800, cursor:txLoading?"default":"pointer", fontFamily:"'DM Sans', sans-serif" }}>
                  {txLoading ? "⏳ Processing…" : `💰 Contribute ${fmtAmt(circle.contributionAmount)} ${circle.token}`}
                </button>
              )}
              <div style={{ background:"#F8FAFC", borderRadius:12, padding:"10px 14px", fontSize:12, color:"#64748B" }}>
                Creator: <span style={{ fontFamily:"monospace" }}>{shortA(circle.creator)}</span> · Token: {circle.token} · {VISIB[circle.visibility]}
              </div>
            </div>
          )}

          {tab === "members" && (
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {circle.memberAddresses?.length > 0 ? (
                circle.memberAddresses.map((addr, i) => (
                  <div key={addr} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", background:"#F8FAFC", borderRadius:12 }}>
                    <div style={{ width:36, height:36, borderRadius:50, background:"#ECFDF5", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#059669", flexShrink:0 }}>#{i+1}</div>
                    <div style={{ fontFamily:"monospace", fontSize:13, color:"#1E293B" }}>{shortA(addr)}</div>
                    {addr.toLowerCase() === account?.toLowerCase() && <Badge label="You" color="#0369A1" bg="#EFF6FF" />}
                  </div>
                ))
              ) : (
                <div style={{ textAlign:"center", padding:40, color:"#94A3B8" }}>
                  <div style={{ fontSize:32, marginBottom:8 }}>👥</div>
                  <p style={{ margin:0 }}>Member list loads after connecting wallet</p>
                </div>
              )}
            </div>
          )}

          {tab === "vote" && (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ background:"#FFFBEB", border:"1px solid #FDE68A", borderRadius:12, padding:14, fontSize:13, color:"#92400E" }}>
                🗳️ Voting lets members collectively start or withdraw from the circle. Requires a threshold of votes within the voting period.
              </div>
              <Btn label="📣 Initiate Vote" onClick={onInitVote} disabled={txLoading} />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <Btn label="✅ Vote Start"    onClick={()=>onCastVote(1)} disabled={txLoading} />
                <Btn label="↩️ Vote Withdraw" onClick={()=>onCastVote(2)} disabled={txLoading} variant="secondary" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}