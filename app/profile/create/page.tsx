import FormContainer from "@/components/form/formcontanier";
import FormInput from "@/components/form/input";
import { SubmitButton } from "@/components/form/submitbtn";
import { createProfileAction } from "@/utils/action";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function CreateProfile() {
  const user = await currentUser();
  if (user?.privateMetadata?.hasProfile) redirect('/');

  return (
    <section className="min-h-screen px-4 py-12 flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-xl bg-white shadow-md rounded-xl p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Create Your Profile</h1>
          <p className="text-gray-500 mt-1">Please complete your account setup</p>
        </div>

        <FormContainer action={createProfileAction}>
          <div className="grid gap-4">
            <FormInput type="text" name="firstName" label="First Name" />
            <FormInput type="text" name="lastName" label="Last Name" />
            <FormInput type="text" name="username" label="Username" />
          </div>
          <SubmitButton text="Create Profile" className="mt-6 w-full" />
        </FormContainer>
      </div>
    </section>
  );
}
