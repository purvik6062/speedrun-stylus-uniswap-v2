"use client";

import React, { useEffect, useState } from "react";
import { IUniswapV2 } from "./IUniswapV2";
import { ethers } from "ethers";

interface FormState {
  token0: string;
  token1: string;
  feeTo: string;
  to: string;
  amount0Out: string;
  amount1Out: string;
  amount: string;
  spender: string;
  from: string;
  address: string;
  owner: string;
}

interface FormsState {
  initialize: Pick<FormState, "token0" | "token1" | "feeTo">;
  mint: Pick<FormState, "to">;
  burn: Pick<FormState, "to">;
  swap: Pick<FormState, "amount0Out" | "amount1Out" | "to">;
  transfer: Pick<FormState, "to" | "amount">;
  approve: Pick<FormState, "spender" | "amount">;
  transferFrom: Pick<FormState, "from" | "to" | "amount">;
  balanceCheck: Pick<FormState, "address">;
  allowanceCheck: Pick<FormState, "owner" | "spender">;
}

interface TransactionArgs {
  initialize: [string, string, string, { gasLimit?: number }?] | any;
  mint: [string, { gasLimit?: number }?];
  burn: [string, { gasLimit?: number }?];
  swap: [Number, Number, string, any[], { gasLimit?: number }?] | any;
  transfer: [string, Number, { gasLimit?: number }?] | any;
  approve: [string, Number, { gasLimit?: number }?] | any;
  transferFrom: [string, string, Number, { gasLimit?: number }?] | any;
}

// Tab type for better organization
const TABS = {
  INFO: "Contract Info",
  LIQUIDITY: "Liquidity Operations",
  TRANSFERS: "Token Transfers",
  ALLOWANCES: "Allowances",
} as const;

