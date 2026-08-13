import db from "@/db/index";
import { usersSync } from "@/db/schema";

type HexclaveUser = {
  id: string;
  displayName: string | null;
  primaryEmail: string | null;
};

export async function ensureUserExists(user: HexclaveUser): Promise<void> {
  await db
    .insert(usersSync)
    .values({
      id: user.id,
      name: user.displayName,
      email: user.primaryEmail,
    })
    .onConflictDoUpdate({
      target: usersSync.id,
      set: {
        name: user.displayName,
        email: user.primaryEmail,
      },
    });
}
