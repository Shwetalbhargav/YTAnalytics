import { Player } from '@lottiefiles/react-lottie-player';
import youtubeGif from '../assets/Youtube Logo GIF.gif'; // Importing the GIF

export default function HeroSection() {
  return (
    <section className="pt-32 px-6 bg-gray-50 flex flex-col md:flex-row items-center justify-between">
      <div className="max-w-lg">
        <h1 className="text-4xl font-bold mb-4">
          Boost Your YouTube Strategy with Smart Analytics
        </h1>
        <p className="mb-6 text-lg text-gray-600">
          Get insights, track performance, and beat your competition with real-time video intelligence.
        </p>
        <button className="px-6 py-3 bg-orange-600 text-white rounded shadow hover:bg-orange-700">
          Get Started
        </button>
      </div>

      {/* GIF displayed as looping animation via Lottie Player */}
      <div className="w-full md:w-1/2">
        <Player autoplay loop src={youtubeGif} style={{ height: '300px' }} />
      </div>

      {/* If you want to show a fallback mp4 video (make sure file is in public/assets/yt-intro.mp4) */}
      <div className="w-full md:w-1/2 mt-6 aspect-video">
  <iframe
    className="w-full h-full rounded-lg shadow-lg"
    src="https://www.youtube.com/embed/J1t34uTT0iA?si=4J3cAwrze_gkzXDC"
    title="YouTube video player"
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerPolicy="strict-origin-when-cross-origin"
    allowFullScreen
  ></iframe>
</div>

    </section>
  );
}
