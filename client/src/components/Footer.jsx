import { Link } from "react-router-dom";
import { HiViewGrid, HiFacebook, HiMail, HiGlobeAlt } from "react-icons/hi";

const Footer = () => (
  <footer className="bg-linear-to-b from-slate-900/95 via-slate-900 to-slate-950 text-gray-300 pt-12 pb-8 mt-auto relative overflow-hidden backdrop-blur-sm border-t border-white/10">
    {/* Decorative background elements */}
    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl -z-10"></div>
    <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/8 rounded-full blur-3xl -z-10"></div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
        {/* Logo & tagline */}
        <div className="col-span-2 md:col-span-1">
          <Link
            to="/"
            className="flex items-center gap-2 mb-5 group"
          >
            <div className="bg-linear-to-br from-emerald-500 to-teal-600 w-10 h-10 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/50 group-hover:scale-125 transition-all duration-300">
              <HiViewGrid className="text-white text-lg font-black" />
            </div>
            <span className="text-white font-black text-lg">TalentBridge</span>
          </Link>
          <p className="text-sm leading-relaxed text-gray-400 font-medium">
            Connecting talent with opportunity. Your next career move starts here.
          </p>
          <div className="flex gap-3 mt-4">
            <a href="#" className="text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:scale-125 transform">
              <HiFacebook className="text-lg" />
            </a>
            <a href="#" className="text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:scale-125 transform">
              <HiMail className="text-lg" />
            </a>
            <a href="#" className="text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:scale-125 transform">
              <HiGlobeAlt className="text-lg" />
            </a>
          </div>
        </div>

        {/* For Job Seekers */}
        <div>
          <h4 className="text-white font-black mb-4 text-sm uppercase tracking-wide">
            For Job Seekers
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link
                to="/jobs"
                className="text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:translate-x-1 transform inline-block font-semibold"
              >
                Browse Jobs
              </Link>
            </li>
            <li>
              <Link
                to="/register?role=jobseeker"
                className="text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:translate-x-1 transform inline-block font-semibold"
              >
                Create Account
              </Link>
            </li>
            <li>
              <Link
                to="/jobs"
                className="text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:translate-x-1 transform inline-block font-semibold"
              >
                Job Alerts
              </Link>
            </li>
            <li>
              <Link
                to="/jobs"
                className="text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:translate-x-1 transform inline-block font-semibold"
              >
                Salary Guide
              </Link>
            </li>
          </ul>
        </div>

        {/* For Recruiters */}
        <div>
          <h4 className="text-white font-black mb-4 text-sm uppercase tracking-wide">
            For Recruiters
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link
                to="/register?role=employer"
                className="text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:translate-x-1 transform inline-block font-semibold"
              >
                Post a Job
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:translate-x-1 transform inline-block font-semibold"
              >
                Recruiter Login
              </Link>
            </li>
            <li>
              <Link
                to="/register?role=employer"
                className="text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:translate-x-1 transform inline-block font-semibold"
              >
                Pricing Plans
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:translate-x-1 transform inline-block font-semibold"
              >
                Find Talent
              </Link>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-white font-black mb-4 text-sm uppercase tracking-wide">Company</h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link
                to="/"
                className="text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:translate-x-1 transform inline-block font-semibold"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:translate-x-1 transform inline-block font-semibold"
              >
                Careers
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:translate-x-1 transform inline-block font-semibold"
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:translate-x-1 transform inline-block font-semibold"
              >
                Press
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white font-black mb-4 text-sm uppercase tracking-wide">Support</h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link
                to="/"
                className="text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:translate-x-1 transform inline-block font-semibold"
              >
                Help Center
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:translate-x-1 transform inline-block font-semibold"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:translate-x-1 transform inline-block font-semibold"
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <a
                href="mailto:support@talentbridge.com"
                className="text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:translate-x-1 transform inline-block font-semibold"
              >
                Contact Us
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer divider */}
      <div className="border-t border-gray-700/50 pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-400">
          <span className="font-semibold">
            &copy; {new Date().getFullYear()} TalentBridge. All rights reserved.
          </span>
          <span className="flex items-center gap-1 font-semibold">
            Built with <span className="text-emerald-400 text-lg">❤️</span> by Prash
          </span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;

          &copy; {new Date().getFullYear()} TalentBridge. All rights reserved.
        </span>
        <span>Built with ❤ by Prash</span>
      </div>
    </div>
  </footer>
);

export default Footer;
