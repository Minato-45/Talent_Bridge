import { HiCheckCircle, HiXCircle, HiClock, HiStar } from "react-icons/hi";

const StatusBadge = ({ status, size = "md" }) => {
  const statusStyles = {
    shortlisted: {
      bg: "bg-blue-100/70 backdrop-blur-sm border border-blue-300/30",
      text: "text-blue-700",
      icon: HiStar,
      label: "Shortlisted",
    },
    rejected: {
      bg: "bg-red-100/70 backdrop-blur-sm border border-red-300/30",
      text: "text-red-700",
      icon: HiXCircle,
      label: "Rejected",
    },
    pending: {
      bg: "bg-yellow-100/70 backdrop-blur-sm border border-yellow-300/30",
      text: "text-yellow-700",
      icon: HiClock,
      label: "Pending",
    },
    accepted: {
      bg: "bg-green-100/70 backdrop-blur-sm border border-green-300/30",
      text: "text-green-700",
      icon: HiCheckCircle,
      label: "Accepted",
    },
  };

  const style = statusStyles[status] || statusStyles.pending;
  const Icon = style.icon;

  const sizeStyles = {
    sm: "px-2.5 py-1 text-xs gap-1 font-semibold",
    md: "px-3 py-1.5 text-sm gap-1.5 font-bold",
    lg: "px-4 py-2 text-base gap-2 font-bold",
  };

  return (
    <span
      className={`inline-flex items-center ${sizeStyles[size]} rounded-full shadow-md hover:shadow-lg transition-all duration-300 ${style.bg} ${style.text}`}
    >
      <Icon className="shrink-0 text-base" />
      {style.label}
    </span>
  );
};

export default StatusBadge;
