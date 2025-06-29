export default function Testimonials() {
    return (
      <section id="testimonials" className="py-20 px-6 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            ["“YTAnalytics is a game changer!”", "– Alex, Creator"],
            ["“Gave me full control over my YouTube growth.”", "– Maria, Influencer"],
            ["“The best competitor tool out there.”", "– John, Marketer"],
          ].map(([quote, name], i) => (
            <div key={i} className="bg-white p-6 rounded shadow text-center">
              <p className="italic mb-4">{quote}</p>
              <p className="font-semibold">{name}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }
  