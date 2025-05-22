import { NumberTicker } from "../magicui/number-ticker";

export default function StatsSection() {
  return (
    <section className="py-2">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
              <NumberTicker
                value={10000}
                className="text-green-600 dark:text-green-400"
              />
              +
            </div>
            <div className="text-lg text-gray-700 dark:text-gray-300">
              Items Shared
            </div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
              <NumberTicker
                value={5000}
                className="text-green-600 dark:text-green-400"
              />
            </div>
            <div className="text-lg text-gray-700 dark:text-gray-300">
              Active Users
            </div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
              <NumberTicker
                value={4000}
                className="text-green-600 dark:text-green-400"
              />
            </div>
            <div className="text-lg text-gray-700 dark:text-gray-300">
              Saved from Landfill
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
