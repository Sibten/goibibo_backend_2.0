import { S3Client } from "@aws-sdk/client-s3";
import env from "dotenv";
env.config();

export const awsclient = new S3Client({
  region: process.env.REGION!,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY!,
    secretAccessKey: process.env.ACCESS_SEC_KEY!,
  },
});
