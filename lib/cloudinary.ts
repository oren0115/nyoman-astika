import { v2 as cloudinary } from "cloudinary";

function readEnv() {
  return {
    url: process.env.CLOUDINARY_URL,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  };
}

export function isCloudinaryConfigured(): boolean {
  const { url, cloudName, apiKey, apiSecret } = readEnv();
  if (cloudName && apiKey && apiSecret) {
    return true;
  }
  if (!url) {
    return false;
  }
  try {
    const u = new URL(url);
    return Boolean(u.hostname && u.username && u.password);
  } catch {
    return false;
  }
}

/** Apply credentials from the current environment (call before upload). Safe to call repeatedly. */
export function configureCloudinary(): void {
  const { url, cloudName, apiKey, apiSecret } = readEnv();
  if (url) {
    try {
      const u = new URL(url);
      cloudinary.config({
        cloud_name: u.hostname,
        api_key: decodeURIComponent(u.username),
        api_secret: decodeURIComponent(u.password),
        secure: true,
      });
    } catch {
      /* misconfigured URL */
    }
    return;
  }
  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
  }
}

export { cloudinary };
