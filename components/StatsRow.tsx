import Counter from "./Counter";
import Reveal from "./Reveal";

type Stat = { value: string; label: string };

export default function StatsRow({ items }: { items: Stat[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 sm:gap-x-8">
      {items.map((stat, i) => (
        <li key={stat.label} className="border-l border-rule pl-5">
          <Reveal delay={i * 90}>
            <p className="display-section text-ink tabular-nums">
              <Counter value={stat.value} />
            </p>
            <p className="label mt-3">{stat.label}</p>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