export default function UniswapInterface() {
  // Contract connection states
  const [provider, setProvider] = useState<any>(null);
  const [contract, setContract] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<any>(TABS.INFO);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Contract info states
  const [contractInfo, setContractInfo] = useState({
    name: "",
    symbol: "",
    decimals: "",
    totalSupply: "",
    address: "",
  });

  // Form states
  const [forms, setForms] = useState({
    initialize: { token0: "", token1: "", feeTo: "" },
    mint: { to: "" },
    burn: { to: "" },
    swap: { amount0Out: "", amount1Out: "", to: "" },
    transfer: { to: "", amount: "" },
    approve: { spender: "", amount: "" },
    transferFrom: { from: "", to: "", amount: "" },
    balanceCheck: { address: "" },
    allowanceCheck: { owner: "", spender: "" },
  });

  // Results states
  const [results, setResults] = useState({
    balance: "",
    allowance: "",
  });

  useEffect(() => {
    initializeContract();
  }, []);

  const initializeContract = async () => {
    try {
      const provider = new ethers.JsonRpcProvider("http://localhost:8547/");
      const privateKey = "0xb6b15c8cb491557369f3c7d2c287b053eb229daa9c22138887752191c9520659";
      const signer = new ethers.Wallet(privateKey, provider);
      const contractAddress = "0xa6e41ffd769491a42a6e5ce453259b93983a22ef";
      const contract = new ethers.Contract(contractAddress, IUniswapV2, signer);
      console.log("contract", contract);
      setProvider(provider);
      setContract(contract);
      await fetchContractInfo(contract);
    } catch (err) {
      setError("Failed to initialize contract");
      console.error(err);
    }
  };

  const fetchContractInfo = async (contract: any) => {
    try {
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals(),
        contract.totalSupply(),
      ]);

      setContractInfo({
        name,
        symbol,
        decimals: decimals.toString(),
        totalSupply: ethers.formatEther(totalSupply),
        address: await contract.target,
      });
    } catch (err) {
      setError("Error fetching contract info");
      console.error(err);
    }
  };

  const updateForm = (formName: keyof FormsState, field: string, value: string) => {
    setForms(prev => ({
      ...prev,
      [formName]: {
        ...prev[formName],
        [field]: value,
      },
    }));
  };

  const handleTransaction = async <T extends keyof TransactionArgs>(operation: T, ...args: TransactionArgs[T]) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      let tx;
      const options = args[args.length - 1] as { gasLimit?: number } | undefined;
      const txOptions = options && options.gasLimit ? { gasLimit: options.gasLimit } : {};

      switch (operation) {
        case "initialize":
          tx = await contract.initialize(...args.slice(0, -1), txOptions);
          break;
        case "mint":
          tx = await contract.mint(...args.slice(0, -1), txOptions);
          break;
        case "burn":
          tx = await contract.burn(...args.slice(0, -1), txOptions);
          break;
        case "swap":
          tx = await contract.swap(...args.slice(0, -1), txOptions);
          break;
        case "transfer":
          tx = await contract.transfer(...args.slice(0, -1), txOptions);
          break;
        case "approve":
          tx = await contract.approve(...args.slice(0, -1), txOptions);
          break;
        case "transferFrom":
          tx = await contract.transferFrom(...args.slice(0, -1), txOptions);
          break;
        default:
          throw new Error(`Unsupported operation: ${operation}`);
      }

      await tx.wait();
      setSuccess(`${operation} executed successfully!`);
      await fetchContractInfo(contract);
    } catch (err) {
      setError(`${operation} failed: ${err}`);
      console.error(err);
    }
    setLoading(false);
  };

  const checkBalance = async () => {
    try {
      const balance = await contract.balanceOf(forms.balanceCheck.address);
      setResults(prev => ({ ...prev, balance: ethers.formatEther(balance) }));
    } catch (err) {
      setError("Failed to check balance");
    }
  };

  const checkAllowance = async () => {
    try {
      const allowance = await contract.allowance(forms.allowanceCheck.owner, forms.allowanceCheck.spender);
      setResults(prev => ({ ...prev, allowance: ethers.formatEther(allowance) }));
    } catch (err) {
      setError("Failed to check allowance");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Navigation Tabs */}
      <div className="flex mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {Object.values(TABS).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
              activeTab === tab
                ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Contract Info Section */}
      {activeTab === TABS.INFO && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4 dark:text-white">Contract Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
              <p className="font-semibold dark:text-white">Name:</p>
              <p className="text-gray-600 dark:text-gray-300">{contractInfo.name}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
              <p className="font-semibold dark:text-white">Symbol:</p>
              <p className="text-gray-600 dark:text-gray-300">{contractInfo.symbol}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
              <p className="font-semibold dark:text-white">Decimals:</p>
              <p className="text-gray-600 dark:text-gray-300">{contractInfo.decimals}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
              <p className="font-semibold dark:text-white">Total Supply:</p>
              <p className="text-gray-600 dark:text-gray-300">{contractInfo.totalSupply}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded col-span-2">
              <p className="font-semibold dark:text-white">Contract Address:</p>
              <p className="text-gray-600 dark:text-gray-300 break-all">
                {contractInfo ? contractInfo.address : "Contract not initialized"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Liquidity Operations Section */}
      {activeTab === TABS.LIQUIDITY && (
        <div className="space-y-6">
          {/* Initialize Form */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-4 dark:text-white">Initialize Pool</h3>
            <div className="space-y-4">
              <input
                className="w-full p-2 border dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Token0 Address"
                value={forms.initialize.token0}
                onChange={e => updateForm("initialize", "token0", e.target.value)}
              />
              <input
                className="w-full p-2 border dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Token1 Address"
                value={forms.initialize.token1}
                onChange={e => updateForm("initialize", "token1", e.target.value)}
              />
              <input
                className="w-full p-2 border dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Fee To Address"
                value={forms.initialize.feeTo}
                onChange={e => updateForm("initialize", "feeTo", e.target.value)}
              />
              <button
                onClick={() =>
                  handleTransaction(
                    "initialize",
                    forms.initialize.token0,
                    forms.initialize.token1,
                    forms.initialize.feeTo,
                    { gasLimit: 10000000 },
                  )
                }
                className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white p-2 rounded transition-colors disabled:opacity-50"
                disabled={loading}
              >
                Initialize Pool
              </button>
            </div>
          </div>

          {/* Mint Form */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-4 dark:text-white">Mint Liquidity</h3>
            <div className="space-y-4">
              <input
                className="w-full p-2 border dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="To Address"
                value={forms.mint.to}
                onChange={e => updateForm("mint", "to", e.target.value)}
              />
              <button
                onClick={() => handleTransaction("mint", forms.mint.to, { gasLimit: 10000000 })}
                className="w-full bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white p-2 rounded transition-colors disabled:opacity-50"
                disabled={loading}
              >
                Mint
              </button>
            </div>
          </div>

          {/* Burn Form */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-4 dark:text-white">Burn Liquidity</h3>
            <div className="space-y-4">
              <input
                className="w-full p-2 border dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="To Address"
                value={forms.burn.to}
                onChange={e => updateForm("burn", "to", e.target.value)}
              />
              <button
                onClick={() => handleTransaction("burn", forms.burn.to, { gasLimit: 10000000 })}
                className="w-full bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white p-2 rounded transition-colors disabled:opacity-50"
                disabled={loading}
              >
                Burn
              </button>
            </div>
          </div>

          {/* Swap Form */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-4 dark:text-white">Swap Tokens</h3>
            <div className="space-y-4">
              <input
                className="w-full p-2 border dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Amount0 Out"
                value={forms.swap.amount0Out}
                onChange={e => updateForm("swap", "amount0Out", e.target.value)}
              />
              <input
                className="w-full p-2 border dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Amount1 Out"
                value={forms.swap.amount1Out}
                onChange={e => updateForm("swap", "amount1Out", e.target.value)}
              />
              <input
                className="w-full p-2 border dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="To Address"
                value={forms.swap.to}
                onChange={e => updateForm("swap", "to", e.target.value)}
              />
              <button
                onClick={() =>
                  handleTransaction(
                    "swap",
                    ethers.parseEther(forms.swap.amount0Out || "0"),
                    ethers.parseEther(forms.swap.amount1Out || "0"),
                    forms.swap.to,
                    [],
                    { gasLimit: 10000000 },
                  )
                }
                className="w-full bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white p-2 rounded transition-colors disabled:opacity-50"
                disabled={loading}
              >
                Swap
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Token Transfers Section */}
      {activeTab === TABS.TRANSFERS && (
        <div className="space-y-6">
          {/* Transfer Form */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-4 dark:text-white">Transfer Tokens</h3>
            <div className="space-y-4">
              <input
                className="w-full p-2 border dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="To Address"
                value={forms.transfer.to}
                onChange={e => updateForm("transfer", "to", e.target.value)}
              />
              <input
                className="w-full p-2 border dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Amount"
                value={forms.transfer.amount}
                onChange={e => updateForm("transfer", "amount", e.target.value)}
              />
              <button
                onClick={() =>
                  handleTransaction("transfer", forms.transfer.to, ethers.parseEther(forms.transfer.amount || "0"), {
                    gasLimit: 10000000,
                  })
                }
                className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white p-2 rounded transition-colors disabled:opacity-50"
                disabled={loading}
              >
                Transfer
              </button>
            </div>
          </div>

          {/* TransferFrom Form */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-4 dark:text-white">Transfer From</h3>
            <div className="space-y-4">
              <input
                className="w-full p-2 border dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="From Address"
                value={forms.transferFrom.from}
                onChange={e => updateForm("transferFrom", "from", e.target.value)}
              />
              <input
                className="w-full p-2 border dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="To Address"
                value={forms.transferFrom.to}
                onChange={e => updateForm("transferFrom", "to", e.target.value)}
              />
              <input
                className="w-full p-2 border dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Amount"
                value={forms.transferFrom.amount}
                onChange={e => updateForm("transferFrom", "amount", e.target.value)}
              />
              <button
                onClick={() =>
                  handleTransaction(
                    "transferFrom",
                    forms.transferFrom.from,
                    forms.transferFrom.to,
                    ethers.parseEther(forms.transferFrom.amount || "0"),
                    { gasLimit: 10000000 },
                  )
                }
                className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white p-2 rounded transition-colors disabled:opacity-50"
                disabled={loading}
              >
                Transfer From
              </button>
            </div>
          </div>

          {/* Check Balance Form */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-4 dark:text-white">Check Balance</h3>
            <div className="space-y-4">
              <input
                className="w-full p-2 border dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Address"
                value={forms.balanceCheck.address}
                onChange={e => updateForm("balanceCheck", "address", e.target.value)}
              />
              <button
                onClick={checkBalance}
                className="w-full bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white p-2 rounded transition-colors disabled:opacity-50"
                disabled={loading}
              >
                Check Balance
              </button>
              {results.balance && (
                <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <p className="font-semibold dark:text-white">Balance:</p>
                  <p className="text-gray-600 dark:text-gray-300">{results.balance}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Allowances Section */}
      {activeTab === TABS.ALLOWANCES && (
        <div className="space-y-6">
          {/* Approve Form */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-4 dark:text-white">Approve Spender</h3>
            <div className="space-y-4">
              <input
                className="w-full p-2 border dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Spender Address"
                value={forms.approve.spender}
                onChange={e => updateForm("approve", "spender", e.target.value)}
              />
              <input
                className="w-full p-2 border dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Amount"
                value={forms.approve.amount}
                onChange={e => updateForm("approve", "amount", e.target.value)}
              />
              <button
                onClick={() =>
                  handleTransaction("approve", forms.approve.spender, ethers.parseEther(forms.approve.amount || "0"), {
                    gasLimit: 10000000,
                  })
                }
                className="w-full bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white p-2 rounded transition-colors disabled:opacity-50"
                disabled={loading}
              >
                Approve
              </button>
            </div>
          </div>

          {/* Check Allowance Form */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-4 dark:text-white">Check Allowance</h3>
            <div className="space-y-4">
              <input
                className="w-full p-2 border dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Owner Address"
                value={forms.allowanceCheck.owner}
                onChange={e => updateForm("allowanceCheck", "owner", e.target.value)}
              />
              <input
                className="w-full p-2 border dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Spender Address"
                value={forms.allowanceCheck.spender}
                onChange={e => updateForm("allowanceCheck", "spender", e.target.value)}
              />
              <button
                onClick={checkAllowance}
                className="w-full bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white p-2 rounded transition-colors disabled:opacity-50"
                disabled={loading}
              >
                Check Allowance
              </button>
              {results.allowance && (
                <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <p className="font-semibold dark:text-white">Allowance:</p>
                  <p className="text-gray-600 dark:text-gray-300">{results.allowance}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-lg font-semibold dark:text-white">Processing Transaction...</p>
          </div>
        </div>
      )}

      {/* Status Messages */}
      {error && (
        <div className="fixed bottom-16 right-4 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded w-80 max-w-80">
          <div className="flex justify-between items-start">
            <div className="overflow-x-auto">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>

            <button
              onClick={() => setError("")}
              className="text-red-700 dark:text-red-200 hover:text-red-900 dark:hover:text-red-100"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="fixed bottom-16 right-4 bg-green-100 dark:bg-green-900/50 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-200 px-4 py-3 rounded w-80 max-w-80">
          <div className="flex justify-between items-start">
            <div className="overflow-x-auto">
              <p className="font-bold">Success</p>
              <p>{success}</p>
            </div>

            <button
              onClick={() => setSuccess("")}
              className="text-green-700 dark:text-green-200 hover:text-green-900 dark:hover:text-green-100"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
