export type actionFunction = (
    prevState: any,
    formData: FormData
  ) => Promise<{ message: string }>;

export type PropertyCardProps = {
    image: string;
    id: string;
    name: string;
    tagline: string;
    country: string;
    price: number;
  };
export  interface Message {
  id: number;
  username: string;
  message: string;
  inserted_at: string;
 
}
export type MessageProps = {
  username: string;
  message: string;
};
