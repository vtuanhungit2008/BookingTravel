import FormContainer from "@/components/form/formcontanier";
import ImageInputContainer from "@/components/form/imageinputcontainer";
import FormInput from "@/components/form/input";
import { SubmitButton } from "@/components/form/submitbtn";
import { fetchProfile, updateProfileAction, updateProfileImageAction } from "@/utils/action";

async function ProfilePage() {
  const profile = await fetchProfile();

  return (
    <section>
      <h1 className='text-2xl font-semibold mb-8 capitalize'>user profile</h1>
      <div className='border p-8 rounded-md'>
        
      <ImageInputContainer
      image={profile.profileImage}
      name={profile.username}
      action={updateProfileImageAction}
      text='Update Profile Image' />

        <FormContainer action={updateProfileAction}>
          <div className='grid gap-4 md:grid-cols-2 mt-4 '>
            <FormInput
              type='text'
              name='firstName'
              label='First Name'
              defaultValue={profile.firstName}
            />
            <FormInput
              type='text'
              name='lastName'
              label='Last Name'
              defaultValue={profile.lastName}
            />
            <FormInput
              type='text'
              name='username'
              label='Username'
              defaultValue={profile.username}
            />
          </div>
          <SubmitButton text='Update Profile' className='mt-8' />
          
        </FormContainer>
       
      </div>
    </section>
  );
}
export default ProfilePage;