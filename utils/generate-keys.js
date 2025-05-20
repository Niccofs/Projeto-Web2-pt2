const { generateKeyPairSync } = require("crypto");
const fs = require("fs");

console.log("🔑 Gerando chaves RSA (RS256)...");

const { privateKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
});

fs.writeFileSync("private_key.pem", privateKey);

console.log("✅ Chaves geradas e salvas como 'private_key.pem'.");

function convertPemToBase64(filePath) {
  const pem = fs.readFileSync(filePath, "utf8");
  const base64 = Buffer.from(pem).toString("base64");
  return base64;
}

const privateKeyBase64 = convertPemToBase64("private_key.pem");

fs.writeFileSync("private_key_base64.txt", privateKeyBase64);

console.log(
  "✅ Chaves convertidas para Base64 e salvas como 'private_key_base64.txt'."
);
