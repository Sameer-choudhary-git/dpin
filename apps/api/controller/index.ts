import { type Response, type NextFunction } from "express";
import { prismaClient } from "db/client";
import { type Request } from "express";
import jwt from "jsonwebtoken";
import { JWT_PUBLIC_KEY } from "../config";
import {
  SystemProgram,
  Connection,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
  Keypair,
  clusterApiUrl,
} from "@solana/web3.js";

const privateKey = process.env.PRIVATE_KEY;

const connection = new Connection(clusterApiUrl("devnet"));

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers["authorization"];
  if (!token) {
    console.log("No token provided");
    return res.status(401).send("Unauthorized");
    
  }

  const decode = jwt.verify(token, JWT_PUBLIC_KEY);
  if (!decode || !decode.sub) {
    console.log("Invalid token");
    return res.status(401).send("Unauthorized");
  }
  req.userId = decode.sub as string;

  next();
}

export async function makeWebsite(req: Request, res: Response) {
  try {
    const email = req.body.email as string;
    const userId = req.userId as string;
    const url = req.body.url;

    const response = await prismaClient.website.create({
      data: {
        url: url,
        userId: userId,
        email: email
      },
    });
    res.status(200).send({ id: response.id });
  } catch (error: any) {
    console.log("Error in makeWebsite:", error);
    console.log(error.message);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}

export async function getWebsites(req: Request, res: Response) {
  try {
    const userId = req.userId as string;
    const response = await prismaClient.website.findMany({
      where: {
        userId: userId,
        deleted: false,
      },
      include: {
        tick: true,
      },
    });
    res.status(200).send({ websites: response });
  } catch (e: any) {
    console.log("Error in getWebsites:", e);
    res.status(500).json({ error: e.message || "Internal Server Error" });
  }
}
export async function getWebsiteStatus(req: Request, res: Response) {
  const websiteId = req.query.websiteId as string;
  const userId = req.query.userId as string;
  await prismaClient.website
    .findFirst({
      where: {
        id: websiteId,
        userId: userId,
      },
      include: {
        tick: true,
      },
    })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
}

export async function deleteWebsite(req: Request, res: Response) {
  const websiteId = req.params.websiteId;
  const userId = req.userId;
  await prismaClient.website
    .update({
      where: {
        id: websiteId,
        userId: userId,
      },
      data: {
        deleted: true,
      },
    }).catch((error) => {
      console.log("Error in deleteWebsite:", error);
      res.status(500).send(error);
    });
}

export async function payOut(req: Request, res: Response) {
  const validatorId = req.params.validatorId;
  
  try {
    const txn = await prismaClient.$transaction(async (prisma) => {
      const validator = await prisma.validator.findUnique({
        where: { id: validatorId },
        select: {
          id: true,
          pendingPayout: true,
          publicKey: true,
          lockedAt: true,
        },
      });
      
      if (!validator) {
        return { error: "Validator not found", status: 404 };
      }
      
      if (validator.lockedAt) {
        return { error: "Payout is still in process", status: 200 };
      }
      
      if (validator.pendingPayout === 0) {
        return { error: "No payout left", status: 200 };
      }
      
      const transaction = await prisma.transactions.create({
        data: {
          validatorId: validator.id,
          amount : validator.pendingPayout , 
          signature: "", 
          status: "Pending",
        },
      });
      
      await prisma.validator.update({
        where: { id: validatorId },
        data: { lockedAt: new Date() },
      });
      
      return { transaction, validator, status: 201 };
    });
    
    if (txn.error) {
      return res.status(txn.status).json({ message: txn.error });
    }
    
    // Successful transaction creation
    res.status(txn.status).json({
      message: "Payout initiated successfully",
      transactionId: txn.transaction?.id
    });
    
  } catch (error) {
    console.error("Error in payout process:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}