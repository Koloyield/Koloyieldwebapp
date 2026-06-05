export const DEFAULT_CIRCLE_ADDR = "0x2eb02c8b9733b240c6fa73ddf1b25f373199c56c"; // e.g. "0xAbC123..."
export const DEFAULT_PERSONAL_ADDR =
  "0x17282d6ad90e84e24ee68fe68fd01014d9b8d7b3"; // e.g. "0xDef456..."
export const OG_CHAIN_ID = 16602;
export const OG_CHAIN_PARAMS = {
  chainId: "0x16602",
  chainName: "0G-Galileo-Testnet",
  nativeCurrency: { name: "OG", symbol: "OG", decimals: 18 },
  rpcUrls: ["https://evmrpc-testnet.0g.ai"],
  blockExplorerUrls: ["https://chainscan-galileo.0g.ai"],
};

export const TOKENS = {
  USDC: {
    address: "0xad91A6CF90144244Ca9FBA4550B1372B04De8325",
    decimals: 6,
    symbol: "USDC",
  },
  USDT: {
    address: "0xa356D12658B8D209F2e3FE5FF14b28c5fc5445e4",
    decimals: 6,
    symbol: "USDT",
  },
};

// ─── Human-readable ABIs ──────────────────────────────────────────
export const CIRCLE_ABI = [
  "function createCircle(tuple(string title, string description, uint256 contributionAmount, uint8 frequency, uint256 maxMembers, uint8 visibility, address token) params) returns (uint256)",
  "function joinCircle(uint256 _circleId)",
  "function contribute(uint256 _circleId)",
  "function getCircleDetails(uint256 _circleId) view returns (tuple(uint256 circleId, string title, string description, address creator, uint256 contributionAmount, uint8 frequency, uint256 maxMembers, uint8 visibility, uint256 createdAt) config, tuple(uint8 state, uint256 currentMembers, uint256 currentRound, uint256 totalRounds, uint256 startedAt, uint256 totalPot, uint256 contributionsThisRound) status, uint256 currentDeadline, bool canStart)",
  "function circleCounter() view returns (uint256)",
  "function getCircleMembers(uint256 _circleId) view returns (address[])",
  "function circleToken(uint256) view returns (address)",
  "function getMemberInfo(uint256 _circleId, address _member) view returns (tuple(uint256 position, uint256 totalContributed, bool hasReceivedPayout, bool isActive, uint256 collateralLocked, uint256 joinedAt) memberInfo, bool hasContributedThisRound, uint256 nextDeadline)",
  "function castVote(uint256 _circleId, uint8 _choice)",
  "function initiateVoting(uint256 _circleId)",
  "function getVoteInfo(uint256 _circleId) view returns (uint256 votingEndTime, uint256 startVoteCount, uint256 withdrawVoteCount, bool votingActive, bool voteExecuted, uint8 userVote)",
  "function WithdrawCollateral(uint256 _circleId)",
];

export const PERSONAL_ABI = [
  "function createPersonalGoal(tuple(string name, uint256 targetAmount, uint256 contributionAmount, uint8 frequency, uint256 deadline, bool enableYield, address token, uint256 yieldAPY) params) returns (uint256)",
  "function contributeToGoal(uint256 _goalId, uint256 _amount)",
  "function withdrawFromGoal(uint256 _goalId, uint256 _amount)",
  "function completeGoal(uint256 _goalId)",
  "function getUserGoals(address _user) view returns (uint256[])",
  "function personalGoals(uint256) view returns (address owner, string name, uint256 targetAmount, uint256 currentAmount, uint256 contributionAmount, uint8 frequency, uint256 deadline, uint256 createdAt, bool isActive, uint256 lastContributionAt, bool isYieldEnabled, uint256 contributionCount)",
  "function goalToken(uint256) view returns (address)",
  "function goalCounter() view returns (uint256)",
];

export const ERC20_ABI = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
];
