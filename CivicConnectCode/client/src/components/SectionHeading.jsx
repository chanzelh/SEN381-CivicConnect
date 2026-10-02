function SectionHeading({ title, action }) {
  return (
    <div className="section-heading">
      <h3>{title}</h3>

      <div className="heading-line"></div>

      {action && action}
    </div>
  );
}

export default SectionHeading;