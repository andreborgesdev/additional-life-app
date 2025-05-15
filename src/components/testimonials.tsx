import Image from "next/image";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/public/avatar.png",
    text: "I've been able to declutter my home while helping others find items they need. The platform is so easy to use!",
    location: "Portland, OR",
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "/public/avatar.png",
    text: "As a college student on a budget, Additional Life has been a game-changer. I've furnished my entire apartment for free!",
    location: "Boston, MA",
  },
  {
    id: 3,
    name: "Priya Patel",
    avatar: "/public/avatar.png",
    text: "I love the community aspect. I've met wonderful people in my neighborhood through exchanging items.",
    location: "Austin, TX",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-green-800 dark:text-green-100 text-center mb-12">
          What Our Community Says
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md relative"
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div className="rounded-full border-4 border-white dark:border-gray-800 overflow-hidden">
                  <Image
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                </div>
              </div>
              <div className="pt-8 text-center">
                <p className="text-gray-700 dark:text-gray-300 italic mb-4">
                  "{testimonial.text}"
                </p>
                <p className="font-semibold text-green-700 dark:text-green-300">
                  {testimonial.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {testimonial.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
