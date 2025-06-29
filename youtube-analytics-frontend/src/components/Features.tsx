export default function Features() {
    return (
      <section id="features" className="py-20 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            ['Video Performance', 'Analyze views, retention, and engagement'],
            ['Channel Health', 'Track subs, revenue, and content health'],
            ['Competitor Tracker', 'Benchmark against similar channels'],
          ].map(([title, desc], i) => (
            <div key={i} className="bg-gray-100 p-6 rounded shadow">
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }
  