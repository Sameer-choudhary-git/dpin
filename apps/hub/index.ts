import { randomUUIDv7, type ServerWebSocket } from "bun";
import type {
  IncomingMessage,
  SignupIncomnig,
  ValidateIncoming,
} from "../../packages/common/index";
import { prismaClient } from "db/client";
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import nacl_util from "tweetnacl-util";
import axios from "axios"; // Added missing axios import
import bs58 from 'bs58';
import { pollPendingTransactions } from "../poller/index"; 



interface Validator {
  socket: ServerWebSocket;
  publicKey: string;
  validatorId: string;
}

const availableValidators: Validator[] = [];
const COST_PER_CHECK = 100;
const CallBacks: { [callbackId: string]: (data: IncomingMessage) => void } = {}; // Changed from Map to an object

Bun.serve({
  fetch(req, server) {
    if (server.upgrade(req)) { // Fixed WebSocket upgrade logic
      return;
    }
    return new Response("Upgrade failed", { status: 500 });
  },
  port: 8081,
  websocket: {
    async message(ws: ServerWebSocket, message: string) {
      const data: IncomingMessage = JSON.parse(message);
      if (data.type === "signup") {
        const verified = await verifyMessage(
          `Signed message for ${data.data.callbackId}, ${data.data.publicKey}`,
          data.data.publicKey, // Fixed parameter order
          data.data.signedMessage
        );
        if (verified) {
          await signupHandler(ws, data.data);
        }
      } else if (data.type === "validate") {
         // Fixed callback retrieval logic
          if (CallBacks[data.data.callbackId]) {
            CallBacks[data.data.callbackId]?.(data);
          }
          delete CallBacks[data.data.callbackId];
        
      }
    },
    async close(ws: ServerWebSocket) {
      availableValidators.splice(
        availableValidators.findIndex((v) => v.socket === ws),
        1
      );
    },
  },
});

async function signupHandler(ws: ServerWebSocket, data: SignupIncomnig) {
  const { publicKey, ip, callbackId } = data;
  const validator = await prismaClient.validator.findFirst({
    where: { publicKey },
  });
  
  if (validator) {
    ws.send(
      JSON.stringify({
        type: "signup",
        data: { callbackId, validatorId: validator.id },
      })
    );
    availableValidators.push({ socket: ws, publicKey: validator.publicKey, validatorId: validator.id });
    return;
  }

  let location = "Unknown City"; // Removed React useState usage
  try {
    const geoInfo = await axios.get<{ status: string; city?: string }>(`https://ip-api.com/json/${ip}`);
    if (geoInfo.data.status === "success") {
      location = geoInfo.data.city || "Unknown City";
    }
  } catch (error) {
    console.error("Failed to fetch location", error);
  }

  const Response = await prismaClient.validator.create({
    data: { publicKey, ip, location },
  });
  
  ws.send(
    JSON.stringify({
      type: "signup",
      data: { callbackId, validatorId: Response.id },
    })
  );
  availableValidators.push({ socket: ws, publicKey: Response.publicKey, validatorId: Response.id });
}

// async function verifyMessage(message: string, publicKey: string, signature: string) {
//   console.log(`Verifying message for ${publicKey}`);
//   const messageBytes = nacl_util.decodeUTF8(message);
//   return nacl.sign.detached.verify(
//     messageBytes,
//     new Uint8Array(JSON.parse(signature)),
//     new PublicKey(publicKey).toBytes()
//   );
// }
async function verifyMessage(message: string, publicKey: string, signature: string) {
  try {
  
    // Convert the Solana PublicKey to a Uint8Array compatible with NaCl
    const publicKeyBytes = bs58.decode(new PublicKey(publicKey).toBase58());
    
    // Decode message bytes
    const messageBytes = nacl_util.decodeUTF8(message);
    
    // Parse the signature directly to Uint8Array
    const signatureBytes = new Uint8Array(JSON.parse(signature));

    // Detailed verification
    const isVerified = nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyBytes
    );

    return isVerified;
  } catch (error) {
    console.error('Verification Error:', error);
    return false;
  }
}
setInterval(async () => {
  const allWebsites = await prismaClient.website.findMany({ where: { deleted: false } });

  allWebsites.forEach((currentWebsite) => {
    availableValidators.forEach((currentValidator) => {
const callbackId = crypto.randomUUID();
      
      currentValidator.socket.send(
        JSON.stringify({ type: "validate", data: { callbackId, url: currentWebsite.url , websiteId:currentWebsite.id  } })
      );
      CallBacks[callbackId] = async (data: IncomingMessage) => {
        const realData = data.data as ValidateIncoming;
        const { status, latency, websiteId, validatorId, signedMessage } = realData;
        
        // Use the same message format for verification
        const verificationMessage = `Validating ${currentWebsite.url} for ${callbackId}, ${currentValidator.publicKey}`;
        
        const verified = await verifyMessage(
          verificationMessage,
          currentValidator.publicKey,
          signedMessage
        );
        
        if (!verified) {
          return;
        }


        await prismaClient.$transaction(async (tx) => {
          await tx.websiteTick.create({
            data: { websiteId:websiteId, validatorId, status, latency },
          });
          await tx.validator.update({
            where: { id: validatorId },
            data: { pendingPayout: { increment: COST_PER_CHECK } },
          });
        });
      };
    });
  });
}, 1000 * 60); // 1-minute interval


const pollingInterval = 10000;
  setInterval(pollPendingTransactions, pollingInterval);
