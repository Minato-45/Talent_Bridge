import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiLocationMarker, HiCurrencyDollar, HiClock, HiBookmark, HiBriefcase } from 'react-icons/hi';

const avatarColors = ['bg-rose-500', 'bg-sky-500', 'bg-amber-500', 'bg-emerald-500', 'bg-violet-500', 'bg-pink-500', 'bg-teal-500', 'bg-indigo-500'];

const JobCard = ({ job }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    // Check if job is bookmarked
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setIsBookmarked(bookmarks.includes(job._id));
  }, [job._id]);

  const handleBookmark = (e) => {
    e.preventDefault();
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    if (bookmarks.includes(job._id)) {
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks.filter(id => id !== job._id)));
      setIsBookmarked(false);
    } else {
      bookmarks.push(job._id);
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      setIsBookmarked(true);
    }
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Not specified';
    const fmt = (n) => `$${(n / 1000).toFixed(0)}k`;
    if (min && max) return `${fmt(min)} - ${fmt(max)}`;
    if (min) return `From ${fmt(min)}`;
    return `Up to ${fmt(max)}`;
  };

  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    const days = Math.floor(diff / 86400);
    if (days === 1) return '1 day ago';
    if (days < 30) return `${days} days ago`;
    return new Date(date).toLocaleDateString();
  };

  const colorIdx = job._id ? job._id.charCodeAt(job._id.length - 1) % avatarColors.length : 0;
  const initial = (job.company || job.title || 'J')[0].toUpperCase();

  return (
    <Link to={`/jobs/${job._id}`} className="block group">
      <div className="bg-white/85 backdrop-blur-xl rounded-lg border border-white/40 p-4 hover:shadow-lg hover:border-emerald-300/60 transition-all duration-300 hover:scale-105 card-hover h-full hover:bg-white/95">
        <div className="flex items-start gap-3">
          {/* Avatar circle with gradient */}
          <div className={`${avatarColors[colorIdx]} w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0 shadow-lg group-hover:shadow-2xl group-hover:shadow-emerald-500/50 group-hover:scale-125 transition-all duration-300`}>
            {initial}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors duration-300 line-clamp-2 text-base">
                  {job.title}
                </h3>
                <p className="text-gray-600 text-xs mt-0.5 font-semibold">{job.company || 'Company'}</p>
              </div>
              <button 
                onClick={handleBookmark} 
                className={`transition-all duration-300 shrink-0 hover:scale-125 ${isBookmarked ? 'text-emerald-500' : 'text-gray-300 hover:text-emerald-500'}`}
              >
                <HiBookmark className="text-lg" fill={isBookmarked ? 'currentColor' : 'none'} />
              </button>
            </div>

            <p className="text-gray-600 text-xs line-clamp-2 mt-2 leading-relaxed font-medium">{job.description}</p>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
              {job.location && (
                <span className="flex items-center gap-1 text-gray-600 hover:text-emerald-600 transition-colors font-semibold">
                  <HiLocationMarker className="text-sm shrink-0" />
                  {job.location}
                </span>
              )}
              {job.salaryMin || job.salaryMax ? (
                <span className="flex items-center gap-1 text-gray-600 hover:text-emerald-600 transition-colors font-semibold">
                  <HiCurrencyDollar className="text-sm shrink-0" />
                  {formatSalary(job.salaryMin, job.salaryMax)}
                </span>
              ) : null}
              {job.jobType && (
                <span className="flex items-center gap-1 text-gray-600 font-semibold">
                  <HiBriefcase className="text-sm shrink-0" />
                  <span className="capitalize">{job.jobType}</span>
                </span>
              )}
              <span className="flex items-center gap-1 text-gray-500 text-xs italic ml-auto font-medium">
                <HiClock className="text-xs shrink-0" />
                {timeAgo(job.createdAt)}
              </span>
            </div>

            {/* Skills tags */}
            {job.skills && job.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {job.skills.slice(0, 3).map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center bg-emerald-50/70 backdrop-blur-sm text-emerald-700 px-2 py-0.5 rounded-full text-xs font-semibold hover:bg-emerald-100/80 transition-all duration-300 hover:shadow-lg"
                  >
                    {skill}
                  </span>
                ))}
                {job.skills.length > 3 && (
                  <span className="inline-flex items-center text-gray-600 text-xs font-semibold">
                    +{job.skills.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
