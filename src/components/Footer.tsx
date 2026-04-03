import { Leaf, Mail, Users, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import sihLogo from "@/assets/sih.png";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="h-8 w-8 text-accent" />
              <span className="text-2xl font-bold">Green & Clean</span>
            </div>
            <p className="text-primary-foreground/80 mb-4 max-w-md">
              Smart Web-Based Waste Reporting & Reward System for a cleaner, greener future. 
              Join us in making waste management smarter and more efficient.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span className="text-sm">Team: Green & Clean</span>
              </div>
              <div className="flex items-center space-x-2">
                <img src={sihLogo} alt="SIH Logo" className="h-5 w-auto" />
                <span className="text-sm">SIH 2025</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-primary-foreground/80 hover:text-accent transition-colors">Home</a></li>
              <li><a href="/report" className="text-primary-foreground/80 hover:text-accent transition-colors">Report Waste</a></li>
              <li><a href="/wallet" className="text-primary-foreground/80 hover:text-accent transition-colors">Green Wallet</a></li>
              <li><a href="/dashboard" className="text-primary-foreground/80 hover:text-accent transition-colors">Dashboard</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <a 
                href="mailto:hackathon@greenandclean.in" 
                className="text-primary-foreground/80 hover:text-accent transition-colors"
              >
                hackathon@greenandclean.in
              </a>
            </div>

            {/* Donate Items Button added just below Contact */}
            <div className="mt-6">
              <Link to="/donate">
                <Button variant="eco" size="sm" className="w-full">
                  Donate Items
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-primary-foreground/60">
            © 2025 Green & Clean. Built for Smart India Hackathon 2025. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
