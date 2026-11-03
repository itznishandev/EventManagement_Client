"use client";

import { FiMapPin, FiCamera } from "react-icons/fi";

const GALLERY_ITEMS = [
  {
    id: 1,
    title: "Winter Blanket & Warm Clothing Dispatch",
    location: "Mirpur 10 & Mohammadpur, Dhaka",
    category: "Winter Relief",
    volunteers: "68 Volunteers",
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    title: "Dhanmondi Lake Shoreline Plastic Recovery",
    location: "Rabindra Sarobar, Dhaka",
    category: "Cleanup Drive",
    volunteers: "52 Volunteers",
    image:
      "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    title: "Monsoon Sapling & Urban Canopy Initiative",
    location: "Uttara Sector 7, Dhaka",
    category: "Tree Plantation",
    volunteers: "74 Volunteers",
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    title: "Free Community Vision & Diabetes Screening",
    location: "Korail Bosti, Banani, Dhaka",
    category: "Medical Camp",
    volunteers: "39 Volunteers",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    title: "Open-Air Evening School Stationery Drive",
    location: "TSC, Dhaka University",
    category: "Education",
    volunteers: "61 Volunteers",
    image:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    title: "Buriganga Riverbank Waste Sorting Collective",
    location: "Sadarghat, Old Dhaka",
    category: "Cleanup Drive",
    volunteers: "45 Volunteers",
    image:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=900&q=80",
  },
];

export default function GallerySection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-uddog">
        {/* Consistent Section Header */}
        <div className="max-w-2xl space-y-3 mb-12">
          <span className="section-eyebrow">
            <FiCamera className="w-3.5 h-3.5" />
            <span>Field Archive</span>
          </span>
          <h2 className="section-heading">
            Snapshots from Recent Community Drives
          </h2>
          <p className="section-subtitle">
            Every photograph captures real volunteer teams working across
            neighbourhoods in Dhaka and regional districts.
          </p>
        </div>

        {/* Equal Image Size 3-Column Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_ITEMS.map((item) => (
            <figure
              key={item.id}
              className="uddog-card overflow-hidden group h-full flex flex-col justify-between"
            >
              <div className="relative h-60 w-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3.5 left-3.5">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0f5338] text-white shadow-sm">
                    {item.category}
                  </span>
                </div>
                <div className="absolute bottom-3.5 right-3.5">
                  <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-black/70 text-white backdrop-blur-sm">
                    {item.volunteers}
                  </span>
                </div>
              </div>

              <figcaption className="p-5 space-y-1.5">
                <h3
                  className="text-base font-extrabold leading-snug"
                  style={{ color: "var(--text-primary)" }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-xs font-medium flex items-center gap-1.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <FiMapPin className="w-3.5 h-3.5 text-[#0f5338] shrink-0" />
                  <span>{item.location}</span>
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
