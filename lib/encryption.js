const CryptoJS = require("crypto-js");

function randomString(length, chars) {
  var result = "";
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

var secretKey = CryptoJS.enc.Latin1.parse(
  process.env.NEXT_PUBLIC_ENCRYPTION_KEY
);
var ivKey = CryptoJS.enc.Latin1.parse(
  randomString(
    16,
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  )
);
var publicKey = CryptoJS.enc.Latin1.stringify(ivKey);

//encryption
export const encryption = (data) => {
  var plainText = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey, {
    iv: ivKey,
  }).toString();
  return `${publicKey}:${plainText}`;
};

//decryption
export const decryption = (encryptedString) => {
  if (!encryptedString.includes(":")) {
    throw new Error("Invalid encrypted data format.");
  }

  const [publicKey, cipherText] = encryptedString.split(":");

  const ivKey = CryptoJS.enc.Latin1.parse(publicKey);
  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Base64.parse(cipherText),
  });

  const bytes = CryptoJS.AES.decrypt(cipherParams, secretKey, { iv: ivKey });
  const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

  try {
    return JSON.parse(decryptedText);
  } catch (err) {
    throw new Error("Decryption failed: Invalid JSON.");
  }
};
