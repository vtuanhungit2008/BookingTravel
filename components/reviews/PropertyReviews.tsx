import Title from '@/components/properties/Title';
import { fetchPropertyReviews } from '@/utils/action';
import ReviewCard from './ReviewCard';

type Props = {
  propertyId: string;
};

export default async function PropertyReviews({ propertyId }: Props) {
  const reviews = await fetchPropertyReviews(propertyId);
  if (!reviews.length) return null;

  return (
    <div className="mt-8">
      <Title text="Reviews" />
      <div className="grid md:grid-cols-2 gap-8 mt-4">
        {reviews.map((review) => {
          const { comment, rating } = review;
          const { firstName, profileImage } = review.profile;
          return (
            <ReviewCard
              key={review.id}
              reviewInfo={{
                comment,
                rating,
                name: firstName,
                image: profileImage,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
