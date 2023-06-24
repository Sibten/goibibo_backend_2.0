import { awsclient } from "./awsclient";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { FileParams } from "./interfaces";

const Fileparams: FileParams = {
  Bucket: "goibibo-sibten",
  Key: "",
  Body: "",
  ContentType: "",
};

export const uploadImage = async (data: FileParams) => {
  Fileparams.Key = data.Key;
  Fileparams.Body = data.Body;
  Fileparams.ContentType = data.ContentType;

  const uploadCommand = new PutObjectCommand(Fileparams);
  try {
    const res = await awsclient.send(uploadCommand);
    const url = `https://${Fileparams.Bucket}.s3.${process.env.REGION}.amazonaws.com/${Fileparams.Key}`;
    return url;
  } catch (e) {
    console.log(e);
  }
};
