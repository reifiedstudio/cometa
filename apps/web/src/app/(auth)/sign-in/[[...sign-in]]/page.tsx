import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F8F8F8]">
      <SignIn />
    </div>
  );
}
