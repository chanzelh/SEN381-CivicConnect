function BrandHeader({ title }) {
  return (
    <header className="brand-header">
      <h1 className="brand-title">CIVICCONNECT</h1>

      {title && (
        <h2 className="brand-section-title">{title}</h2>
      )}
    </header>
  );
}

export default BrandHeader;

