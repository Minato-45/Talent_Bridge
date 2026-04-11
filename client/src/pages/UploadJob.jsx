import { Link } from "react-router-dom";
import {
  HiBriefcase,
  HiArrowRight,
  HiCheckCircle,
  HiCurrencyDollar,
  HiGlobe,
  HiUsers,
} from "react-icons/hi";

const UploadJob = () => {
  return (
    <div>
      {/* Hero */}
      <section className="bg-dark text-white relative overflow-hidden">
        <div className="hero-pattern absolute inset-0"></div>
        <div className="absolute top-20 left-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1 mb-6">
              <HiBriefcase className="text-emerald-400" />
              <span className="text-emerald-400 text-xs font-medium">
                Post your job in minutes
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 leading-tight">
              Upload a <span className="text-emerald-400">job listing</span>
            </h1>
            <p className="text-base text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Reach millions of qualified candidates. Create your recruiter
              account and start posting jobs today — it only takes a few
              minutes.
            </p>
            <Link
              to="/register?role=employer"
              className="inline-flex items-center gap-2 bg-emerald-500 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
            >
              Create Recruiter Account <HiArrowRight />
            </Link>
            <p className="text-gray-500 text-sm mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-emerald-400 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">
            Why Post on TalentBridge?
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
            Get your job in front of the right candidates
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <HiGlobe className="text-2xl text-emerald-500" />,
                title: "Global Reach",
                desc: "Your listing reaches candidates worldwide across all time zones.",
              },
              {
                icon: <HiUsers className="text-2xl text-emerald-500" />,
                title: "3.5M+ Candidates",
                desc: "Access a massive pool of verified job seekers ready to apply.",
              },
              {
                icon: <HiCheckCircle className="text-2xl text-emerald-500" />,
                title: "Quality Applicants",
                desc: "Smart matching ensures only relevant candidates see your job.",
              },
              {
                icon: (
                  <HiCurrencyDollar className="text-2xl text-emerald-500" />
                ),
                title: "Free to Start",
                desc: "Post your first job listing at no cost. Upgrade anytime.",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-gray-50 rounded-xl p-6 text-center"
              >
                <div className="bg-emerald-50 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                  {icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How to Post a Job
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              {
                step: "1",
                title: "Create an Account",
                desc: "Sign up as a recruiter — it's quick and free.",
              },
              {
                step: "2",
                title: "Fill in Job Details",
                desc: "Add title, description, salary range, and required skills.",
              },
              {
                step: "3",
                title: "Publish & Hire",
                desc: "Your job goes live instantly. Review applicants from your dashboard.",
              },
            ].map(({ step, title, desc }) => (
              <div
                key={step}
                className="text-center"
              >
                <div className="bg-emerald-500 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                  {step}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Start hiring today
          </h2>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">
            Join 12,000+ companies that trust TalentBridge to find great talent.
          </p>
          <Link
            to="/register?role=employer"
            className="inline-flex items-center gap-2 bg-emerald-500 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
          >
            Get Started Free <HiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default UploadJob;
