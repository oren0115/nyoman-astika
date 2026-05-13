/**
 * Raw Postgres URL from the environment (no sslmode rewriting).
 * Managed providers (DigitalOcean, Aiven, …) already ship the right query params.
 */
export function getDatabaseUrl(): string {
  return (process.env.DATABASE_URL ?? "").trim();
}

/**
 * `pg` pool options for PrismaPg. Use `DATABASE_SSL_REJECT_UNAUTHORIZED=false` only when
 * you hit TLS errors like "self-signed certificate in certificate chain" and cannot use
 * the provider’s CA file (`sslrootcert=…`). Weaker than full verification — avoid in
 * production if you can fix certificates instead.
 */
export function getPrismaPgPoolConfig(): {
  connectionString: string;
  ssl?: { rejectUnauthorized: boolean };
} {
  const connectionString = getDatabaseUrl();
  if (!connectionString) {
    throw new Error("DATABASE_URL is required");
  }
  const relaxTls = process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === "false";
  return {
    connectionString,
    ...(relaxTls ? { ssl: { rejectUnauthorized: false } } : {}),
  };
}
