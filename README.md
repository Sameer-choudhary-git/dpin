# 🌐 DecentraPulse

Decentralized Uptime & Security Monitoring Platform

diUptime is a Web3-powered SaaS platform that provides decentralized, transparent, and secure uptime monitoring for websites. It leverages a global network of community-run validators and offers Solana-based incentives for their participation. This eliminates central points of failure and brings trustless uptime insights to users and developers across the web.
# 🚀 Key Features

    🛰️ Decentralized infrastructure — no single server dependency

    🔐 Security-first monitoring — beyond uptime: includes DDoS pattern checks, SSL, headers, etc.

    🌍 Global validator network — real-world, regionally distributed checks

    💸 Solana-based validator rewards

    ⚙️ Custom alert triggers for developers

    🧩 API/SDK integration for dApps (coming soon)

    🗃 Public, verifiable logs (on-chain/IPFS/Arweave)

# 🛠 How It Works

    User Submission:
    Website owners register their URLs via the platform dashboard.

    Validator Participation:
    Anyone can become a validator by installing our Firefox extension (Chrome and mobile app coming soon). Validators receive randomly assigned websites to test.

    Automated Monitoring:
    Validators check:

        Response time

        Latency

        SSL certificate status

        HTTP headers

        Signs of potential DDoS attacks

    Decentralized Validation:
    Results are verified using multi-validator consensus.

    Solana Rewards:
    Validators receive SOL for every valid check, using @solana/web3.js.

    Payout Threshold:
    Validators can withdraw rewards after reaching a minimum balance.

    Transparency Layer:
    Monitoring logs can be anchored on-chain or stored in IPFS/Arweave.

# 🧠 DDoS Detection Logic

    Multi-Metric Detection:

        3× RPS spike

            30% error rate (5xx)

        Latency 2–3× over baseline

        Geo/IP skew (90% traffic from 3 IPs/ASNs)

        Low entropy in user-agent/header/TLS fingerprint

    Consensus Threshold:

        If 5 of 7 validators report anomalies in a short time window → mark as DDoS

# 🧱 Architecture

    Hub (backend): Built in TypeScript + Prisma/PostgreSQL

    Validator extension: Browser extension (JavaScript) with auto-check logic

    Smart contracts (Solana): Handles validator rewards, payout thresholds, and proof verification

    Planned: SKALE integration for gas-free validator proof submissions

# 📈 Why Use DecentraPulse?

    No central point of failure

    Community-driven monitoring from diverse geolocations

    Real-time public logs for transparency

    Lower infrastructure costs for early-stage or Web3-native products

    Incentivized participation model

# 🌍 Future Plans

    ✅ Open source codebase with contribution guidelines

    ⛓ Smart contract migration for validator proofs + rewards

    🔐 DAO-based validator slashing

    📱 Mobile app for site owners

    🔔 Custom webhook + SLA dashboard for Web3 devs

    ⚡ Multi-chain validator support (Solana, EVM, L2s)



# 👋 Contributing

We're preparing for open-source launch! If you're interested in contributing:

    Follow the repo

    Star & share the project

    Stay tuned for “good first issue” tags when we launch the repo publicly

# 📬 Contact

Made by Sameer
DMs open for collaboration, feedback, and ideas!
Email: Sameer.officialwork@gmail.com
