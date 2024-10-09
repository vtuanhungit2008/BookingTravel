'use client'

import { useFormStatus } from "react-dom";
import { LuTrash2, LuPenSquare } from "react-icons/lu";
import { Button } from "../ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

type actionType = "edit" | "delete";
export const IconButton = ({ actionType }: { actionType: actionType }) => {
  const { pending } = useFormStatus();

  const renderIcon = () => {
    switch (actionType) {
      case "edit":
        return <LuPenSquare />;
      case "delete":
        return <LuTrash2 />;
      default:
        const never: never = actionType;
        throw new Error(`Invalid action type: ${never}`);
    }
  };

  return (
    <Button
      type="submit"
      size="icon"
      variant="link"
      className="p-2 cursor-pointer"
    >
      {pending ? <ReloadIcon className=" animate-spin" /> : renderIcon()}
    </Button>
  );
};