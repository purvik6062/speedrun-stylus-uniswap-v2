"use client";

import { useState } from "react";
import { useNetworkColor } from "~~/hooks/scaffold-eth";
import { useDevAccount } from "~~/hooks/scaffold-eth/useDevAccount";

/**
 * Custom Wagmi Connect Button (watch balance + custom design)
 */
export const RainbowKitCustomConnectButton = () => {
  const networkColor = useNetworkColor();
  const { balance, address } = useDevAccount();
  const [isCopied, setIsCopied] = useState(false);
  console.log("Your Address", address);

  const formattedBalance = parseFloat(balance).toFixed(2);

  const copyToClipboard = () => {
    if (!address) return;
    navigator.clipboard.writeText(address)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch(err => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div className="flex items-center">
      <div className="flex items-center bg-base-200 rounded-lg px-3 py-2 shadow-md">
        <div className="flex flex-col items-start">
          <span className="text-sm font-bold mb-1">Dev Account</span>
          <div className="flex items-center gap-1">
            <span className="text-lg font-medium">{formattedBalance} ETH</span>
            <div 
              className="tooltip tooltip-bottom tooltip-primary relative" 
              data-tip={isCopied ? "Copied!" : address?.slice(0, 20) + "..." + address?.slice(-8)}
            >
              <span 
                className="text-sm text-base-content/70 hover:text-base-content cursor-pointer flex items-center"
                onClick={copyToClipboard}
              >
                {address?.slice(0, 6)}...{address?.slice(-4)}
                {isCopied ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-1.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </span>
              <style jsx>{`
                .tooltip:before {
                  right: 0;
                  left: auto;
                  transform: translateX(0);
                }
              `}</style>
            </div>
          </div>
          <span className="text-xs mt-1" style={{ color: networkColor }}>
            Local Nitro
          </span>
        </div>
      </div>
    {/* <ConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        const connected = mounted && account && chain;
        const blockExplorerAddressLink = account
          ? getBlockExplorerAddressLink(targetNetwork, account.address)
          : undefined;

        return (
          <>
            {(() => {
              if (!connected) {
                return (
                  <button className="btn btn-primary btn-sm" onClick={openConnectModal} type="button">
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported || chain.id !== targetNetwork.id) {
                return <WrongNetworkDropdown />;
              }

              return (
                <>
                  <div className="flex flex-col items-center mr-1">
                    <Balance address={account.address as Address} className="min-h-0 h-auto" />
                    <span className="text-xs" style={{ color: networkColor }}>
                      {chain.name}
                    </span>
                  </div>
                  <AddressInfoDropdown
                    address={account.address as Address}
                    displayName={account.displayName}
                    ensAvatar={account.ensAvatar}
                    blockExplorerAddressLink={blockExplorerAddressLink}
                  />
                  <AddressQRCodeModal address={account.address as Address} modalId="qrcode-modal" />
                </>
              );
            })()}
          </>
        );
      }}
    </ConnectButton.Custom> */}
    </div>
  );
};
