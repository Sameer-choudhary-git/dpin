import { randomUUIDv7, type ServerWebSocket } from "bun";
import type {
  OutgoingMessage,
  SignupOutgoing,
  ValidateIncoming,
  ValidateOutgoing,
} from "../../packages/common/index";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import nacl_util from "tweetnacl-util";
import bs58 from 'bs58';

const SECRET_KEY = process.env.SECRET_KEY || "[]";

const WS_URL = process.env.VALIDATOR_WS_URL || "ws://localhost:8081";
const CALLBACKS: { [callbackId: string]: (message: SignupOutgoing) => void } = {};

async function signMessage(message: string, keypair: Keypair) {
  const messageBytes = nacl_util.decodeUTF8(message);
  const signature = nacl.sign.detached(messageBytes, keypair.secretKey);
  
  
  return JSON.stringify(Array.from(signature));
}

async function main() {
  const keypair = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(SECRET_KEY)));
  const ws = new WebSocket(WS_URL);

  ws.onopen = async () => {
    const callbackId = randomUUIDv7();
    CALLBACKS[callbackId] = (data: SignupOutgoing) => {
      
      validatorId = data.validatorId;
    };

    const signedMessage = await signMessage(`Signed message for ${callbackId}, ${keypair.publicKey}`, keypair);
 
    ws.send(
      JSON.stringify({
        type: "signup",
        data: {
          callbackId,
          ip: "127.0.0.1",
          publicKey: keypair.publicKey,
          signedMessage,
        },
      })
    );
  };

  ws.onmessage = async (event) => {
    const data: OutgoingMessage = JSON.parse(event.data);
    if (data.type === "signup") {
      CALLBACKS[data.data.callbackId]?.(data.data);
      delete CALLBACKS[data.data.callbackId];
    } else if (data.type === "validate") {
      await validateHandler(ws, data.data, keypair);
    }
  };
}

let validatorId: string | null = null;

async function validateHandler(ws: WebSocket, data: ValidateOutgoing, keypair: Keypair) {
  const { url, callbackId, websiteId } = data;
  const startTime = Date.now();
  
  // Use a consistent message format matching the hub's verification
  const messageToSign = `Validating ${url} for ${callbackId}, ${keypair.publicKey.toBase58()}`;
  
  const signature = await signMessage(messageToSign, keypair);
  try {
    const urlFetch = await fetch(url);
    const endTime = Date.now();
    const latency = endTime - startTime;
    const status = urlFetch.status === 200 ? "UP" : "DOWN";
 
    ws.send(
      JSON.stringify({
        type: "validate",
        data: {
          callbackId,
          status,
          latency,
          websiteId,
          validatorId,
          signedMessage: signature,
        },
      })
    );
  } catch (error) {
    ws.send(
      JSON.stringify({
        type: "validate",
        data: {
          callbackId,
          status: "DOWN",
          latency: 999,
          websiteId,
          validatorId,
          signedMessage: signature,
        },
      })
    );
    console.error("Validator error:", url);
  }
}
main();

setInterval(async () => {}, 10000);
