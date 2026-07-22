export function Nav({ items }: { items: string[] }) {
  return (
    <nav>
      {items.map((i) => (
        <a key={i} className="navLink">
          {i}
        </a>
      ))}
    </nav>
  );
}
