import { Link } from "react-router-dom";
import {
  HiUsers,
  HiSearch,
  HiClipboardCheck,
  HiChat,
  HiArrowRight,
  HiStar,
  HiShieldCheck,
  HiLightningBolt,
} from "react-icons/hi";

const FindTalent = () => {
  return (
    <div>
      {/* Hero */}
      <section className="bg-dark text-white relative overflow-hidden">
        <div className="hero-pattern absolute inset-0"></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1 mb-6">
              <HiUsers className="text-emerald-400" />
              <span className="text-emerald-400 text-xs font-medium">
                Hire top talent faster
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 leading-tight">
              Find the{" "}
              <span className="text-emerald-400">perfect candidate</span>
            </h1>
            <p className="text-base text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Access a pool of 3.5M+ verified professionals. Post your job and
              start receiving quality applications within hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register?role=employer"
                className="bg-emerald-500 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                Start Hiring <HiArrowRight />
              </Link>
              <Link
                to="/jobs"
                className="bg-white/10 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-white/20 transition-colors flex items-center justify-center gap-2 border border-white/10"
              >
                Browse Talent
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">
            How It Works
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
            Three simple steps to find your next great hire
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <HiClipboardCheck className="text-3xl text-emerald-500" />
                ),
                step: "01",
                title: "Post a Job",
                desc: "Create a detailed job listing in minutes. Specify skills, experience, and compensation.",
              },
              {
                icon: <HiSearch className="text-3xl text-emerald-500" />,
                step: "02",
                title: "Review Applicants",
                desc: "Browse through qualified candidates. Filter by skills, experience, and availability.",
              },
              {
                icon: <HiChat className="text-3xl text-emerald-500" />,
                step: "03",
                title: "Hire the Best",
                desc: "Connect with top candidates, schedule interviews, and make your offer.",
              },
            ].map(({ icon, step, title, desc }) => (
              <div
                key={step}
                className="text-center"
              >
                <div className="bg-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {icon}
                </div>
                <span className="text-emerald-500 text-sm font-bold">
                  Step {step}
                </span>
                <h3 className="font-bold text-gray-900 text-lg mt-1 mb-2">
                  {title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              {
                icon: <HiStar className="text-2xl text-emerald-500" />,
                value: "92%",
                label: "Recruiter satisfaction rate",
              },
              {
                icon: <HiLightningBolt className="text-2xl text-emerald-500" />,
                value: "48hrs",
                label: "Average time to first applicant",
              },
              {
                icon: <HiShieldCheck className="text-2xl text-emerald-500" />,
                value: "12,000+",
                label: "Companies trust TalentBridge",
              },
            ].map(({ icon, value, label }) => (
              <div key={label}>
                <div className="flex justify-center mb-2">{icon}</div>
                <p className="text-3xl font-bold text-gray-900">{value}</p>
                <p className="text-gray-500 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Ready to find your next hire?
          </h2>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">
            Create your recruiter account and post your first job for free.
          </p>
          <Link
            to="/register?role=employer"
            className="inline-flex items-center gap-2 bg-emerald-500 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
          >
            Get Started <HiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default FindTalent;
