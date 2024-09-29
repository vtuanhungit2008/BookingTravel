import AmenitiesInput from "@/components/form/amenitiesinput";
import CategoriesInput from "@/components/form/categories";
import CountriesInput from "@/components/form/contriesinput";
import CounterInput from "@/components/form/counterinput";
import FormContainer from "@/components/form/formcontanier";
import ImageInput from "@/components/form/imageinput";
import FormInput from "@/components/form/input";
import PriceInput from "@/components/form/priceinput";
import { SubmitButton } from "@/components/form/submitbtn";
import TextAreaInput from "@/components/form/textareainput";
import { createPropertyAction } from "@/utils/action";

function CreateProperty() {
  return (
    <section>
      <h1 className='text-2xl font-semibold mb-8 capitalize'>
        create property
      </h1>
      <div className='border p-8 rounded-md'>
        <h3 className='text-lg mb-4 font-medium'>General Info</h3>
        <FormContainer action={createPropertyAction}>
          <div className='grid md:grid-cols-2 gap-8 mb-4'>
            <FormInput
              name='name'
              type='text'
              label='Name (20 limit)'
              defaultValue='Cabin in Latvia'
            />
            <FormInput
              name='tagline'
              type='text '
              label='Tagline (30 limit)'
              defaultValue='Dream Getaway Awaits You Here!'
            />
      
            <PriceInput/>
            <CategoriesInput/>
            
         
          </div>
          <div className='grid sm:grid-cols-2 gap-8 mt-4'>
          <CountriesInput />
           <ImageInput />
          </div>
          <>
          <h3 className='text-lg mt-8 mb-4 font-medium'>Accommodation Details</h3>
          <CounterInput detail='guests' />
          <CounterInput detail='bedrooms' />
          <CounterInput detail='beds' />
          <CounterInput detail='baths' />
           </>
           <>
          <h3 className='text-lg mt-10 mb-6 font-medium'>Amenities</h3>
           <AmenitiesInput />
           </>
           
           <TextAreaInput name='description' labelText='Description (10 - 1000 Words)' />
           
          
          <SubmitButton text='create rental' className='mt-12' />
        </FormContainer>
      </div>
    </section>
  );
}
export default CreateProperty;