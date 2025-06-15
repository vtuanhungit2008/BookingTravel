'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import FormContainer from '../form/formcontanier';
import { createReviewAction } from '@/utils/action';
import RatingInput from '../form/RatingInput';
import TextAreaInput from '../form/textareainput';
import { SubmitButton } from '../form/submitbtn';

type Props = {
  propertyId: string;
  hasReviewed?: boolean; // Truyền từ server nếu có
};

export default function SubmitReview({ propertyId, hasReviewed }: Props) {
  const [showForm, setShowForm] = useState(false);

  if (hasReviewed) return null;

  return (
    <div className="mt-8">
      <Button onClick={() => setShowForm((prev) => !prev)}>
        Leave a Review
      </Button>

      {showForm && (
        <Card className="p-8 mt-8">
          <FormContainer action={createReviewAction}>
            <input type="hidden" name="propertyId" value={propertyId} />
            <RatingInput name="rating" />
            <TextAreaInput
              name="comment"
              labelText="Your thoughts on this property"
              defaultValue=""
            />
            <SubmitButton text="Submit" className="mt-4" />
          </FormContainer>
        </Card>
      )}
    </div>
  );
}
