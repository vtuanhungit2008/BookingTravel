"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import FormContainer from "../form/formcontanier";
import { createReviewAction } from "@/utils/action";
import RatingInput from "../form/RatingInput";
import TextAreaInput from "../form/textareainput";
import { SubmitButton } from "../form/submitbtn";

function SubmitReview({ propertyId }: { propertyId: string }) {
  const [isReviewFormVisible, setIsReviewFormVisible] = useState(false);
  return (
    <div className="mt-8">
      <Button onClick={() => setIsReviewFormVisible((prev) => !prev)}>
        Leave a Review
      </Button>
      {isReviewFormVisible && (
        <Card className="p-8 mt-8">
          <FormContainer action={createReviewAction}>
            <input type="hidden" name="propertyId" value={propertyId} />
            <RatingInput name="rating" />

            <TextAreaInput
              name="comment"
              labelText="your thoughts on this property"
              defaultValue="Amazing place !!!"
            />
            <SubmitButton text="Submit" className="mt-4" />
          </FormContainer>
        </Card>
      )}
    </div>
  );
}

export default SubmitReview;