import ImageKit from "imagekit";
import ENV from "../ENV/index.js";

const imagekit = new ImageKit({
  publicKey: ENV.IMAGEKIT_PUBLIC_KEY || process.env.IMAGEKIT_PUBLIC_KEY || "",
  privateKey: ENV.IMAGEKIT_PRIVATE_KEY || process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: ENV.IMAGEKIT_URL_ENDPOINT || process.env.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/authcrud",
});

export default imagekit;
