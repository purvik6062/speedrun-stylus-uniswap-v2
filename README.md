# 🚩 Challenge #4: 🔄 Uniswap V2-Stylus 

> ⚠️ **Important:** Please complete **Challenge #3** first if you haven't already, as it contains essential instructions related to all upcoming challenges.

🎫 Build a Uniswap V2-style liquidity pool interface with Arbitrum Stylus:

👷‍♀️ In this challenge, you'll build and deploy smart contracts that enable users to interact with a Uniswap V2-style liquidity pool. You'll work with token pairs, implement liquidity management functions, and create a frontend that allows users to perform various pool operations through an intuitive guided interface! 🚀

🌟 The final deliverable is a full-stack application featuring token pair initialization, liquidity management with clear explanations of how LP tokens work, and helpful information about pool operations. The guided step-by-step approach makes learning DeFi concepts easier while interacting with Arbitrum Stylus-based smart contracts. Deploy your contracts to a testnet, then build and upload your app to a public web server.

## Checkpoint 0: 📦 Environment Setup 📚

Before starting, ensure you have the following installed:

- [Node.js (>= v18.17)](https://nodejs.org/en/download/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install/)
- [Git](https://git-scm.com/downloads)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)

### Clone the Repository

```bash
git clone -b stylus-uniswap https://github.com/abhi152003/speedrun_stylus.git
cd speedrun_stylus
yarn install
```

## Checkpoint 1: 🚀 Start Your Dev Environment

### Step 1: Start the Nitro Dev Node

1. Navigate to the `cargo-stylus` folder:
   ```bash
   cd packages/cargo-stylus/stylus-uniswap-v2
   ```

2. Now open your Docker desktop and then return to your IDE and run the command below to spin up the nitro devnode in Docker. This will deploy the contract and generate the ABI so you can interact with the contracts written in RUST:
   ```bash
   bash run-dev-node.sh
   ```
   This command will spin up the nitro devnode in Docker. You can check it out in your Docker desktop. This will take some time to deploy the RUST contract, and then the script will automatically generate the ABI. You can view all these transactions in your terminal and Docker desktop. The Docker node is running at localhost:8547, but before running this command make sure about the below thing

## 🛠️ Debugging Tips

### Fixing Line Endings for Shell Scripts on Windows (CRLF Issue)

If you encounter errors like `Command not found`, convert line endings to LF:

```bash
sudo apt install dos2unix
dos2unix run-dev-node.sh
chmod +x run-dev-node.sh
```

Run the script again:
```bash
bash run-dev-node.sh
```

> The dev node will be accessible at `http://localhost:8547`.

### Step 2: Start the Frontend

Before running the frontend, you need to set the environment variables in the .env file.

```bash
cd packages/nextjs
cp .env.example .env
```

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Start the development server:
   ```bash
   yarn run dev
   ```

> The app will be available at [http://localhost:3000](http://localhost:3000) as shown below.

![uniswap-frontend](https://raw.githubusercontent.com/abhi152003/speedrun_stylus/refs/heads/stylus-uniswap/packages/nextjs/public/uniswap-frontend-new.png)
*The Uniswap V2 interface now features a guided step-by-step process with clear explanations*

## Checkpoint 2: 💫 Explore the Features

The Uniswap V2 interface now features a guided step-by-step approach to help you understand the liquidity provision process:

### Step 1: Initialize Pool

![pool-init](https://raw.githubusercontent.com/abhi152003/speedrun_stylus/refs/heads/stylus-uniswap/packages/nextjs/public/pool-init-new.png)
*Pool initialization interface*

- In the first step, you'll initialize a Uniswap V2 pool with a token pair.
- Required inputs:
  ```
  Token0 Address: 0x11b57fe348584f042e436c6bf7c3c3def171de49 (You can get this from the terminal where you run the dev node)
  Token1 Address: 0xa6e41ffd769491a42a6e5ce453259b93983a22ef (You can get this from the terminal where you run the dev node)
  FeeTo Address:  0x3f1Eae7D46d88F08fc2F8ed27FCb2AB183EB2d0E (Your address)
  ```
- Click "Initialize Pool" to create a new liquidity pool for the token pair.
- The system will remember your token addresses for the next steps.
- After successful initialization, you'll automatically proceed to Step 2.

### Step 2: Approve Tokens

![token-approve](https://raw.githubusercontent.com/abhi152003/speedrun_stylus/refs/heads/stylus-uniswap/packages/nextjs/public/allowance-mgmt-new.png)
*Token approval interface*

- Before adding liquidity, you need to approve both tokens for use by the Uniswap pool contract.
- You'll see your current token balances and existing allowances.
- For each token:
  1. First Mint the tokens using the "Mint 1000 Token" buttons and then click on "Refresh Token Status" button to see the minted tokens in your wallet
  2. Enter the amount you want to approve (or leave default)
  3. Click "Approve" button for each token
- The interface will track your approval progress and enable you to move to Step 3 once approvals are complete.

### Step 3: Add Liquidity (Mint)

![liquidity-add](https://raw.githubusercontent.com/abhi152003/speedrun_stylus/refs/heads/stylus-uniswap/packages/nextjs/public/liquidity-manage-new.png)
*Adding liquidity interface*

- Now you can add liquidity to the pool and receive LP tokens.
- The interface displays:
  1. Your current token balances and allowances
  2. Pool information with token addresses
  3. A detailed explanation of how liquidity provision works
- Enter your recipient address for LP tokens (or leave default)
- Click "Add Liquidity" to provide liquidity to the pool
- After successful addition:
  1. You'll receive LP tokens representing your share of the pool
  2. The system displays your LP token balance (with both decimal and wei values)
  3. A detailed explanation of what LP tokens represent and what happens next

**Understanding LP Tokens:**

Your LP token balance may appear small (like 0.000000000000001) because:
- LP tokens use 18 decimals regardless of the token pair's decimals
- This small number correctly represents your ownership share of the pool
- As users trade through the pool, you'll earn fees proportional to your share
- You can redeem LP tokens anytime to withdraw your tokens plus earned fees

### Additional Information

The guided interface helps you understand each step of the Uniswap V2 process. Some important concepts:

1. **Automatic Token Deposits**: When adding liquidity, Uniswap uses the full balance of both approved tokens in your wallet, maintaining the proper ratio.

2. **LP Tokens and Ownership**: The LP tokens represent your share of the pool, and they earn you a share of the 0.3% fee from each swap.

3. **Token Units**: All displayed values are shown in their natural units with appropriate decimals, and raw wei values are provided for reference.

4. **Error Handling**: The interface provides detailed error messages and troubleshooting suggestions for common issues.

### Common Issues:
1. Connection Error: If you see "Failed to initialize contract":
   - Ensure the Nitro dev node is running at http://localhost:8547
   - Check if the contract address matches your deployed contract

2. Transaction Errors:
   - Ensure you have sufficient balance for gas fees
   - Check that input addresses are valid Ethereum addresses
   - Verify that token amounts are properly formatted
   - For liquidity provision, make sure both tokens are approved first

## 📊 Performance Tracking

Before submitting your challenge, you can run the performance tracking script to analyze your application:

1. **Navigate to the performance tracking directory:**

   ```bash
   cd packages/nextjs/services/web3
   ```

2. **Update the contract address:**
   Open the `performanceTracking.js` file and paste the contract address that was deployed on your local node. (you can get contract address same as we have mentioned above in Docker_Img)

3. **Run the performance tracking script:**
   ```bash
   node performanceTracking.js
   ```

This will provide insights about the savings when you cache your deployed contract. The output will show performance analysis similar to the image below:

![image](https://raw.githubusercontent.com/purvik6062/speedrun_stylus/refs/heads/counter/assets/performance.png)

> 📝 **Important**: Make sure to note down the **Latency Improvement** and **Gas Savings** values from the output, as you'll need to include these metrics when submitting your challenge.

---


## Checkpoint 3: 🛠 Modify and Deploy Contracts

You can modify the contract logic by editing files in the `packages/cargo-stylus/src` folder. After making changes, redeploy by running:

```bash
bash run-dev-node.sh
```

### Common Issues:
1. Connection Error: If you see "Failed to initialize contract":
   - Ensure the Nitro dev node is running at http://localhost:8547
   - Check if the contract address matches your deployed contract

2. Transaction Errors:
   - Ensure you have sufficient balance for gas fees
   - Check that input addresses are valid Ethereum addresses
   - Verify that token amounts are properly formatted

## Checkpoint 4: 🚢 Ship your frontend! 🚁

To deploy your app to Vercel:

```bash
vercel
```

Follow Vercel's instructions to get a public URL.

For production deployment:
```bash
vercel --prod
```

## Checkpoint 5: 📜 Contract Verification

You can verify your deployed smart contract using:

```bash
cargo stylus verify -e http://127.0.0.1:8547 --deployment-tx "$deployment_tx"
```

Replace `$deployment_tx` with your deployment transaction hash.

## 🏁 Next Steps

1. Add more token pairs to your liquidity pool
2. Implement additional features like:
   - Flash swaps
   - Price oracles
   - Fee management
3. Enhance the frontend with:
   - Price charts and historical data
   - LP token analytics dashboard
   - Impermanent loss calculator
   - Yield farming integrations
4. Extend the guided interface with:
   - Token swap functionality
   - Remove liquidity flow
   - Educational tooltips explaining DeFi concepts

Explore more challenges or contribute to this project!

---

## 🚀 Deploying to Arbitrum Sepolia

If you want to deploy your Multisig Wallet contract to the Arbitrum Sepolia testnet, follow these steps:

1. **Export your private key in the terminal**
   ```bash
   export PRIVATE_KEY=your_private_key_of_your_ethereum_wallet
   ```

2. **Run the Sepolia Deployment Script**
   ```bash
   cd packages/cargo-stylus/multisig_wallet
   bash run-sepolia-deploy.sh
   ```
   This will deploy your contract to Arbitrum Sepolia and output the contract address and transaction hash.

3. **Configure the Frontend for Sepolia**
   - Go to the `packages/nextjs` directory:
     ```bash
     cd packages/nextjs
     cp .env.example .env
     ```
   - Open the `.env` file and set the following variables:
     ```env
     NEXT_PUBLIC_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
     NEXT_PUBLIC_PRIVATE_KEY=your_private_key_of_your_ethereum_wallet
     ```
     Replace `your_private_key_of_your_ethereum_wallet` with your actual Ethereum wallet private key (never share this key publicly).

4. **Start the Frontend**
   ```bash
   yarn run dev
   ```
   Your frontend will now connect to the Arbitrum Sepolia network and interact with your deployed contract.


---

## ⚡️ Cache Your Deployed Contract for Faster, Cheaper Access

> 📖 Contracts deployed on Arbitrum Sepolia can use this command for gas benefits, time savings, and cheaper contract function calls. Our backend will benchmark and place bids on your behalf to ensure your contract is not evicted from the CacheManager contract, fully automating this process for you.

Before caching your contract, make sure you have installed the Smart Cache CLI globally:

```bash
npm install -g smart-cache-cli
```

After deploying your contract to Arbitrum Sepolia, you can cache your contract address using the `smart-cache` CLI. Caching your contract enables:
- 🚀 **Faster contract function calls** by reducing lookup time
- 💸 **Cheaper interactions** by optimizing access to contract data
- 🌐 **Seamless access** to your contract from any environment or system

> 💡 **Info:** Both the `<address>` and `--deployed-by` flags are **mandatory** when adding a contract to the cache.

### 📝 Simple Example

```bash
smart-cache add <CONTRACT_ADDRESS> --deployed-by <YOUR_WALLET_ADDRESS_WITH_WHOM_YOU_HAVE_DEPLOYED_CONTRACT>
```

### 🛠️ Advanced Example

```bash
smart-cache add 0xYourContractAddress \
  --deployed-by 0xYourWalletAddress \
  --network arbitrum-sepolia \
  --tx-hash 0xYourDeploymentTxHash \
  --name "YourContractName" \
  --version "1.0.0"
```

- `<CONTRACT_ADDRESS>`: The address of your deployed contract (**required**)
- `--deployed-by`: The wallet address you used to deploy the contract (**required**)
- `--network arbitrum-sepolia`: By default, contracts are cached for the Arbitrum Sepolia network for optimal benchmarking and compatibility
- `--tx-hash`, `--name`, `--version`: Optional metadata for better organization

> ⚠️ **Warning:** If you omit the required fields, the command will not work as expected.

> 💡 For more options, run `smart-cache add --help`.

For more in-depth details and the latest updates, visit the [smart-cache-cli package on npmjs.com](https://www.npmjs.com/package/smart-cache-cli).

---

> 🏃 Head to your next challenge [here](https://speedrunstylus.com/challenge/zkp-age).