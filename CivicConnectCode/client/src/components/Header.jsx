function BrandHeader({ title }) {
  return (
    <header className="brand-header">
      <h1>CIVICCONNECT</h1>
      {title && <h2>{title}</h2>}
    </header>
  );
}

export default BrandHeader;