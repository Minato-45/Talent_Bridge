import { Link } from "react-router-dom";
import {
  HiArrowRight,
  HiHeart,
  HiGlobe,
  HiLightningBolt,
  HiShieldCheck,
  HiViewGrid,
} from "react-icons/hi";

const About = () => {
  return (
    <div>
      {/* Hero */}
      <section className="bg-dark text-white relative overflow-hidden">
        <div className="hero-pattern absolute inset-0"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 leading-tight">
              About <span className="text-emerald-400">TalentBridge</span>
            </h1>
            <p className="text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
              We're on a mission to connect talented professionals with the
              world's best companies. Making job search simple, transparent, and
              effective.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-emerald-50 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <HiHeart className="text-2xl text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Our Mission
            </h2>
            <p className="text-gray-500 leading-relaxed text-sm">
              At TalentBridge, we believe everyone deserves a fulfilling career.
              We built this platform to eliminate the friction in job searching
              and hiring — making it easier for seekers to find their dream
              roles and for recruiters to discover exceptional talent.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <HiShieldCheck className="text-2xl text-emerald-500" />,
                title: "Trust & Transparency",
                desc: "Every recruiter is verified. Every listing is real. We maintain the highest standards of quality and authenticity.",
              },
              {
                icon: <HiLightningBolt className="text-2xl text-emerald-500" />,
                title: "Speed & Simplicity",
                desc: "Apply to jobs in one click. Post listings in minutes. We remove unnecessary steps so you can focus on what matters.",
              },
              {
                icon: <HiGlobe className="text-2xl text-emerald-500" />,
                title: "Global Opportunity",
                desc: "We connect talent across borders. Whether on-site or remote, find opportunities that match your lifestyle.",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-xl p-6 border border-gray-100"
              >
                <div className="bg-emerald-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  {icon}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  {title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "12,000+", label: "Companies" },
              { value: "48,000+", label: "Active Jobs" },
              { value: "3.5M+", label: "Job Seekers" },
              { value: "150+", label: "Countries" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl font-bold text-emerald-500">{value}</p>
                <p className="text-gray-500 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team note */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-emerald-500 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-6">
              <HiViewGrid className="text-white text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Built with passion
            </h2>
            <p className="text-gray-500 leading-relaxed">
              TalentBridge was created to solve real problems in the job market.
              We're continuously improving the platform to serve job seekers and
              recruiters better, every single day.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Join the TalentBridge Community
          </h2>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">
            Whether you're looking for your next role or your next hire, we're
            here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register?role=jobseeker"
              className="bg-emerald-500 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              Find Jobs <HiArrowRight />
            </Link>
            <Link
              to="/register?role=employer"
              className="bg-dark text-white px-8 py-3.5 rounded-xl font-bold hover:bg-dark-light transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              Post a Job <HiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
