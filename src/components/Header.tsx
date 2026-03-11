import Link from 'next/link';

export default function Header() {
  return (
    <header style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', backgroundColor: '#001122', color: 'white' }}>
      <Link href="/" style={{ fontWeight: 'bold', textDecoration: 'none', color: 'white' }}>
        Build With AI
      </Link>
      <nav>
        <Link href="/login" style={{ marginLeft: '20px', color: 'white' }}>Login</Link>
      </nav>
    </header>
  );
}
