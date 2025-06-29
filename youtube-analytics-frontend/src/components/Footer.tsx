import {
  FaYoutube,
  FaDiscord,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0F1117] text-white px-6 md:px-16 py-12">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Brand & Mission */}
        <div className="col-span-1 md:col-span-2">
          <div className="text-3xl font-bold mb-4 flex items-center gap-1">
            <span className="text-white">YT</span>
            <span className="text-blue-400">Analytics</span>
          </div>
          <p className="text-sm text-gray-300">
            Our mission is to empower every video creator with the insights and
            inspiration they need to grow. That’s why we’re obsessed with
            providing an intelligent mix of technological and human expertise
            that boosts your productivity and gets you more views. Whatever your
            next challenge, we’ll shine a light on the way forward.
          </p>
          <p className="mt-6 text-sm text-gray-400">
            © {currentYear} YTAnalytics. All Rights Reserved.
          </p>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-semibold mb-2">Company</h4>
          <ul className="space-y-1 text-gray-400 text-sm">
            <li>Careers</li>
            <li>Testimonials</li>
            <li>Blog</li>
          </ul>
        </div>

        {/* Solutions for Creators */}
        <div>
          <h4 className="font-semibold mb-2">Solutions for Creators</h4>
          <ul className="space-y-1 text-gray-400 text-sm">
            <li>YTAnalytics Tools</li>
            <li>Browser Extension</li>
            <li>Top YouTube Channels</li>
            <li>Brand Solutions</li>
            <li>Agency Solutions</li>
            <li>MCN Solutions</li>
            <li>YTAnalytics Academy</li>
          </ul>
        </div>

        {/* Other */}
        <div>
          <h4 className="font-semibold mb-2">Other</h4>
          <ul className="space-y-1 text-gray-400 text-sm">
            <li>Terms</li>
            <li>Privacy</li>
            <li>Support</li>
            <li>How To Get More YouTube Views</li>
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h4 className="font-semibold mb-2">Connect with us</h4>
          <p className="text-sm text-gray-400 mb-2">
            Call Sales 888–998–YTAN (9826)
          </p>
          <div className="flex gap-4 items-center text-white text-xl">
            <FaYoutube />
            <FaDiscord />
            <FaFacebookF />
            <FaInstagram />
            <FaTwitter />
            <FaLinkedinIn />
          </div>
        </div>
      </div>

      {/* Language selection */}
      <div className="mt-12 border-t border-gray-700 pt-6 text-sm text-gray-400 flex flex-wrap gap-4 justify-center">
        <span>English</span>
        <span>Français</span>
        <span>Español</span>
        <span>Русский</span>
        <span>Português</span>
        <span>Türkçe</span>
        <span>Tiếng Việt</span>
      </div>
    </footer>
  );
}
