export default function Navbar({ page, setPage, connected, onConnect }) {
  return (
    <nav>
      <button onClick={() => setPage("home")}>Home</button>
      <button onClick={() => setPage("circles")}>Circles</button>
      <button onClick={() => setPage("profile")}>Profile</button>

      {!connected && <button onClick={onConnect}>Connect</button>}
    </nav>
  );
}