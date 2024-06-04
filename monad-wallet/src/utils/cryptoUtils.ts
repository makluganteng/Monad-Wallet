// import { scryptSync, randomBytes } from 'crypto';
// import { createCipheriv, createDecipheriv } from 'crypto';
// import { keccak256 } from 'ethereum-cryptography/keccak';
// import { toHex } from 'viem';

// const algorithm = 'aes-256-gcm';

// export async function deriveKey(password: string, salt: Buffer): Promise<Buffer> {
//   return scryptSync(password, salt, 32);
// }

// export async function encryptPrivateKey(privateKey: string, password: string): Promise<{ encryptedPrivateKey: string; iv: string; salt: string }> {
//   const salt = randomBytes(16);
//   const key = await deriveKey(password, salt);
//   const iv = randomBytes(12);

//   const cipher = createCipheriv(algorithm, key, iv);
//   const encrypted = Buffer.concat([cipher.update(privateKey, 'utf8'), cipher.final()]);
//   const tag = cipher.getAuthTag();

//   return {
//     encryptedPrivateKey: toHex(Buffer.concat([encrypted, tag])),
//     iv: toHex(iv),
//     salt: toHex(salt)
//   };
// }

// export async function decryptPrivateKey(encryptedPrivateKey: string, iv: string, salt: string, password: string): Promise<string> {
//   const key = await deriveKey(password, Buffer.from(salt, 'hex'));
//   const ivBuffer = Buffer.from(iv, 'hex');
//   const encryptedData = Buffer.from(encryptedPrivateKey, 'hex');
//   const tag = encryptedData.slice(encryptedData.length - 16);
//   const data = encryptedData.slice(0, encryptedData.length - 16);

//   const decipher = createDecipheriv(algorithm, key, ivBuffer);
//   decipher.setAuthTag(tag);

//   const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);

//   return decrypted.toString('utf8');
// }

// cryptoUtils.ts
import { encode as base64Encode, decode as base64Decode } from 'base64-arraybuffer';

const algorithm = 'AES-GCM';

// async function getCryptoKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
//   const enc = new TextEncoder();
//   const keyMaterial = await crypto.subtle.importKey(
//     "raw",
//     enc.encode(password),
//     "PBKDF2",
//     false,
//     ["deriveKey"]
//   );

//   return await crypto.subtle.deriveKey(
//     {
//       name: "PBKDF2",
//       salt: salt,
//       iterations: 100000,
//       hash: "SHA-256"
//     },
//     keyMaterial,
//     { name: algorithm, length: 256 },
//     false,
//     ["encrypt", "decrypt"]
//   );
// }

async function getCryptoKey(password: string, salt: Uint8Array) {
    try {
      const enc = new TextEncoder();
      const keyMaterial = await crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        "PBKDF2",
        false,
        ["deriveKey"]
      );
  
      const algorithm = "AES-GCM"; // Define your algorithm here
  
      return await crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: salt,
          iterations: 100000,
          hash: "SHA-256"
        },
        keyMaterial,
        { name: algorithm, length: 256 },
        false,
        ["encrypt", "decrypt"]
      );
    } catch (error) {
      console.error("Error deriving key:", error);
      throw error;
    }
  }
  

export async function encryptPrivateKey(privateKey: string, password: string): Promise<{ encryptedPrivateKey: string; iv: string; salt: string }> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await getCryptoKey(password, salt);
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encodedPrivateKey = new TextEncoder().encode(privateKey);
  const encryptedPrivateKey = await crypto.subtle.encrypt(
    { name: algorithm, iv: iv },
    key,
    encodedPrivateKey
  );

  return {
    encryptedPrivateKey: base64Encode(encryptedPrivateKey),
    iv: base64Encode(iv),
    salt: base64Encode(salt)
  };
}

export async function decryptPrivateKey(encryptedPrivateKey: string, iv: string, salt: string, password: string): Promise<string> {
  const key = await getCryptoKey(password, new Uint8Array(base64Decode(salt)));
  const ivBuffer = new Uint8Array(base64Decode(iv));
  const encryptedData = base64Decode(encryptedPrivateKey);

  const decryptedPrivateKey = await crypto.subtle.decrypt(
    { name: algorithm, iv: ivBuffer },
    key,
    encryptedData
  );

  return new TextDecoder().decode(decryptedPrivateKey);
}

//TODO: function to encrypt the message and decrypt the message
