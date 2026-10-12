
function SectionHeading({ title, action }) {
  return (
    <div className="section-heading">
      <div className="section-heading-row">
        <h3>{title}</h3>

        {action && (
          <div className="section-heading-action">
            {action}
          </div>
        )}
      </div>

      <div className="heading-line" />
    </div>
  );
}

export default SectionHeading;
