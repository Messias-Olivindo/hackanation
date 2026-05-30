import { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

// Hook for connecting to Phantom wallet
export const useWallet = () => {
  const [wallet, setWallet] = useState<any>(null);
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if Phantom is installed
    const phantom = (window as any).phantom;
    
    if (phantom && phantom.solana) {
      setWallet(phantom.solana);
      
      // Check if already connected
      const checkConnection = async () => {
        try {
          if (phantom.solana.isConnected) {
            const account = await phantom.solana.connect();
            setPublicKey(account.publicKey);
            setConnected(true);
          }
        } catch (err) {
          console.error('Error checking connection:', err);
        } finally {
          setLoading(false);
        }
      };
      
      checkConnection();
    } else {
      setLoading(false);
    }
  }, []);

  const connectWallet = async () => {
    if (!wallet) {
      throw new Error('Phantom wallet not installed');
    }
    
    try {
      const response = await wallet.connect();
      setPublicKey(response.publicKey);
      setConnected(true);
      return response;
    } catch (err) {
      console.error('Error connecting wallet:', err);
      throw err;
    }
  };

  const disconnectWallet = async () => {
    if (!wallet) return;
    
    try {
      await wallet.disconnect();
      setPublicKey(null);
      setConnected(false);
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
    }
  };

  return {
    wallet,
    connected,
    publicKey,
    connect: connectWallet,
    disconnect: disconnectWallet,
    loading
  };
};