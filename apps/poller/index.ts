import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
   
} from "@solana/web3.js";
import { prismaClient } from "db/client";

const connection = new Connection(`${process.env.RPC_URL}`);
const maxRetries = 3;
const privateKey = Uint8Array.from(JSON.parse(`${process.env.SECRET_KEY}`));
const senderKeypair = Keypair.fromSecretKey(privateKey);
const senderPublicKey = senderKeypair.publicKey;

interface Txn {
  id: string;
  status: string;
  retryCount: number;
  amount: number;
  signature: string;
  validatorId: string;
  createdAt: Date;
  validator: {
    publicKey: string;
  };
}

export const pollPendingTransactions = async () => {
  try {
    const pendingTxns = await prismaClient.transactions.findMany({
      where: {
        status: {
          in: ["Pending", "Failure"],
        },
        retryCount: {
          lt: maxRetries,
        },
      },
      include: {
        validator: true,
      },
    });

    for (const currentTxn of pendingTxns) {
      const check = await checkIfTransactionIsDone(currentTxn);
      if (check) {
        const signature = check.signature;
        await completedTransaction(currentTxn, signature);
      } else {
        await makeTransaction(currentTxn);
      }
    }
  } catch (error) {
    console.error("Error in transaction polling:", error);
  }
};

async function checkIfTransactionIsDone(currentTxn: Txn) {
  const currentTransactionCreatedAt = new Date(currentTxn.createdAt).getTime() / 1000;
  const recipientPublicKey = new PublicKey(currentTxn.validator.publicKey);
  const exactAmount = currentTxn.amount;
  try {
    const signatures = await connection.getSignaturesForAddress(
      senderPublicKey,
      { limit: 50 }
    );

    for (const sigInfo of signatures) {
      if (!sigInfo.blockTime || sigInfo.blockTime <= currentTransactionCreatedAt) continue;

      // Fetch transaction details
      const tx = await connection.getTransaction(sigInfo.signature, {
          commitment: "confirmed",
          maxSupportedTransactionVersion: 0
        }
      );
      if (tx && tx.transaction.message.getAccountKeys().staticAccountKeys.length > 1) {
        const accounts = tx.transaction.message.getAccountKeys().staticAccountKeys.map((key) =>
          key.toBase58()
        );

        // Check if the transaction was sent to the recipient
        const recipientIndex = accounts.indexOf(recipientPublicKey.toBase58());
        if (
          recipientIndex !== -1 &&
          tx.meta?.postBalances &&
          tx.meta?.preBalances
        ) {
          const lamportsTransferred = ((tx.meta?.preBalances?.[0] || 0) - (tx.meta?.postBalances?.[0] || 0)) ;

          if (lamportsTransferred === exactAmount) {
            const solTransferred = lamportsTransferred / LAMPORTS_PER_SOL;
            console.log("Transaction Found:", {
              signature: sigInfo.signature,
              blockTime: new Date(sigInfo.blockTime * 1000).toISOString(),
              solTransferred,
              amount: exactAmount/LAMPORTS_PER_SOL
            });
            return {
              signature: sigInfo.signature,
              blockTime: new Date(sigInfo.blockTime * 1000).toISOString(),
              solTransferred,
            };
          }
        }
      }
    }

    console.log("No transaction found.");
    return null;
  } catch (error) {
    console.error("Error checking transaction:", error);
    return null;
  }
}

async function makeTransaction(currentTxn: Txn) {
  try {
    const fromKeypair = senderKeypair;
    const recipientPublicKey = new PublicKey(currentTxn.validator.publicKey);
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: senderPublicKey,
        toPubkey: recipientPublicKey,
        lamports: currentTxn.amount,
      })
    );
    
    const signature =  await sendAndConfirmTransaction(
      connection,
      transaction,
      [fromKeypair]
    );
    await completedTransaction(currentTxn, signature);
    return signature;
  } catch (error) {
    console.error("Error in makeTransaction:", error);
    await failureInTransaction(currentTxn);
    return null;
  }
}

async function completedTransaction(currentTxn: Txn, signature: string) {
  try {
    await prismaClient.$transaction(async (prisma) => {
      await prisma.transactions.update({
        where: { id: currentTxn.id },
        data:{
          status: "Success",
          retryCount: currentTxn.retryCount + 1,
          signature: signature,
        }
      });
      await prisma.validator.update({
        where: { id: currentTxn.validatorId },
        data: {
          pendingPayout: {
            decrement: currentTxn.amount
          },
          lockedAt: null,
        },
      });
    });
  }catch (error) {
    console.error("Error in completedTransaction:", error);
  }
}

async function failureInTransaction(currentTxn: Txn) { 
  try {
    const currentTransactionRetryCount = currentTxn.retryCount;
    
    if (currentTransactionRetryCount >= maxRetries - 1) {
      await prismaClient.$transaction(async (prisma) => {
        await prisma.transactions.update({
          where: { id: currentTxn.id },
          data: {
            status: "Failure",
            retryCount: {
              increment: 1
            }
          }
        });
        
        await prisma.validator.update({
          where: { id: currentTxn.validatorId },
          data: {
            lockedAt: null,
          },
        });
      });
      console.log(`Transaction ${currentTxn.id} marked as final failure after ${maxRetries} attempts`);
      return;
    }

    await prismaClient.$transaction(async (prisma) => {
      await prisma.transactions.update({
        where: { id: currentTxn.id },
        data: {
          status: "Failure",
          retryCount: {
            increment: 1
          }
        }
      });
    });
    console.log(`Transaction ${currentTxn.id} marked as failed, attempt ${currentTxn.retryCount + 1}/${maxRetries}`);
  } catch (error) {
    console.error(`Error updating failure status for transaction ${currentTxn.id}:`, error);
  }
}