import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css/sea-green";
import { useEffect, useState } from "react";

interface Review {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  stars: number;
}

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetch("/reviews.json")
      .then((response) => response.json())
      .then((data) => setReviews(data))
      .catch((error) => console.error("Error fetching reviews data:", error));
  }, []);

  return (
    <section className="bg-greenGradient text-[#3C3C43] pt-8 pb-3" id="reviews">
      {/* phones */}
      <div className="sm:hidden mx-auto max-w-[1648px]">
        <Splide
          aria-label="My Favorite Images"
          options={{
            rewind: true,
            gap: "1rem",
            perPage: 1,
          }}
        >
          {reviews.map((review) => (
            <SplideSlide>
              <div
                className="py-[16px] px-[24px] bg-white rounded-[20px] shadow-lg"
                key={review.id}
              >
                <div className="flex flex-col leading-6">
                  <p className="text-[19px] font-semibold">{review.title}</p>
                  <p className="text-[19px] font-semibold">{review.subtitle}</p>
                </div>
                <p className="mt-4 text-[16px] leading-5">
                  {review.description}
                </p>
                <h3 className="mt-2 xl:text-2xl">
                  {`⭐`.repeat(review.stars)}
                </h3>
              </div>
              <div className="splide__arrows hidden" />
            </SplideSlide>
          ))}
        </Splide>
      </div>

      {/* tablets */}
      <div className="hidden sm:block px-10 sm:mx-auto xl:hidden max-w-[1648px]">
        <Splide
          aria-label="My Favorite Images"
          options={{
            rewind: true,
            gap: "1rem",
            perPage: 2,
          }}
        >
          {reviews.map((review) => (
            <SplideSlide>
              <div
                className="py-[16px] px-[24px] bg-white rounded-[20px] shadow-lg"
                key={review.id}
              >
                <div className="flex flex-col leading-6">
                  <p className="text-[19px] font-semibold">{review.title}</p>
                  <p className="text-[19px] font-semibold">{review.subtitle}</p>
                </div>
                <p className="mt-4 text-[16px] leading-5">
                  {review.description}
                </p>
                <h3 className="mt-2 xl:text-2xl">
                  {`⭐`.repeat(review.stars)}
                </h3>
              </div>
              <div className="splide__arrows hidden" />
            </SplideSlide>
          ))}
        </Splide>
      </div>

      {/* laptops */}
      <div className="hidden xl:block xl:w-full xl:mx-auto px-[77px] max-w-[1700px]">
        <Splide
          aria-label="My Favorite Images"
          options={{
            rewind: true,
            gap: "1.5rem",
            perPage: 5,
          }}
        >
          {reviews.map((review) => (
            <SplideSlide>
              <div
                className="py-[20px] px-[25px] 2xl:px-[35px] bg-white rounded-[20px] shadow-lg pb-10"
                key={review.id}
              >
                <div className="flex flex-col leading-6">
                  <p className="text-[19px] font-semibold">{review.title}</p>
                  <p className="text-[19px] font-semibold">{review.subtitle}</p>
                </div>
                <p className="mt-4 text-[16px] leading-5">
                  {review.description}
                </p>
                <h3 className="mt-2 xl:text-2xl 2xl:text-3xl">
                  {`⭐`.repeat(review.stars)}
                </h3>
              </div>
              <div className="splide__arrows hidden" />
            </SplideSlide>
          ))}
        </Splide>
      </div>
    </section>
  );
};

export default Reviews;
