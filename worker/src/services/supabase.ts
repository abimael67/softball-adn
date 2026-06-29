import type { Env, AuthContext } from "../types";
import { AppError } from "../errors";
import { ERROR_CODES } from "../constants";
import { logger } from "../utils/logger";

interface SupabaseUser {
  id: string;
  email: string;
}

export async function verifySupabaseToken(env: Env, token: string): Promise<AuthContext> {
  const response = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
    },
  });

  if (!response.ok) {
    logger.warn("Supabase token verification failed", { status: response.status });
    throw new AppError(ERROR_CODES.UNAUTHORIZED, 401);
  }

  const user = (await response.json()) as SupabaseUser;

  const roles: string[] = [];
  const rolesResponse = await fetch(
    `${env.SUPABASE_URL}/rest/v1/user_roles?user_id=eq.${user.id}&select=role`,
    {
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    },
  );

  if (rolesResponse.ok) {
    const roleRows = (await rolesResponse.json()) as { role: string }[];
    for (const row of roleRows) {
      roles.push(row.role);
    }
  }

  return {
    userId: user.id,
    email: user.email,
    roles,
  };
}
