"use-sever"
import { readFile,writeFile } from "fs/promises";

import { redirect } from "next/navigation";


type User={
    
    id: string,
    firstName : string,
    lastName : string,
}
export  const createUser = async (formData:FormData) => {

    'use server';
    console.log('creating user....');
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    
    const newUser :User = {firstName,lastName,id:Date.now().toString()};
    console.log(newUser);
    
    try {
        await saveUsers(newUser);
        
        // revalidatePath('/actions')
      
        // some logic
        console.log("user createSuc");
        
      } catch (error) {
        console.log(error);
        return 'failed to create user...';
      }
    redirect('/')
     
  };

export const fetchUsers = async (): Promise<User[]> => {
    const result = await readFile('userAction.json', { encoding: 'utf8' });
    const users = result ? JSON.parse(result) : [];
    return users;
  };
const saveUsers = async (user:User) =>{
    const users = await fetchUsers();
  users.push(user);
  await writeFile('userAction.json', JSON.stringify(users));
 
}
