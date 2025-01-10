import { useEffect, useState } from "react";
import { formatEther } from "viem";
import { JsonRpcProvider, Wallet } from "ethers";

export const useDevAccount = () => {
  const [balance, setBalance] = useState<string>("0");
  const [address, setAddress] = useState<string>("");
  
  useEffect(() => {
    const initDevAccount = async () => {
      const provider = new JsonRpcProvider("http://localhost:8547");
      const privateKey = "0xb6b15c8cb491557369f3c7d2c287b053eb229daa9c22138887752191c9520659";
      const wallet = new Wallet(privateKey, provider);
      
      setAddress(wallet.address);
      
      const accountBalance = await provider.getBalance(wallet.address);
      setBalance(formatEther(BigInt(accountBalance)));
    };

    initDevAccount();
  }, []);

  return { balance, address };
};