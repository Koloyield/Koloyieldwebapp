# 🍯 KoloYield — Autonomous Ajo on Base

> **Save with Paddies. Earn with Agents.**

KoloYield is a decentralized savings dApp built on **Base** that digitizes Nigeria's traditional *Ajo* (rotating savings circle) model. Members pool funds in smart-contract-governed circles, earn **Uniswap V4 yield** on idle capital, and receive automatic payouts — all without a trusted intermediary.

[![Built on Base](https://img.shields.io/badge/Built%20on-Base-0052FF?style=flat-square&logo=coinbase)](https://base.org)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.x-363636?style=flat-square&logo=solidity)](https://soliditylang.org)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Smart Contracts](#smart-contracts)
- [Frontend](#frontend)
- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [Usage](#usage)
- [Contract ABIs](#contract-abis)
- [Supported Tokens](#supported-tokens)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Traditional Ajo circles rely on trust between participants and manual cash collection. KoloYield replaces that trust layer with immutable smart contracts:

- **Contributions** are locked on-chain per round
- **Payouts** are executed automatically when all members contribute or deadlines pass
- **Idle funds** are deployed to Uniswap V4 liquidity pools to generate yield for the group
- **Reputation** (Sabi Score) is recorded on-chain — late payments and forfeitures affect your standing
- **Personal savings goals** run alongside circles, with optional yield via ERC-4626 vaults

---

## Features

### 🔄 Savings Circles (Ajo)
| Feature | Description |
|---|---|
| Create Circle | Set contribution amount, frequency, max members, visibility, and token |
| Join Circle | Lock collateral and take a rotation position |
| Contribute | Pay into the current round before the deadline |
| Voting | Members vote to start or withdraw; threshold-based execution |
| Forfeit | Late members can be forfeited after grace period expires |
| Collateral | Returned automatically on circle completion |

### 🎯 Personal Savings Goals
| Feature | Description |
|---|---|
| Create Goal | Set a target, contribution schedule, and optional deadline |
| Yield Toggle | Enable ERC-4626 vault yield on locked savings |
| Contribute | Add funds on any schedule |
| Withdraw | Exit early (penalty may apply pre-deadline) |
| Complete | Claim goal + yield when target is reached |

### 🌐 dApp
- MetaMask wallet connection with automatic **Base** chain switching
- ERC-20 token approval flow (`MaxUint256` approve before all write calls)
- Live transaction hashes with **BaseScan** deeplinks
- Demo Mode — fully interactive with mock data when no contracts are configured
- ⚙️ Runtime contract address configuration (no rebuild needed)

---

## Architecture

```
KoloYield
├── contracts/
│   ├── CircleSavings.sol       # Rotating savings circles (UUPS upgradeable)
│   └── PersonalSavings.sol     # Individual savings goals with vault yield
│
├── src/
│   └── KoloYield.jsx           # React single-file dApp
│
└── abis/
    ├── CircleSavings.json
    └── PersonalSavings.json
```

### Contract Interaction Flow

```
User → Wallet (MetaMask)
         │
         ▼
   ERC20.approve(spender, MaxUint256)
         │
         ├──▶ CircleSavings.createCircle(params)
         ├──▶ CircleSavings.joinCircle(circleId)
         ├──▶ CircleSavings.contribute(circleId)
         ├──▶ CircleSavings.castVote(circleId, choice)
         │
         └──▶ PersonalSavings.createPersonalGoal(params)
              PersonalSavings.contributeToGoal(goalId, amount)
              PersonalSavings.withdrawFromGoal(goalId, amount)
```

---

## Smart Contracts

Both contracts are **UUPS upgradeable** and deployed on **Base Mainnet**.

### `CircleSavings.sol`

Manages the full lifecycle of a savings circle: creation → member join → active rounds → payouts → completion.

**Key state:**
- `circleConfigs` — immutable parameters set at creation
- `circleStatus` — mutable round state (currentRound, totalPot, etc.)
- `circleMembers` — per-member position, contributions, collateral
- `circleVotes` — voting session state

**Key functions:**

```solidity
function createCircle(CreateCircleParams calldata params) external returns (uint256 circleId)
function joinCircle(uint256 _circleId) external
function contribute(uint256 _circleId) external
function initiateVoting(uint256 _circleId) external
function castVote(uint256 _circleId, VoteChoice _choice) external
function executeVote(uint256 _circleId) external
function forfeitMember(uint256 _circleId, address[] calldata _membersToForfeit) external
function WithdrawCollateral(uint256 _circleId) external
function getCircleDetails(uint256 _circleId) external view returns (CircleConfig, CircleStatus, uint256 deadline, bool canStart)
```

**Enums:**

```solidity
enum Frequency   { Daily, Weekly, BiWeekly, Monthly }
enum Visibility  { Public, Private }
enum CircleState { Open, Active, Completed, Cancelled }
enum VoteChoice  { None, Start, Withdraw }
```

**Fee model:**
| Fee | Description |
|---|---|
| `PLATFORM_FEE_BPS` | Basis points taken on each payout |
| `LATE_FEE_BPS` | Charged when contributing after deadline but within grace period |
| `FIXED_FEE_AMOUNT` | Flat fee for small contributions below `FIXED_FEE_THRESHOLD` |
| `PUBLIC_CIRCLE_DEAD_FEE` / `PRIVATE_CIRCLE_DEAD_FEE` | Penalty deducted from creator collateral if circle never starts |
| `VISIBILITY_UPDATE_FEE` | One-time fee to change a circle from Private → Public |

---

### `PersonalSavings.sol`

Manages individual goal-based savings with optional vault yield via ERC-4626.

**Key functions:**

```solidity
function createPersonalGoal(CreateGoalParams calldata params) external returns (uint256 goalId)
function contributeToGoal(uint256 _goalId, uint256 _amount) external
function withdrawFromGoal(uint256 _goalId, uint256 _amount) external
function completeGoal(uint256 _goalId) external
function getUserGoals(address _user) external view returns (uint256[] memory)
```

**Goal params:**

```solidity
struct CreateGoalParams {
    string  name;
    uint256 targetAmount;
    uint256 contributionAmount;
    Frequency frequency;
    uint256 deadline;
    bool    enableYield;
    address token;
    uint256 yieldAPY;        // hints for vault selection
}
```

**Fee model:**
| Fee | Description |
|---|---|
| `COMPLETION_FEE_BPS` | Taken on final withdrawal/completion |
| `PLATFORM_YIELD_SHARE_BPS` | Platform's share of vault yield on each distribution |

---

## Frontend

Built as a single React component (`KoloYield.jsx`) with zero build dependencies — drop it into any React project.

**Stack:**
- React 18 (hooks only, no class components)
- ethers.js v5 (loaded from cdnjs at runtime)
- Tailwind-free — all styles are inline for portability

**Pages:**
| Page | Description |
|---|---|
| 🏠 Home | Dashboard — circle summary, goal summary, yield stats |
| ⭕ Circles | Browse, filter, create and join savings circles |
| 🎯 Goals | Personal savings goals — create, contribute, withdraw |
| 👤 Profile | Wallet info, contract addresses, on-chain stats |

---

## Getting Started

### Prerequisites

- Node.js 18+
- MetaMask (or any EIP-1193 wallet)
- Base Mainnet or Base Sepolia RPC access

### Installation

```bash
git clone https://github.com/your-org/koloyield.git
cd koloyield
npm install
```

### Run Dev Server

```bash
npm run dev
```

The app runs in **Demo Mode** until you configure contract addresses (see below).

---

## Environment Setup

### Option A — Hardcode addresses (recommended for production)

Edit the top of `src/KoloYield.jsx`:

```js
const DEFAULT_CIRCLE_ADDR   = "0xYourCircleSavingsAddress";
const DEFAULT_PERSONAL_ADDR = "0xYourPersonalSavingsAddress";
```

### Option B — Runtime configuration (no rebuild)

Click the **⚙️** icon in the navbar → paste addresses → Save. Settings persist for the session.

### Option C — Environment variables (if using Vite / CRA)

```env
VITE_CIRCLE_ADDR=0xYourCircleSavingsAddress
VITE_PERSONAL_ADDR=0xYourPersonalSavingsAddress
```

Then replace the constants at the top of the file:
```js
const DEFAULT_CIRCLE_ADDR   = import.meta.env.VITE_CIRCLE_ADDR   || "";
const DEFAULT_PERSONAL_ADDR = import.meta.env.VITE_PERSONAL_ADDR || "";
```

---

## Usage

### Creating a Circle

1. Connect wallet (MetaMask → Base)
2. Go to **Circles** → **+ Create Circle**
3. Fill in name, description, contribution amount, max members
4. Choose frequency and token (USDC or USDT)
5. Set visibility (Public or Private)
6. Confirm → approve token spend → sign `createCircle` tx

### Joining a Circle

1. Browse open circles on the **Circles** page
2. Click **Join Circle** on any Open circle
3. Approve token spend for collateral + first contribution
4. Sign `joinCircle` tx

### Contributing

1. Open a circle you're a member of
2. Click **💰 Contribute** in the detail sheet
3. Token spend is pre-approved; sign `contribute` tx

### Creating a Personal Goal

1. Go to **Goals** → **+ New Goal**
2. Set name, target amount, contribution size, frequency, deadline
3. Optionally enable Uniswap yield
4. Approve token → sign `createPersonalGoal` tx
5. Contribute anytime with the **➕ Add** button on your goal card

---

## Contract ABIs

Full ABIs are in `/abis/`. The frontend embeds human-readable ABIs (ethers.js fragment syntax) directly:

```js
// CircleSavings (excerpt)
"function createCircle(tuple(string title, string description, uint256 contributionAmount, uint8 frequency, uint256 maxMembers, uint8 visibility, address token) params) returns (uint256)"
"function contribute(uint256 _circleId)"
"function getCircleDetails(uint256 _circleId) view returns (...)"

// PersonalSavings (excerpt)
"function createPersonalGoal(tuple(string name, uint256 targetAmount, uint256 contributionAmount, uint8 frequency, uint256 deadline, bool enableYield, address token, uint256 yieldAPY) params) returns (uint256)"
"function contributeToGoal(uint256 _goalId, uint256 _amount)"
```

---

## Supported Tokens

| Token | Network | Address |
|---|---|---|
| USDC | Base Mainnet | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |
| USDT | Base Mainnet | `0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2` |

Additional tokens can be added by the contract owner via `addSupportedToken(address)`.

---

## Events Reference

### CircleSavings

| Event | Emitted When |
|---|---|
| `CircleCreated` | New circle deployed |
| `CircleJoined` | Member joins a circle |
| `CircleStarted` | Voting passes and circle activates |
| `ContributionMade` | Member pays into current round |
| `LateContributionMade` | Member pays after deadline (within grace period) |
| `PayoutDistributed` | Round payout sent to recipient |
| `MemberForfeited` | Member removed for non-payment |
| `VotingInitiated` | Vote session opened |
| `VoteCast` | Member casts start/withdraw vote |
| `VoteExecuted` | Vote threshold reached and action taken |
| `CollateralReturned` | Collateral sent back on completion |

### PersonalSavings

| Event | Emitted When |
|---|---|
| `PersonalGoalCreated` | New goal created |
| `GoalContribution` | Funds added to goal |
| `GoalWithdrawn` | Early withdrawal (with penalty) |
| `YieldDistributed` | Vault yield claimed and split |

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

```bash
# Fork → clone → branch
git checkout -b feat/your-feature

# Make changes, then
git commit -m "feat: your feature description"
git push origin feat/your-feature
# Open a PR
```

Please ensure:
- All smart contract changes include NatSpec comments
- Frontend changes don't introduce external dependencies
- New features work in both Demo Mode and live mode

---

## License

MIT © 2025 KoloYield Contributors
