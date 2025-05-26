import FormContainer from "@/components/form/formcontanier";
import ImageInputContainer from "@/components/form/imageinputcontainer";
import FormInput from "@/components/form/input";
import { SubmitButton } from "@/components/form/submitbtn";
import {
  fetchProfile,
  updateProfileAction,
  updateProfileImageAction,
} from "@/utils/action";

export default async function ProfilePage() {
  const profile = await fetchProfile();

  return (
    <section className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">👤 Profile Settings</h1>
          <p className="text-gray-500 mt-2">Manage your personal information</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10 grid md:grid-cols-3 gap-8 items-start">
          {/* Profile Image section */}
          <div className="col-span-1 flex justify-center">
            <div className="flex flex-col items-center space-y-4">
              <ImageInputContainer
                image={profile.profileImage}
                name={profile.username}
                action={updateProfileImageAction}
                text="Change Avatar"
              />
              <span className="text-gray-600 text-sm text-center">
                Recommended: 1:1 ratio, JPG/PNG
              </span>
            </div>
          </div>

          {/* Form section */}
          <div className="col-span-2">
            <FormContainer action={updateProfileAction}>
              <div className="grid gap-6 sm:grid-cols-2">
                <FormInput
                  type="text"
                  name="firstName"
                  label="First Name"
                  defaultValue={profile.firstName}
                />
                <FormInput
                  type="text"
                  name="lastName"
                  label="Last Name"
                  defaultValue={profile.lastName}
                />
                <FormInput
                  type="text"
                  name="username"
                  label="Username"
                  defaultValue={profile.username}
                />
              </div>
              <SubmitButton text="Save Changes" className="mt-8 w-full" />
            </FormContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
