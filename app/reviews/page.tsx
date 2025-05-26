import EmptyList from "@/components/home/EmptyList";
import ReviewCard from "@/components/reviews/ReviewCard";
import Title from "@/components/properties/Title";
import { IconButton } from "@/components/form/Buttons";
import { deleteReviewAction, fetchPropertyReviewsByUser } from "@/utils/action";
import FormContainer from "@/components/form/formcontanier";
import { FaStar } from "react-icons/fa";

async function ReviewsPage() {
  const reviews = await fetchPropertyReviewsByUser();
  if (reviews.length === 0) return <EmptyList />;

  return (
    <section className="min-h-screen px-4 md:px-8 py-12 ">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <FaStar className="text-yellow-500" />
            Your Reviews
          </h1>
        
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => {
            const { comment, rating } = review;
            const { name, image } = review.property;
            const reviewInfo = {
              comment,
              rating,
              name,
              image,
            };

            return (
              <div
                key={review.id}
                className="transition-transform duration-200 transform hover:-translate-y-1"
              >
                <ReviewCard reviewInfo={reviewInfo}>
                  <DeleteReview reviewId={review.id} />
                </ReviewCard>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const DeleteReview = ({ reviewId }: { reviewId: string }) => {
  const deleteReview = deleteReviewAction.bind(null, { reviewId });
  return (
    <FormContainer action={deleteReview}>
      <IconButton actionType="delete" />
    </FormContainer>
  );
};

export default ReviewsPage;
