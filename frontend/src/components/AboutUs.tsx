import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Award, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

type Value = {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
};

const AboutUs = () => {
  const values: Value[] = [
    {
      icon: Users,
      title: "User-Centric",
      description:
        "We design every feature with our users in mind, making data visualization accessible to everyone.",
      color: "#7C3AED",
    },
    {
      icon: Target,
      title: "Innovation",
      description:
        "Constantly pushing boundaries to bring you the latest in data visualization technology.",
      color: "#3B82F6",
    },
    {
      icon: Award,
      title: "Excellence",
      description:
        "Committed to delivering the highest quality tools and exceptional user experience.",
      color: "#06B6D4",
    },
    {
      icon: Lightbulb,
      title: "Simplicity",
      description:
        "Complex data visualization made simple - that's our core philosophy.",
      color: "#8B5CF6",
    },
  ];

  return (
    <section
      id="about"
      className="py-20"
      style={{ backgroundColor: "#000000" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4" style={{ color: "#FFFFFF" }}>
            About <span style={{ color: "#9C4EFF" }}>Simple Analytics</span>
          </h2>
          <p
            className="text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ color: "#B0B0B0" }}
          >
            We're on a mission to democratize data visualization. Simple
            Analytics makes it easy for anyone to transform spreadsheet data
            into compelling visual stories.
          </p>
        </motion.div>

        {/* Info Block */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-bold" style={{ color: "#FFFFFF" }}>
              Making Data Beautiful and Accessible
            </h3>
            <p className="leading-relaxed" style={{ color: "#B0B0B0" }}>
              We believe that everyone should be able to create stunning data
              visualizations, regardless of their technical background. Our
              platform bridges the gap between complex data and clear insights.
            </p>
            <p className="leading-relaxed" style={{ color: "#B0B0B0" }}>
              With over 5,000 charts generated we're proud to be at the
              forefront of the data visualization revolution.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="rounded-2xl p-8"
            style={{ backgroundColor: "#1E1E1E" }}
          >
            <div className="grid grid-cols-2 gap-6 text-center">
              {[
                ["10K+", "#7C3AED", "Visualizations Rendered"],
                ["5K+", "#06B6D4", "Charts Built"],
                ["99.9%", "#3B82F6", "Uptime"],
                ["24/7", "#8B5CF6", "Support"],
              ].map(([stat, color, label], i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="transition-transform"
                >
                  <div
                    className="text-3xl font-bold mb-2"
                    style={{ color: color as string }}
                  >
                    {stat}
                  </div>
                  <div style={{ color: "#B0B0B0" }}>{label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Core Values Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: { transition: { staggerChildren: 0.15 } },
            hidden: {},
          }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5 }}
              >
                <Card
                  className="text-center border-0 h-full flex flex-col hover:shadow-2xl transition-shadow duration-300 hover:scale-[1.03]"
                  style={{ backgroundColor: "#F5F5F7" }}
                >
                  <CardContent className="p-6 flex flex-col justify-between grow">
                    <div
                      className="w-12 h-12 rounded-md flex items-center justify-center mx-auto mb-4"
                      style={{ backgroundColor: value.color }}
                    >
                      <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                    </div>
                    <h4
                      className="font-semibold mb-2"
                      style={{ color: "#000000" }}
                    >
                      {value.title}
                    </h4>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "#6B6B6B" }}
                    >
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;
