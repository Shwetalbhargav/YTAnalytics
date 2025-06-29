export default function Pricing() {
    return (
      <section id="pricing" className="py-20 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            ['Basic', 'Free', ['Limited Analytics', 'Single Channel']],
            ['Pro', '$19/mo', ['Full Analytics', '5 Channels', 'Competitor Tracker']],
            ['Enterprise', '$49/mo', ['Unlimited Channels', 'Team Access', 'Priority Support']],
          ].map(([title, price, benefits], i) => (
            <div key={i} className="p-6 border rounded shadow hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-2">{title}</h3>
              <p className="text-orange-600 font-semibold mb-4">{price}</p>
              <ul className="mb-4 list-disc list-inside text-gray-600">
                {(benefits as string[]).map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
              <button className="w-full py-2 bg-orange-600 text-white rounded hover:bg-orange-700">Start Now</button>
            </div>
          ))}
        </div>
      </section>
    );
  }
  