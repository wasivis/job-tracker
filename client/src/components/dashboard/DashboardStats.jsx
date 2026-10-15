function DashboardStats({ applications }) {
  const stats = [
    {
      label: "Total Applications",
      value: applications.length,
      description: "Opportunities you're tracking",
      valueClass: "text-[#18372d]",
      markerClass: "bg-[#6d9275]",
      icon: "01",
    },
    {
      label: "Interviews",
      value: applications.filter(
        (application) => application.status === "Interview"
      ).length,
      description: "In the conversation",
      valueClass: "text-[#af7135]",
      markerClass: "bg-[#d4a06a]",
      icon: "02",
    },
    {
      label: "Offers",
      value: applications.filter(
        (application) => application.status === "Offer"
      ).length,
      description: "New possibilities",
      valueClass: "text-[#4d805e]",
      markerClass: "bg-[#82a88a]",
      icon: "03",
    },
    {
      label: "Rejections",
      value: applications.filter(
        (application) => application.status === "Rejected"
      ).length,
      description: "Part of the process",
      valueClass: "text-[#a16b68]",
      markerClass: "bg-[#c99590]",
      icon: "04",
    },
  ];

  return (
    <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="group relative overflow-hidden rounded-2xl border border-[#e5e9e1] bg-white p-5 shadow-[0_4px_18px_rgba(26,51,39,0.035)] transition duration-200 hover:-translate-y-0.5 hover:border-[#d1ddd0] hover:shadow-[0_12px_28px_rgba(26,51,39,0.08)] sm:p-6"
        >
          <div className={`absolute inset-y-0 left-0 w-1 ${stat.markerClass}`} />
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#617269]">{stat.label}</p>
            <span className="text-[11px] font-bold tracking-widest text-[#bec8bf]">
              {stat.icon}
            </span>
          </div>
          <p
            className={`mt-4 text-4xl font-bold tracking-tight ${stat.valueClass}`}
          >
            {stat.value}
          </p>
          <p className="mt-2 text-xs font-medium text-[#87958b]">
            {stat.description}
          </p>
        </div>
      ))}
    </section>
  );
}

export default DashboardStats;
