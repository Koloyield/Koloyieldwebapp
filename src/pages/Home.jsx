import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import CircleCard from "../components/CircleCard";
import CreateCircleModal from "../components/CreateCircleModal";
import CreateGoalModal from "../components/CreateGoalModal";
import SettingsModal from "../components/SettingsModal";
import StatCard from "../components/StatCard";
import Toast from "../components/Toast";
import GoalCard from "../components/PersonalGoalCard";
import Btn from "../components/Button";
import { useAccount } from "wagmi";
import { JsonRpcProvider } from "ethers";
const readOnlyProvider = new JsonRpcProvider()
import {
  DEFAULT_CIRCLE_ADDR,
  DEFAULT_PERSONAL_ADDR,
  TOKENS,
  CIRCLE_ABI,
  PERSONAL_ABI,
  ERC20_ABI,
} from "../abi";
import { fmtAmt, shortA } from "../utils/helpers";

// ─── ethers provider/signer straight from window.ethereum ────────────────────
// RainbowKit has already injected and connected the wallet — we just wrap it.
function getProviderAndSigner() {
 	const [signer, setSigner] = useState(null);
	// const [jsonRpcProvider, setJsonRpcProvider] = useState(null);
    const {address} = useAccount()

	// const provider = getEthersSigner(config);

    // const [signer, setSigner] = useState(null);

    useEffect(() => {
      async function fetchSigner() {
        try {
          const signer = await getEthersSigner(config); // optionally pass { chainId }
        //   const provider =  await getEthersProvider(config);
        //   setJsonRpcProvider(provider);
          setSigner(signer);
        } catch (err) {
          console.error('Failed to get signer:', err);
        }
      }
  
      fetchSigner();
    }, [config, address]);

	return { signer, readOnlyProvider: readOnlyProvider };
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_CIRCLES = [
  {
    id: 1,
    title: "Lagos Alpha Savers",
    description: "Top earners circle — grow together",
    contributionAmount: "100",
    frequency: 3,
    maxMembers: 10,
    visibility: 0,
    creator: "0x71...a3F",
    createdAt: Date.now() - 86400000 * 5,
    status: { state: 1, currentMembers: 7, currentRound: 2, totalRounds: 10, totalPot: "700", contributionsThisRound: 4 },
    token: "USDC", tokenDecimals: 6, tokenAddress: TOKENS.USDC.address,
    yieldBonus: "12.50", nextDeadline: Date.now() + 86400000 * 8,
  },
  {
    id: 2,
    title: "Abuja Tech Paddies",
    description: "Developer crew savings circle",
    contributionAmount: "50",
    frequency: 1,
    maxMembers: 5,
    visibility: 0,
    creator: "0x9F...b2C",
    createdAt: Date.now() - 86400000 * 2,
    status: { state: 0, currentMembers: 3, currentRound: 0, totalRounds: 5, totalPot: "0", contributionsThisRound: 0 },
    token: "USDT", tokenDecimals: 6, tokenAddress: TOKENS.USDT.address,
    yieldBonus: "0", nextDeadline: null,
  },
  {
    id: 3,
    title: "Port Harcourt Mums",
    description: "Community savings for school fees",
    contributionAmount: "200",
    frequency: 3,
    maxMembers: 8,
    visibility: 1,
    creator: "0x45...c7D",
    createdAt: Date.now() - 86400000 * 12,
    status: { state: 1, currentMembers: 8, currentRound: 4, totalRounds: 8, totalPot: "1600", contributionsThisRound: 6 },
    token: "USDC", tokenDecimals: 6, tokenAddress: TOKENS.USDC.address,
    yieldBonus: "31.20", nextDeadline: Date.now() + 86400000 * 3,
  },
];

const MOCK_GOALS = [
  {
    id: 1,
    name: "Emergency Fund",
    targetAmount: "2000", currentAmount: "850", contributionAmount: "50",
    frequency: 3, deadline: Date.now() + 86400000 * 180,
    isActive: true, isYieldEnabled: true, contributionCount: 17,
    token: "USDC", tokenDecimals: 6, tokenAddress: TOKENS.USDC.address, progress: 42,
  },
  {
    id: 2,
    name: "New Laptop Fund",
    targetAmount: "1500", currentAmount: "1200", contributionAmount: "100",
    frequency: 1, deadline: Date.now() + 86400000 * 30,
    isActive: true, isYieldEnabled: false, contributionCount: 12,
    token: "USDC", tokenDecimals: 6, tokenAddress: TOKENS.USDC.address, progress: 80,
  },
];

// ─── TxBanner ─────────────────────────────────────────────────────────────────
function TxBanner({ hash }) {
  return (
    <div style={{ background: "#ECFDF5", border: "1px solid #6EE7B7", borderRadius: 12, padding: "10px 16px", fontSize: 13, color: "#065F46", display: "flex", alignItems: "center", gap: 8 }}>
      ✅ Transaction sent:{" "}
      <a href={`https://chainscan-galileo.0g.ai/tx/${hash}`} target="_blank" rel="noreferrer" style={{ color: "#059669", fontFamily: "monospace" }}>
        {hash.slice(0, 12)}…{hash.slice(-8)}
      </a>
    </div>
  );
}

// ─── CircleDetail modal ───────────────────────────────────────────────────────
function CircleDetail({ circle, onClose, onContribute, onInitVote, txLoading }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 24, padding: 28, maxWidth: 500, width: "100%", maxHeight: "85vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800, color: "#0F172A" }}>{circle.title}</h2>
            <p style={{ margin: 0, color: "#64748B", fontSize: 14 }}>{circle.description}</p>
          </div>
          <button onClick={onClose} style={{ background: "#F1F5F9", border: "none", borderRadius: 10, padding: "6px 10px", cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {[
            ["Contribution", `${fmtAmt(circle.contributionAmount)} ${circle.token}`],
            ["Members", `${circle.status.currentMembers} / ${circle.maxMembers}`],
            ["Round", `${circle.status.currentRound} / ${circle.status.totalRounds}`],
            ["Total Pot", `${fmtAmt(circle.status.totalPot)} ${circle.token}`],
          ].map(([label, val]) => (
            <div key={label} style={{ background: "#F8FAFC", borderRadius: 12, padding: "10px 14px" }}>
              <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>{val}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onContribute} disabled={txLoading} style={{ flex: 1, background: txLoading ? "#D1FAE5" : "#059669", color: txLoading ? "#065F46" : "#fff", border: "none", borderRadius: 12, padding: "11px 22px", fontWeight: 700, fontSize: 14, cursor: txLoading ? "not-allowed" : "pointer" }}>
            {txLoading ? "⏳ Processing…" : "💰 Contribute"}
          </button>
          <button onClick={onInitVote} disabled={txLoading} style={{ background: "#F1F5F9", color: "#475569", border: "none", borderRadius: 12, padding: "11px 16px", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            🗳️ Vote
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function Home() {
  // RainbowKit owns connection — we only need address + isConnected
  const { address: account, isConnected } = useAccount();

  const [page, setPage] = useState("home");
  const [circles, setCircles] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loadingC, setLoadingC] = useState(false);
  const [loadingG, setLoadingG] = useState(false);
  const [txLoading, setTxLoading] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [modals, setModals] = useState({ createCircle: false, createGoal: false, settings: false, circleDetail: null });
  const [filter, setFilter] = useState("all");
  const [joinedIds, setJoinedIds] = useState(new Set());
  const [addrs, setAddrs] = useState({ circle: DEFAULT_CIRCLE_ADDR, personal: DEFAULT_PERSONAL_ADDR });

  const isDemoMode = !addrs.circle && !addrs.personal;

  // ── Notifications ─────────────────────────────────────────────────────────
  const notify = useCallback((msg, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5000);
  }, []);

  // ── Contract helpers ──────────────────────────────────────────────────────
  // Pass withSigner=true for write calls, false (default) for read calls
  const getCircleContract = useCallback((withSigner = false) => {
    if (!addrs.circle) return null;
    const { provider, signer } = getProviderAndSigner();
    return new ethers.Contract(addrs.circle, CIRCLE_ABI, withSigner ? signer : provider);
  }, [addrs.circle]);

  const getPersonalContract = useCallback((withSigner = false) => {
    if (!addrs.personal) return null;
    const { provider, signer } = getProviderAndSigner();
    return new ethers.Contract(addrs.personal, PERSONAL_ABI, withSigner ? signer : provider);
  }, [addrs.personal]);

  // ── Token approval ────────────────────────────────────────────────────────
  const ensureApproval = useCallback(async (tokenAddress, spender, amountBN) => {
    const { signer } = getProviderAndSigner();
    const addr = await signer.getAddress();
    const tc = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
    const allowance = await tc.allowance(addr, spender);
    if (allowance.lt(amountBN)) {
      notify("Approving token spend…", "info");
      const tx = await tc.approve(spender, ethers.constants.MaxUint256);
      await tx.wait();
      notify("Token approved ✓", "success");
    }
  }, [notify]);

  // ── tx wrapper ────────────────────────────────────────────────────────────
  const runTx = useCallback(async (fn) => {
    setTxLoading(true);
    setTxHash(null);
    try {
      const tx = await fn();
      setTxHash(tx.hash);
      notify(`Tx sent: ${shortA(tx.hash)}`, "info");
      await tx.wait();
      notify("Transaction confirmed! ✅");
      return true;
    } catch (e) {
      notify(e.reason || e.message || "Transaction failed", "error");
      return false;
    } finally {
      setTxLoading(false);
    }
  }, [notify]);

  // ── Fetch circles ─────────────────────────────────────────────────────────
  const fetchCircles = useCallback(async () => {
    if (!addrs.circle || !isConnected) return;
    setLoadingC(true);
    try {
      const cc = getCircleContract(); // read-only
      const count = (await cc.circleCounter()).toNumber();
      const results = await Promise.all(
        Array.from({ length: count }, async (_, i) => {
          const id = i + 1;
          try {
            const [cfg, status, deadline] = await cc.getCircleDetails(id);
            const tokenAddr = await cc.circleToken(id);
            const entry = Object.entries(TOKENS).find(([, t]) => t.address.toLowerCase() === tokenAddr.toLowerCase());
            const sym = entry?.[0] || "TOKEN";
            const dec = entry?.[1]?.decimals ?? 18;
            const fmt = (v) => ethers.formatUnits(v, dec);
            return {
              id,
              title: cfg.title,
              description: cfg.description,
              creator: cfg.creator,
              contributionAmount: fmt(cfg.contributionAmount),
              frequency: cfg.frequency,
              maxMembers: cfg.maxMembers.toNumber(),
              visibility: cfg.visibility,
              createdAt: cfg.createdAt.toNumber() * 1000,
              token: sym, tokenAddress: tokenAddr, tokenDecimals: dec,
              status: {
                state: status.state,
                currentMembers: status.currentMembers.toNumber(),
                currentRound: status.currentRound.toNumber(),
                totalRounds: status.totalRounds.toNumber(),
                totalPot: fmt(status.totalPot),
                contributionsThisRound: status.contributionsThisRound.toNumber(),
              },
              nextDeadline: deadline.gt(0) ? deadline.toNumber() * 1000 : null,
              yieldBonus: "0",
            };
          } catch { return null; }
        })
      );
      setCircles(results.filter(Boolean));
    } catch (e) {
      notify("Circle fetch failed: " + e.message, "error");
    } finally {
      setLoadingC(false);
    }
  }, [addrs.circle, isConnected, getCircleContract, notify]);

  // ── Fetch goals ───────────────────────────────────────────────────────────
  const fetchGoals = useCallback(async () => {
    if (!addrs.personal || !account || !isConnected) return;
    setLoadingG(true);
    try {
      const pc = getPersonalContract(); // read-only
      const ids = await pc.getUserGoals(account);
      const results = await Promise.all(
        ids.map(async (id) => {
          try {
            const g = await pc.personalGoals(id);
            const tAddr = await pc.goalToken(id);
            const entry = Object.entries(TOKENS).find(([, t]) => t.address.toLowerCase() === tAddr.toLowerCase());
            const sym = entry?.[0] || "TOKEN";
            const dec = entry?.[1]?.decimals ?? 18;
            const fu = (v) => ethers.formatUnits(v, dec);
            const pct = g.targetAmount.gt(0)
              ? Math.min(100, g.currentAmount.mul(100).div(g.targetAmount).toNumber())
              : 0;
            return {
              id: id.toNumber(),
              owner: g.owner, name: g.name,
              targetAmount: fu(g.targetAmount), currentAmount: fu(g.currentAmount),
              contributionAmount: fu(g.contributionAmount),
              frequency: g.frequency, deadline: g.deadline.toNumber() * 1000,
              isActive: g.isActive, isYieldEnabled: g.isYieldEnabled,
              contributionCount: g.contributionCount.toNumber(),
              token: sym, tokenAddress: tAddr, tokenDecimals: dec, progress: pct,
            };
          } catch { return null; }
        })
      );
      setGoals(results.filter(Boolean));
    } catch (e) {
      notify("Goal fetch failed: " + e.message, "error");
    } finally {
      setLoadingG(false);
    }
  }, [addrs.personal, account, isConnected, getPersonalContract, notify]);

  // Auto-fetch when wallet connects
  useEffect(() => { if (isConnected && addrs.circle) fetchCircles(); }, [isConnected, addrs.circle]);
  useEffect(() => { if (isConnected && account && addrs.personal) fetchGoals(); }, [isConnected, account, addrs.personal]);

  // ── Join circle ───────────────────────────────────────────────────────────
  const handleJoin = useCallback(async (circle) => {
    if (isDemoMode) {
      setJoinedIds((s) => new Set([...s, circle.id]));
      notify(`Joined "${circle.title}" (demo)`);
      return;
    }
    const amtRaw = ethers.parseUnits(circle.contributionAmount, circle.tokenDecimals);
    await ensureApproval(circle.tokenAddress, addrs.circle, amtRaw);
    const ok = await runTx(() => getCircleContract(true).joinCircle(circle.id));
    if (ok) { setJoinedIds((s) => new Set([...s, circle.id])); fetchCircles(); }
  }, [isDemoMode, addrs.circle, getCircleContract, ensureApproval, runTx, fetchCircles, notify]);

  // ── Contribute to circle ──────────────────────────────────────────────────
  const handleContribute = useCallback(async (circle) => {
    if (isDemoMode) {
      notify(`Contribution demo — ${fmtAmt(circle.contributionAmount)} ${circle.token}`);
      setModals((m) => ({ ...m, circleDetail: null }));
      return;
    }
    const amtRaw = ethers.parseUnits(circle.contributionAmount, circle.tokenDecimals);
    await ensureApproval(circle.tokenAddress, addrs.circle, amtRaw);
    const ok = await runTx(() => getCircleContract(true).contribute(circle.id));
    if (ok) { notify("Contribution confirmed! 🎉"); fetchCircles(); setModals((m) => ({ ...m, circleDetail: null })); }
  }, [isDemoMode, addrs.circle, getCircleContract, ensureApproval, runTx, fetchCircles, notify]);

  // ── Create circle ─────────────────────────────────────────────────────────
  const handleCreateCircle = useCallback(async (form) => {
    if (isDemoMode) {
      const newC = {
        id: Date.now(), title: form.title, description: form.description,
        contributionAmount: form.contributionAmount, frequency: form.frequency,
        maxMembers: form.maxMembers, visibility: form.visibility,
        creator: account || "You", createdAt: Date.now(),
        token: form.token, tokenDecimals: 6, tokenAddress: TOKENS[form.token].address,
        status: { state: 0, currentMembers: 1, currentRound: 0, totalRounds: form.maxMembers, totalPot: "0", contributionsThisRound: 0 },
        nextDeadline: null, yieldBonus: "0",
      };
      setCircles((c) => [newC, ...c]);
      setJoinedIds((s) => new Set([...s, newC.id]));
      notify("Circle created (demo)! 🍯");
      setModals((m) => ({ ...m, createCircle: false }));
      return;
    }
    const token = TOKENS[form.token];
    const amtRaw = ethers.parseUnits(form.contributionAmount, token.decimals);
    console.log(amtRaw)
    await ensureApproval(token.address, addrs.circle, BigInt(amtRaw));
    const ok = await runTx(() =>
      getCircleContract(true).createCircle({
        title: form.title, description: form.description,
        contributionAmount: amtRaw, frequency: form.frequency,
        maxMembers: form.maxMembers, visibility: form.visibility,
        token: token.address,
      })
    );
    if (ok) { notify("Circle created! 🍯"); fetchCircles(); setModals((m) => ({ ...m, createCircle: false })); }
  }, [isDemoMode, account, addrs.circle, getCircleContract, ensureApproval, runTx, fetchCircles, notify]);

  // ── Create goal ───────────────────────────────────────────────────────────
  const handleCreateGoal = useCallback(async (form) => {
    if (isDemoMode) {
      const g = {
        id: Date.now(), name: form.name,
        targetAmount: form.targetAmount, currentAmount: "0",
        contributionAmount: form.contributionAmount, frequency: parseInt(form.frequency),
        deadline: new Date(form.deadline).getTime(),
        isActive: true, isYieldEnabled: form.enableYield, contributionCount: 0,
        token: form.token, tokenDecimals: 6, tokenAddress: TOKENS[form.token].address, progress: 0,
      };
      setGoals((gs) => [g, ...gs]);
      notify("Goal created (demo)! 🎯");
      setModals((m) => ({ ...m, createGoal: false }));
      return;
    }
    const token = TOKENS[form.token];
    const tgtRaw = ethers.parseUnits(form.targetAmount, token.decimals);
    const cntRaw = ethers.parseUnits(form.contributionAmount, token.decimals);
    const dlTs = Math.floor(new Date(form.deadline).getTime() / 1000);
    await ensureApproval(token.address, addrs.personal, cntRaw);
    const ok = await runTx(() =>
      getPersonalContract(true).createPersonalGoal({
        name: form.name, targetAmount: tgtRaw, contributionAmount: cntRaw,
        frequency: form.frequency, deadline: dlTs,
        enableYield: form.enableYield, token: token.address, yieldAPY: 0,
      })
    );
    if (ok) { notify("Goal created! 🎯"); fetchGoals(); setModals((m) => ({ ...m, createGoal: false })); }
  }, [isDemoMode, addrs.personal, getPersonalContract, ensureApproval, runTx, fetchGoals, notify]);

  // ── Contribute to goal ────────────────────────────────────────────────────
  const handleContributeGoal = useCallback(async (goal) => {
    if (isDemoMode) { notify(`Goal contribution demo — ${fmtAmt(goal.contributionAmount)} ${goal.token}`); return; }
    const amtRaw = ethers.parseUnits(goal.contributionAmount, goal.tokenDecimals);
    await ensureApproval(goal.tokenAddress, addrs.personal, amtRaw);
    const ok = await runTx(() => getPersonalContract(true).contributeToGoal(goal.id, amtRaw));
    if (ok) { notify("Goal contribution made! 💚"); fetchGoals(); }
  }, [isDemoMode, addrs.personal, getPersonalContract, ensureApproval, runTx, fetchGoals, notify]);

  // ── Withdraw from goal ────────────────────────────────────────────────────
  const handleWithdrawGoal = useCallback(async (goal) => {
    if (isDemoMode) { notify(`Withdraw demo — ${fmtAmt(goal.currentAmount)} ${goal.token}`); return; }
    const amtRaw = ethers.parseUnits(goal.currentAmount, goal.tokenDecimals);
    const ok = await runTx(() => getPersonalContract(true).withdrawFromGoal(goal.id, amtRaw));
    if (ok) { notify("Withdrawal complete 💸"); fetchGoals(); }
  }, [isDemoMode, getPersonalContract, runTx, fetchGoals, notify]);

  // ── Vote helpers ──────────────────────────────────────────────────────────
  const handleInitVote = useCallback(async (circle) => {
    const ok = await runTx(() => getCircleContract(true).initiateVoting(circle.id));
    if (ok) notify("Voting initiated ✅");
  }, [getCircleContract, runTx, notify]);

  const handleCastVote = useCallback(async (circle, choice) => {
    const ok = await runTx(() => getCircleContract(true).castVote(circle.id, choice));
    if (ok) notify("Vote cast ✅");
  }, [getCircleContract, runTx, notify]);

  // ── Derived data ──────────────────────────────────────────────────────────
  const displayCircles = isDemoMode ? MOCK_CIRCLES : circles;
  const displayGoals   = isDemoMode ? MOCK_GOALS   : goals;

  const myCircles = displayCircles.filter(
    (c) => joinedIds.has(c.id) || (account && c.creator?.toLowerCase() === account?.toLowerCase())
  );
  const filteredCircles = displayCircles.filter((c) => {
    if (filter === "mine")   return joinedIds.has(c.id) || (account && c.creator?.toLowerCase() === account?.toLowerCase());
    if (filter === "open")   return c.status.state === 0;
    if (filter === "active") return c.status.state === 1;
    return true;
  });
  const totalYield = myCircles.reduce((s, c) => s + parseFloat(c.yieldBonus || 0), 0);

  // ═══════════════════════════════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        button, input, textarea, select { font-family: 'DM Sans', system-ui, sans-serif; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 4px; }
      `}</style>

      {/* Toasts */}
      <div style={{ position: "fixed", top: 16, right: 16, zIndex: 3000, display: "flex", flexDirection: "column", gap: 8 }}>
        {toasts.map((t) => <Toast key={t.id} msg={t.msg} type={t.type} />)}
      </div>

      {/* Demo banner */}
      {isDemoMode && (
        <div style={{ background: "linear-gradient(90deg,#FFFBEB,#FEF3C7)", borderBottom: "1px solid #FDE68A", padding: "10px 20px", textAlign: "center", fontSize: 13, color: "#92400E" }}>
          🎭 <strong>Demo Mode</strong> — showing mock data.{" "}
          <button onClick={() => setModals((m) => ({ ...m, settings: true }))} style={{ background: "none", border: "none", color: "#D97706", fontWeight: 700, cursor: "pointer", textDecoration: "underline", fontSize: 13 }}>
            ⚙️ Settings
          </button>{" "}
          to configure contract addresses.
        </div>
      )}

      {/* Nav */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "0 20px", position: "sticky", top: isDemoMode ? 40 : 0, zIndex: 100 }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 22 }}>🍯</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: "#0F172A" }}>KoloYield</span>
            <span style={{ fontSize: 11, color: "#10B981", fontWeight: 700, background: "#ECFDF5", padding: "2px 8px", borderRadius: 20 }}>Autonomous Ajo</span>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {[["home","🏠","Home"],["circles","⭕","Circles"],["goals","🎯","Goals"],["profile","👤","Profile"]].map(([p, icon, label]) => (
              <button key={p} onClick={() => setPage(p)} style={{ background: page === p ? "#F0FDF4" : "none", color: page === p ? "#059669" : "#64748B", border: "none", borderRadius: 10, padding: "6px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                {icon} {label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => setModals((m) => ({ ...m, settings: true }))} style={{ background: "#F1F5F9", border: "none", borderRadius: 10, padding: "7px 10px", fontSize: 14, cursor: "pointer" }}>⚙️</button>
            <ConnectButton />
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 20px" }}>

        {/* ── HOME ── */}
        {page === "home" && (
          <>
            {!isConnected && !isDemoMode ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🍯</div>
                <h1 style={{ fontSize: 32, fontWeight: 800, color: "#0F172A", marginBottom: 12 }}>Save with Paddies.<br />Earn with Agents.</h1>
                <p style={{ fontSize: 16, color: "#64748B", maxWidth: 420, margin: "0 auto 28px", lineHeight: 1.6 }}>
                  KoloYield digitizes Nigeria's Ajo savings circles with on-chain funds, automatic payouts, and Uniswap yield bonuses.
                </p>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 48 }}><ConnectButton /></div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
                  {[
                    ["🤖","Autonomous Agent","AI manages funds, sends nudges, auto-executes payouts via smart contracts"],
                    ["📈","Earn While Saving","Idle funds grow via Uniswap V4 — get back more than you put in"],
                    ["🛡️","On-chain Reputation","Your savings score stored on 0G, verified and immutable"],
                  ].map(([icon, title, desc]) => (
                    <div key={title} style={{ background: "#fff", borderRadius: 20, padding: 20, border: "1px solid #E2E8F0", textAlign: "left" }}>
                      <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
                      <h3 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 700, color: "#0F172A" }}>{title}</h3>
                      <p style={{ margin: 0, fontSize: 13, color: "#64748B", lineHeight: 1.5 }}>{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 20 }}>
                  <h1 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 800, color: "#0F172A" }}>Welcome back 👋</h1>
                  <p style={{ margin: 0, fontSize: 14, color: "#94A3B8" }}>{account ? shortA(account) : "Demo User"} · 0G-Galileo Testnet</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
                  <StatCard label="Circles" value={myCircles.length} sub={`${myCircles.filter((c) => c.status.state === 1).length} active`} />
                  <StatCard label="Goals" value={displayGoals.length} sub={`${displayGoals.filter((g) => g.isActive).length} active`} accent="#0369A1" />
                  <StatCard label="Yield Earned" value={`+$${totalYield.toFixed(2)}`} sub="From Uniswap" accent="#059669" />
                </div>
                {txHash && <div style={{ marginBottom: 16 }}><TxBanner hash={txHash} /></div>}

                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", marginBottom: 14 }}>My Circles</h2>
                {myCircles.length === 0 ? (
                  <div style={{ textAlign: "center", padding: 40, background: "#fff", borderRadius: 20, border: "1px dashed #E2E8F0", marginBottom: 20 }}>
                    <p style={{ color: "#94A3B8", margin: "0 0 16px" }}>You haven't joined any circles yet</p>
                    <Btn label="Browse Circles" onClick={() => setPage("circles")} />
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14, marginBottom: 20 }}>
                    {myCircles.map((c) => (
                      <CircleCard key={c.id} circle={c} onView={(c) => setModals((m) => ({ ...m, circleDetail: c }))} onJoin={handleJoin} isMember={joinedIds.has(c.id)} txLoading={txLoading} />
                    ))}
                  </div>
                )}

                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", marginBottom: 14 }}>My Goals</h2>
                {displayGoals.length === 0 ? (
                  <div style={{ textAlign: "center", padding: 40, background: "#fff", borderRadius: 20, border: "1px dashed #E2E8F0" }}>
                    <p style={{ color: "#94A3B8", margin: "0 0 16px" }}>No savings goals yet</p>
                    <Btn label="Create Goal" onClick={() => setPage("goals")} />
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14 }}>
                    {displayGoals.slice(0, 2).map((g) => (
                      <GoalCard key={g.id} goal={g} onContribute={handleContributeGoal} onWithdraw={handleWithdrawGoal} txLoading={txLoading} />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ── CIRCLES ── */}
        {page === "circles" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0F172A" }}>Circles</h1>
              <div style={{ display: "flex", gap: 8 }}>
                {(isConnected || isDemoMode) && <Btn label="+ Create Circle" onClick={() => setModals((m) => ({ ...m, createCircle: true }))} />}
                {!isDemoMode && <Btn label="🔄 Refresh" onClick={fetchCircles} variant="secondary" />}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
              {[["all","All"],["mine","My Circles"],["open","Open"],["active","Active"]].map(([v, l]) => (
                <button key={v} onClick={() => setFilter(v)} style={{ background: filter === v ? "#0F172A" : "#fff", color: filter === v ? "#fff" : "#64748B", border: "1px solid #E2E8F0", borderRadius: 20, padding: "7px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
                  {l}
                </button>
              ))}
            </div>
            {loadingC ? (
              <div style={{ textAlign: "center", padding: 60, color: "#94A3B8" }}>⏳ Loading circles from blockchain…</div>
            ) : filteredCircles.length === 0 ? (
              <div style={{ textAlign: "center", padding: 60, color: "#94A3B8" }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🔍</div><p>No circles found.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14 }}>
                {filteredCircles.map((c) => (
                  <CircleCard key={c.id} circle={c} onView={(c) => setModals((m) => ({ ...m, circleDetail: c }))} onJoin={handleJoin} isMember={joinedIds.has(c.id) || (account && c.creator?.toLowerCase() === account?.toLowerCase())} txLoading={txLoading} />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── GOALS ── */}
        {page === "goals" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0F172A" }}>🎯 Personal Goals</h1>
              <div style={{ display: "flex", gap: 8 }}>
                {(isConnected || isDemoMode) && <Btn label="+ New Goal" onClick={() => setModals((m) => ({ ...m, createGoal: true }))} />}
                {!isDemoMode && <Btn label="🔄 Refresh" onClick={fetchGoals} variant="secondary" />}
              </div>
            </div>
            {!isConnected && !isDemoMode ? (
              <div style={{ textAlign: "center", padding: 60 }}>
                <p style={{ color: "#94A3B8", marginBottom: 16 }}>Connect your wallet to view your savings goals</p>
                <ConnectButton />
              </div>
            ) : loadingG ? (
              <div style={{ textAlign: "center", padding: 60, color: "#94A3B8" }}>⏳ Loading goals from blockchain…</div>
            ) : displayGoals.length === 0 ? (
              <div style={{ textAlign: "center", padding: 60, background: "#fff", borderRadius: 20, border: "1px dashed #E2E8F0" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
                <h3 style={{ color: "#0F172A", margin: "0 0 8px" }}>No goals yet</h3>
                <p style={{ color: "#94A3B8", margin: "0 0 20px" }}>Set a personal savings target and automate contributions</p>
                <Btn label="+ Create First Goal" onClick={() => setModals((m) => ({ ...m, createGoal: true }))} />
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 14 }}>
                {displayGoals.map((g) => (
                  <GoalCard key={g.id} goal={g} onContribute={handleContributeGoal} onWithdraw={handleWithdrawGoal} txLoading={txLoading} />
                ))}
              </div>
            )}
            {txHash && <div style={{ marginTop: 16 }}><TxBanner hash={txHash} /></div>}
          </>
        )}

        {/* ── PROFILE ── */}
        {page === "profile" && (
          <>
            <h1 style={{ margin: "0 0 20px", fontSize: 22, fontWeight: 800, color: "#0F172A" }}>Profile</h1>
            {!isConnected && !isDemoMode ? (
              <div style={{ textAlign: "center", padding: 60 }}>
                <p style={{ color: "#94A3B8", marginBottom: 16 }}>Connect wallet to view profile</p>
                <ConnectButton />
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ background: "linear-gradient(135deg,#064E3B,#065F46)", borderRadius: 24, padding: 24, color: "#fff", display: "flex", gap: 16, alignItems: "center" }}>
                  <div style={{ width: 64, height: 64, borderRadius: 50, background: "linear-gradient(135deg,#10B981,#34D399)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, flexShrink: 0 }}>
                    {account ? account.slice(2, 4).toUpperCase() : "DM"}
                  </div>
                  <div>
                    <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>{account ? shortA(account) : "Demo User"}</h2>
                    <p style={{ margin: 0, fontSize: 13, color: "#A7F3D0" }}>0G-Galileo Testnet · {isDemoMode ? "Demo Mode" : "Connected"}</p>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <StatCard label="Circles Joined" value={myCircles.length} />
                  <StatCard label="Goals Active" value={displayGoals.filter((g) => g.isActive).length} accent="#0369A1" />
                  <StatCard label="Yield Earned" value={`$${totalYield.toFixed(2)}`} accent="#059669" />
                  <StatCard label="Network" value="0G-Galileo" />
                </div>
                <div style={{ background: "#fff", borderRadius: 20, padding: 20, border: "1px solid #E2E8F0" }}>
                  <h3 style={{ margin: "0 0 14px", fontSize: 16, fontWeight: 700, color: "#0F172A" }}>Contract Addresses</h3>
                  {[["CircleSavings", addrs.circle || "Not configured"],["PersonalSavings", addrs.personal || "Not configured"]].map(([label, addr]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: "#F8FAFC", borderRadius: 12, marginBottom: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{label}</span>
                      <span style={{ fontSize: 13, fontFamily: "monospace", color: addr.startsWith("0x") ? "#2563EB" : "#EF4444" }}>
                        {addr.startsWith("0x") ? shortA(addr) : addr}
                        {addr.startsWith("0x") && (
                          <a href={`https://chainscan-galileo.0g.ai/address/${addr}`} target="_blank" rel="noreferrer" style={{ marginLeft: 8, color: "#94A3B8" }}>↗</a>
                        )}
                      </span>
                    </div>
                  ))}
                  <button onClick={() => setModals((m) => ({ ...m, settings: true }))} style={{ marginTop: 8, background: "#F1F5F9", color: "#475569", border: "none", borderRadius: 12, padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", width: "100%" }}>
                    ⚙️ Update Addresses
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Modals ── */}
      {modals.createCircle && <CreateCircleModal onClose={() => setModals((m) => ({ ...m, createCircle: false }))} onCreate={handleCreateCircle} txLoading={txLoading} />}
      {modals.createGoal   && <CreateGoalModal   onClose={() => setModals((m) => ({ ...m, createGoal: false }))}   onCreate={handleCreateGoal}   txLoading={txLoading} />}
      {modals.settings     && <SettingsModal addrs={addrs} onChange={(a) => setAddrs(a)} onClose={() => setModals((m) => ({ ...m, settings: false }))} />}
      {modals.circleDetail && (
        <CircleDetail
          circle={modals.circleDetail}
          account={account}
          onClose={() => setModals((m) => ({ ...m, circleDetail: null }))}
          onContribute={() => handleContribute(modals.circleDetail)}
          onInitVote={() => handleInitVote(modals.circleDetail)}
          onCastVote={(choice) => handleCastVote(modals.circleDetail, choice)}
          txLoading={txLoading}
        />
      )}
    </div>
  );
}