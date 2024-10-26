import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function Login({ searchParams }: { searchParams: Message }) {
  return (
    <div className="flex justify-center">
      <form className="flex flex-col min-w-64 max-w-md p-6 mx-auto">
        <h1 className="text-2xl font-medium">Sign in</h1>
        <p className="text-xs text-foreground italic">
          New app sign ups coming soon! <br />
          <Link
            className="mt-6 hover:underline text-lime-500 font-bold"
            href="https://regulation-365.ghost.io/#/portal/signup"
          >
            Subscribe to our newsletter to get notified when we launch.
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            required
          />
          <SubmitButton
            className="bg-lime-400"
            pendingText="Signing In..."
            formAction={signInAction}
          >
            Sign in
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </div>
  );
}
