import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Shruti Vishwakarma",
      role: "Frontend Developer",
      content:
        "Xlense Analytics has revolutionized how we present data to stakeholders. The 3D charts are absolutely stunning!",
      rating: 5,
      avatar: "SV",
      color: "#7C3AED",
    },
    {
      name: "Ankush Kumar",
      role: "Backend Developer",
      content:
        "I used to spend hours creating charts manually. Now I can generate beautiful visualizations in minutes.",
      rating: 5,
      avatar: "AK",
      color: "#3B82F6",
    },
    {
      name: "Aaryan Kamdar",
      role: "Backend Developer and Database Manager",
      content:
        "The ease of use is incredible. My team loves how quickly we can turn spreadsheets into compelling presentations.",
      rating: 5,
      avatar: "AK",
      color: "#06B6D4",
    },
    {
      name: "Aniket",
      role: "Frontend Developer",
      content:
        "This platform is a game-changer! The insights I can pull from simple Excel sheets are beyond impressive.",
      rating: 5,
      avatar: "A",
      color: "#3B82F6",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Animated Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-4xl font-bold mb-4 text-black"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Big Impact
          </motion.h2>

          <motion.p
            className="text-xl text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            See what our users are saying about Xlense Analytics
          </motion.p>
        </motion.div>

        {/* Grid Cards – No Horizontal Scroll */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-[#F5F5F7] h-full">
                <CardContent className="p-8 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-current"
                          style={{ color: testimonial.color }}
                        />
                      ))}
                    </div>
                    <p className="mb-6 leading-relaxed text-gray-600">
                      "{testimonial.content}"
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold mr-4"
                      style={{ backgroundColor: testimonial.color }}
                    >
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-black">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
