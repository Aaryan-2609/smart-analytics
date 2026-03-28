import { Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer
      id="contact"
      className="py-16"
      style={{ backgroundColor: "#000000", color: "#FFFFFF" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img
                src={logo}
                alt="Xlense Analytics Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold" style={{ color: "#FFFFFF" }}>
                Xlense Analytics
              </span>
            </div>
            <p className="leading-relaxed" style={{ color: "#B0B0B0" }}>
              Transform your Excel data into stunning visualizations with our
              simple and powerful analytics tool.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: "#FFFFFF" }}>
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#features"
                  className="hover:opacity-80 transition-opacity"
                  style={{ color: "#B0B0B0" }}
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="hover:opacity-80 transition-opacity"
                  style={{ color: "#B0B0B0" }}
                >
                  About Us
                </a>
              </li>
              {/* You can uncomment these as you launch more features
              <li>
                <a href="#" className="hover:opacity-80" style={{ color: "#B0B0B0" }}>
                  Blog
                </a>
              </li>
              */}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: "#FFFFFF" }}>
              Contact Us
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4" style={{ color: "#9C4EFF" }} />
                <span style={{ color: "#B0B0B0" }}>
                  xlenseanalytics@gmail.com
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4" style={{ color: "#9C4EFF" }} />
                <span style={{ color: "#B0B0B0" }}>+91 9022652529</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4" style={{ color: "#9C4EFF" }} />
                <span style={{ color: "#B0B0B0" }}>India</span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-12 pt-8 text-center"
          style={{ borderTopColor: "#1E1E1E", borderTopWidth: "1px" }}
        >
          <p style={{ color: "#B0B0B0" }}>
            &copy; 2025 Xlense Analytics. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
