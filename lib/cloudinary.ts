import { v2 as cloudinary } from "cloudinary";

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_URL } =
  process.env;

if (CLOUDINARY_URL) {
  try {
    const u = new URL(CLOUDINARY_URL);
    cloudinary.config({
      cloud_name: u.hostname,
      api_key: decodeURIComponent(u.username),
      api_secret: decodeURIComponent(u.password),
      secure: true,
    });
  } catch {
    // Invalid URL; upload route will surface misconfiguration
  }
} else if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export function isCloudinaryConfigured(): boolean {
  if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) {
    return true;
  }
  if (!CLOUDINARY_URL) {
    return false;
  }
  try {
    const u = new URL(CLOUDINARY_URL);
    return Boolean(u.hostname && u.username && u.password);
  } catch {
    return false;
  }
}

export { cloudinary };
