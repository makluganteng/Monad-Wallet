import { ethers } from 'ethers';
import { encryptPrivateKey, decryptPrivateKey } from './cryptoUtils';

export async function storeEncryptedPrivateKey(privateKey: string, password: string): Promise<void> {
  const { encryptedPrivateKey, iv, salt } = await encryptPrivateKey(privateKey, password);
  
  console.log('Storing Encrypted Data:', { encryptedPrivateKey, iv, salt });

  return new Promise((resolve) => {
    chrome.storage.local.set({
      encryptedPrivateKey,
      iv,
      salt
    }, () => {
      console.log('Encrypted private key stored successfully');
      resolve();
    });
  });
}

export async function retrieveAndDecryptPrivateKey(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['encryptedPrivateKey', 'iv', 'salt'], async (result) => {
      console.log('Retrieved Data:', result);
      
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }

      if (!result.encryptedPrivateKey || !result.iv || !result.salt) {
        return reject(new Error('Missing encrypted data in storage.'));
      }

      try {
        const decryptedPrivateKey = await decryptPrivateKey(result.encryptedPrivateKey, result.iv, result.salt, password);
        const address = await retrieveAddress(decryptedPrivateKey)
        chrome.storage.local.set({
          address
        }, () => {
          console.log(address);
          alert(address)
        })
        resolve(decryptedPrivateKey);
      } catch (error) {
        alert(`This is the error here chrome level ${error}`);
        reject(error);
      }
    });
  });
}

export async function retrieveAddress(privateKey: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try{
      const wallet = new ethers.Wallet(privateKey);
      return resolve(wallet.address);
    }catch(error){
      reject(error);
    }
  })
}

export async function retrieveAddressChrome(): Promise<string> {
  return new Promise((resolve, reject)=>{
    try {
      chrome.storage.local.get(['address'], async (result)=>{
        console.log('Retrieved Address', result);
        alert(result);

        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
  
        if(!result.address){
          return reject(new Error('Missing address data in storage'));
        }

        resolve(result.address)
      })
    }catch(error){
      alert(`This is the error here chrome level ${error}`);
      reject(error);
    }
  })
}