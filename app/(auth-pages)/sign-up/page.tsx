import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <form className="flex flex-col w-full">
        <h1 className="text-2xl font-semibold mb-2">Sign up</h1>
        <p className="text-sm text-gray-600 mb-8">
          Already have an account?{" "}
          <Link className="text-green-700 hover:text-green-800 font-medium" href="/sign-in">
            Sign in
          </Link>
        </p>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              name="email" 
              placeholder="you@example.com" 
              required 
              className="bg-gray-100 p-3 rounded-md"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              name="phone" 
              type="tel"
              placeholder="+1234567890" 
              required 
              className="bg-gray-100 p-3 rounded-md"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              type="password"
              name="password"
              placeholder="Your password"
              minLength={6}
              required
              className="bg-gray-100 p-3 rounded-md"
            />
          </div>
          <SubmitButton 
            formAction={signUpAction} 
            pendingText="Signing up..."
            className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded-md mt-4"
          >
            Sign up
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
      <SmtpMessage />
    </>
  );
}
