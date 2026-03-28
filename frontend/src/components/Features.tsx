import { Card, CardContent } from "@/components/ui/card";
import {
  Upload,
  BarChart3,
  Layers3,
  Download,
  Shield,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Upload,
    title: "Easy Upload",
    description:
      "Simply drag and drop your Excel files or browse to upload. Supports .xlsx, .xls, and .csv formats.",
    color: "#1D4ED8",
  },
  {
    icon: BarChart3,
    title: "2D Visualizations",
    description:
      "Create stunning bar charts, line graphs, pie charts, and scatter plots with just a few clicks.",
    color: "#0EA5E9",
  },
  {
    icon: Layers3,
    title: "3D Charts",
    description:
      "Transform your data into immersive 3D visualizations for deeper insights and presentations.",
    color: "#7015e6ff",
  },
  {
    icon: Download,
    title: "Export Options",
    description:
      "Download your charts in various formats including PNG, PDF, SVG, and PowerPoint slides.",
    color: "#6366F1",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your data is encrypted and secure. We never store your files permanently on our servers.",
    color: "#334155",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Generate charts in seconds, not minutes. Our optimized engine handles large datasets effortlessly.",
    color: "#7010ffff",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4 text-gray-800">
            Powerful Features for{" "}
            <motion.span
              className="block text-gray-600"
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{ color: "#9c4eff" }}
            >
              Better Data Insights
            </motion.span>
          </h2>
          <p className="text-xl max-w-3xl mx-auto text-gray-600">
            Everything you need to transform your Excel data into compelling
            visualizations that tell your story.
          </p>
        </motion.div>

        {/* Features Grid - Grid on all screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gray-50 hover:shadow-lg transition duration-300 h-full border-0">
                <CardContent className="p-8 h-full flex flex-col justify-start">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-6"
                    style={{ backgroundColor: feature.color }}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
