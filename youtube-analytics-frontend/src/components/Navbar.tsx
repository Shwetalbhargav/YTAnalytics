import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const dropdownItems = {
  Features: ["Daily Ideas", "Keyword Tools", "Competitors Tools", "Thumbnail Generator", "Channel Audit Tool"],
  "AI Tools": [
    "ChatGPT for YouTubers",
    "YouTube Title Generator",
    "Channel Name Generator",
    "Content Generator",
    "YouTube Video Ideas",
    "YouTube Tag Generator",
    "Keyword Generator",
    "Video Script Generator",
    "YouTube Description Generator"
  ],
  "Top YouTube Channels": {
    "YouTube Top Charts": ["Top 50 YouTube Channels", "Top 100 YouTube Channels", "Top 500 YouTube Channels"],
    "Top 100 Channels by Country": [
      "United States", "United Kingdom", "Canada", "India", "Brazil", "Germany",
      "Australia", "Japan", "Spain", "France", "Turkey", "Philippines"
    ],
    "Top 100 Channels by Category": [
      "Autos & Vehicles", "Education", "Entertainment", "Food", "Gaming",
      "Lifestyle", "Music", "News & Politics", "Pets & Animals", "Sports",
      "Technology", "Travel"
    ]
  },
  Blog: ["Views", "Monetization", "Subscribers", "Analytics", "All Tips & Insights"]
};

export default function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navigate = useNavigate();
  const toggleDropdown = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  const renderDropdown = (label: string) => {
    const items = dropdownItems[label];
    if (!items) return null;

    const baseClasses = "absolute top-full mt-2 bg-[#1A1C23] shadow-lg rounded p-6 text-white text-sm";

    if (typeof items[0] === "string") {
      return (
        <div className={`${baseClasses} w-64`}>
          {(items as string[]).map((item) => (
            <div key={item} className="py-1 hover:text-blue-400 cursor-pointer transition">{item}</div>
          ))}
        </div>
      );
    } else {
      return (
        <div className={`${baseClasses} w-[960px] grid grid-cols-3 gap-8`}>
          {Object.entries(items as Record<string, string[]>).map(([section, links]) => (
            <div key={section}>
              <div className="text-white font-semibold mb-2 border-b border-gray-700 pb-1">{section}</div>
              {links.map((link) => (
                <div key={link} className="py-1 text-gray-300 hover:text-blue-400 cursor-pointer transition">{link}</div>
              ))}
            </div>
          ))}
        </div>
      );
    }
  };

  const navItems = ["Features", "AI Tools", "Top YouTube Channels", "Coaching", "Extension", "Blog", "Pricing"];

  return (
    <nav className="sticky top-0 left-0 w-full z-50 bg-[#0F1117] text-white shadow-md h-20 flex items-center px-10">
      <div className="text-2xl font-bold flex items-center gap-1">
        <span className="text-white">YT</span><span className="text-blue-400">Analytics</span>
      </div>
      <ul className="flex gap-8 items-center ml-auto relative font-medium">
        {navItems.map((label) => (
          <li
            key={label}
            onMouseEnter={() => toggleDropdown(label)}
            onMouseLeave={() => toggleDropdown('')}
            className="relative cursor-pointer flex items-center gap-1 hover:text-blue-400 transition"
          >
            {label}
            {dropdownItems[label] && <ChevronDown size={14} />}
            {activeDropdown === label && renderDropdown(label)}
          </li>
        ))}
        <li>
          <button
            onClick={() => navigate('/LoginPage')} 
            className="bg-[#1DA1F2] hover:bg-[#0d8ae8] text-white px-5 py-2 rounded-full font-semibold transition ml-4"
          >
            Login
          </button>
        </li>
      </ul>
    </nav>
  );
}
