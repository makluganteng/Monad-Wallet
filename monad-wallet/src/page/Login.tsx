import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import { storeEncryptedPrivateKey, retrieveAndDecryptPrivateKey } from '../utils/chrome';

interface GeneratedWallet {
  privKey: string,
  address: string
}

function Login() {
  const [generatedWallet, setGeneratedWallet] = useState<GeneratedWallet>({ privKey: "", address: "" });
  const [password, setPassword] = useState<string>('');
  const [decryptPassword, setDecryptPassword] = useState<string>('');
  const [walletExists, setWalletExists] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    checkForStoredWallet();
  }, []);

  const checkForStoredWallet = async () => {
    chrome.storage.local.get(['encryptedPrivateKey', 'iv', 'salt'], (result) => {
      if (result.encryptedPrivateKey && result.iv && result.salt) {
        setWalletExists(true);
      }
    });
  };

  const generateWallet = async () => {
    try {
      const wallet = ethers.Wallet.createRandom();
      const privKey = wallet.privateKey;
      const address = wallet.address;

      setGeneratedWallet({ privKey, address });

      console.log('Generated Wallet:');
      console.log('Private Key:', privKey);
      console.log('Address:', address);

    } catch (e) {
      console.error('Error generating wallet:', e);
    }
  };

  const storeWallet = async () => {
    if (!generatedWallet.privKey || !password) {
      alert('Please generate a wallet and enter a password.');
      return;
    }
    try {
      await storeEncryptedPrivateKey(generatedWallet.privKey, password);
      setWalletExists(true);
      alert('Wallet stored successfully!');
    } catch (e) {
      console.error('Error storing wallet:', e);
    }
  };

  const handleDecryptPrivateKey = async () => {
    try {
      await retrieveAndDecryptPrivateKey(decryptPassword);
      navigate("/main-page")
    } catch (e) {
      alert(`Error decrypting private key:${e}`);
    }
  };

  const clearWallet = async () => {
    chrome.storage.local.remove(['encryptedPrivateKey', 'iv', 'salt'], () => {
      setWalletExists(false);
      setGeneratedWallet({ privKey: "", address: "" });
      setPassword('');
      setDecryptPassword('');
      alert('Wallet cleared successfully!');
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }).catch((err) => {
      console.error('Error copying to clipboard', err);
    });
  };

  const truncate = (fullStr: any, strLen: any, separator: any) => {
    if (fullStr.length <= strLen) return fullStr;

    separator = separator || '...';

    const sepLen = separator.length,
          charsToShow = strLen - sepLen,
          frontChars = Math.ceil(charsToShow / 2),
          backChars = Math.floor(charsToShow / 2);

    return fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4 text-white">Welcome to Monad Wallet</h1>
      {walletExists ? (
        <>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2 text-white">Welcome back!</h2>
            <div className="flex flex-col items-center">
              <input
                type="password"
                value={decryptPassword}
                onChange={(e) => setDecryptPassword(e.target.value)}
                placeholder="Enter password to decrypt"
                className="mb-2 p-2 border rounded-lg text-black"
              />
              <button
                onClick={handleDecryptPrivateKey}
                className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition duration-300"
              >
                Unlock
              </button>
            </div>
          </div>
          <button
            onClick={clearWallet}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition duration-300"
          >
            Clear Wallet
          </button>
        </>
      ) : (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2 text-white">Generate a new wallet</h2>
          <div className="flex justify-center">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="mb-2 p-2 border rounded-lg text-black"
            />
            {generatedWallet.address === "" ? (
              <button
                onClick={generateWallet}
                className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition duration-300"
              >
                Generate Wallet
              </button>
            ) : (
              <button
                onClick={storeWallet}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
              >
                Store Wallet
              </button>
            )}
          </div>
          {generatedWallet && generatedWallet.address !== "" && (
            <div className="mt-4 text-left">
              <div className="mb-2">
                <p className="text-white">Private Key: {truncate(generatedWallet.privKey, 20, "....")}</p>
                <button
                  onClick={() => copyToClipboard(generatedWallet.privKey)}
                  className="bg-gray-300 text-gray-800 px-2 py-1 rounded-lg shadow-md hover:bg-gray-400 transition duration-300"
                >
                  Copy
                </button>
              </div>
              <div className="mb-2">
                <p className="text-white">Address: {generatedWallet.address}</p>
                <button
                  onClick={() => copyToClipboard(generatedWallet.address)}
                  className="bg-gray-300 text-gray-800 px-2 py-1 rounded-lg shadow-md hover:bg-gray-400 transition duration-300"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Login;
