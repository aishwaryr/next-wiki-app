"use client";

import { useHexclaveApp } from "@hexclave/next";
import { Button } from "@/components/ui/button";
import { NavigationMenuItem } from "@/components/ui/navigation-menu";

export function AuthButtons() {
  const app = useHexclaveApp();

  return (
    <>
      <NavigationMenuItem>
        <Button variant="outline" onClick={() => app.redirectToSignIn()}>
          Sign In
        </Button>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <Button onClick={() => app.redirectToSignUp()}>Sign Up</Button>
      </NavigationMenuItem>
    </>
  );
}
