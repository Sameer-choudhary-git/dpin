import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { prismaClient } from "db/client";

const connection = new Connection(`${process.env.RPC_URL}`);
const maxRetries = 3;
const pollingInterval = 10000;

const pollPendingTransactions = async () => {
  const pendingTxns = await prismaClient.transactions.findMany({
    where: {
      status: {
        in: ["Pending", "Failure"],
      },
    },
  });

  for (const txn of pendingTxns) {
    try {
      console.log("txn", txn);
      const txnStatus = await connection.getSignatureStatus(txn.signature);
      if (txnStatus.value?.confirmationStatus == "finalized") {
        console.log(`Transaction ${txn.id} is finalized`);
        await prismaClient.$transaction([
          prismaClient.transactions.update({
            where: { id: txn.id },
            data: {
              status: "Success",
            },
          }),
          prismaClient.validator.update({
            where: { id: txn.validatorId },
            data: {
              isPaidOut: true,
              pendingPayout: 0,
            },
          }),
        ]);
      } else if (txnStatus.value?.err) {
        console.log(
          `Transaction ${txn.id} failed with error: ${txnStatus.value.err}`
        );
        if (txn.retryCount >= maxRetries) {
          console.log(`Transaction ${txn.id} exceeded retry limit`);
          
          break;
        } else {
          console.log(
            `Retrying transaction ${txn.id} attemp no. ${txn.retryCount + 1}`
          );
          const fromKeypair = Keypair.fromSecretKey(
            Uint8Array.from(JSON.parse(`${process.env.PRIVATE_KEY}`))
          );
          const toPublicKey = new PublicKey(txn.validatorId);
          const amount = txn.amount;

          const transaction = new Transaction().add(
            SystemProgram.transfer({
              fromPubkey: fromKeypair.publicKey,
              toPubkey: toPublicKey,
              lamports: amount,
            })
          );
          const newSignature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [fromKeypair]
          );
          await prismaClient.transactions.update({
            where: { id: txn.id },
            data: {
              status: "Pending",
              signature: newSignature,
              retryCount: { increment: 1 },
            },
          });
        }
      } else {
        console.log(`Transaction ${txn.id} is still pending`);
        await prismaClient.transactions.update({
          where: { id: txn.id },
          data: {
            status: "Failure",
          },
        });
      }
    } catch (e) {
      console.log(`Error checking the txn with id${txn.id}`, e);
    }
  }
};

const poll = () => {
  setInterval(pollPendingTransactions, pollingInterval);
}; // after every x seconds calling pollPendingTransactions
poll();
