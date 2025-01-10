"use client";

import React, { useEffect, useState } from "react";
import { IUniswapV2 } from "./IUniswapV2";
import { ethers } from "ethers";

const contractAddress = "0xa6e41ffd769491a42a6e5ce453259b93983a22ef"; // Get this from run-dev-node.sh output
const provider = new ethers.JsonRpcProvider("http://localhost:8547/");
const privateKey = "0xb6b15c8cb491557369f3c7d2c287b053eb229daa9c22138887752191c9520659";
const signer = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(contractAddress, IUniswapV2, signer);

export default function DebugContracts() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>("");
  const [success, setSuccess] = useState("");
  const [contractInfo, setContractInfo] = useState({
    name: "",
    symbol: "",
    totalSupply: "",
  });

  // Form states
  const [initializeForm, setInitializeForm] = useState<any>({
    token0: "",
    token1: "",
    feeTo: "",
  });
  const [mintForm, setMintForm] = useState({
    to: "",
  });
  const [burnForm, setBurnForm] = useState({
    to: "",
  });
  const [swapForm, setSwapForm] = useState({
    amount0Out: "",
    amount1Out: "",
    to: "",
  });

  useEffect(() => {
    fetchContractInfo();
  }, []);

  const fetchContractInfo = async () => {
    try {
      const name = await contract.name();
      const symbol = await contract.symbol();
      const totalSupply = await contract.totalSupply();
      setContractInfo({
        name,
        symbol,
        totalSupply: ethers.formatEther(totalSupply),
      });
    } catch (err) {
      setError("Error fetching contract info");
      console.error(err);
    }
  };

  const handleInitialize = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const tx = await contract.initialize(initializeForm.token0, initializeForm.token1, initializeForm.feeTo);
      await tx.wait();
      setSuccess("Pool initialized successfully!");
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  const handleMint = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const tx = await contract.mint(mintForm.to);
      await tx.wait();
      setSuccess("Liquidity minted successfully!");
      fetchContractInfo();
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  const handleBurn = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const tx = await contract.burn(burnForm.to);
      await tx.wait();
      setSuccess("Liquidity burned successfully!");
      fetchContractInfo();
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  const handleSwap = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const tx = await contract.swap(
        ethers.parseEther(swapForm.amount0Out),
        ethers.parseEther(swapForm.amount1Out),
        swapForm.to,
        [],
      );
      await tx.wait();
      setSuccess("Swap executed successfully!");
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Contract Info */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Contract Info</h2>
        <div className="space-y-2 text-gray-600 dark:text-gray-300">
          <p>Name: {contractInfo.name}</p>
          <p>Symbol: {contractInfo.symbol}</p>
          <p>Total Supply: {contractInfo.totalSupply}</p>
        </div>
      </div>

      {/* Initialize Form */}
      <form onSubmit={handleInitialize} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Initialize Pool</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Token0 Address"
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={initializeForm.token0}
            onChange={e => setInitializeForm({ ...initializeForm, token0: e.target.value })}
          />
          <input
            type="text"
            placeholder="Token1 Address"
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={initializeForm.token1}
            onChange={e => setInitializeForm({ ...initializeForm, token1: e.target.value })}
          />
          <input
            type="text"
            placeholder="Fee To Address"
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={initializeForm.feeTo}
            onChange={e => setInitializeForm({ ...initializeForm, feeTo: e.target.value })}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600"
          >
            {loading ? "Processing..." : "Initialize"}
          </button>
        </div>
      </form>

      {/* Mint Form */}
      <form onSubmit={handleMint} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Mint Liquidity</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="To Address"
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={mintForm.to}
            onChange={e => setMintForm({ ...mintForm, to: e.target.value })}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600"
          >
            {loading ? "Processing..." : "Mint"}
          </button>
        </div>
      </form>

      {/* Burn Form */}
      <form onSubmit={handleBurn} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Burn Liquidity</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="To Address"
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={burnForm.to}
            onChange={e => setBurnForm({ ...burnForm, to: e.target.value })}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600"
          >
            {loading ? "Processing..." : "Burn"}
          </button>
        </div>
      </form>

      {/* Swap Form */}
      <form onSubmit={handleSwap} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Swap Tokens</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Amount0 Out"
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={swapForm.amount0Out}
            onChange={e => setSwapForm({ ...swapForm, amount0Out: e.target.value })}
          />
          <input
            type="text"
            placeholder="Amount1 Out"
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={swapForm.amount1Out}
            onChange={e => setSwapForm({ ...swapForm, amount1Out: e.target.value })}
          />
          <input
            type="text"
            placeholder="To Address"
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={swapForm.to}
            onChange={e => setSwapForm({ ...swapForm, to: e.target.value })}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600"
          >
            {loading ? "Processing..." : "Swap"}
          </button>
        </div>
      </form>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 px-4 py-3 rounded relative">
          {success}
        </div>
      )}
    </div>
  );
}
