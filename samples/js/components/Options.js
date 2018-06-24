import React from "react";
import { APIDocumentation } from "../helpers/code";

function ObjectOption({ title, type, def, description, properties }) {
  const details = properties && properties.map((property, index) => {
    return (
      <li key={index}>
        <p>
          <strong>{property.title}</strong> <code className="white-code">{property.type}</code></p>
        {
          property.def &&
          <p>Default: <code className="white-code">{property.def}</code></p>
        }
        <div
          className="alert alert-warning alert-transparent"
          dangerouslySetInnerHTML={{ __html: property.description }}>
        </div>
      </li>
    );
  });

  return (
    <div className="row">
      <div className="col-lg-6 offset-lg-3 column col-md-10 offset-md-1 col-sm-12 heading">
        <h5 className="text-center">
          {title} <code className="white-code">{type}</code>
        </h5>
        {
          def &&
          <p className="p-default">Default: <code className="white-code">{def}</code></p>
        }
        <div
          className="alert alert-warning alert-transparent"
          dangerouslySetInnerHTML={{ __html: description }}>
        </div>
        {
          properties &&
          properties.length > 0 &&
          <ul className="paragraph-list">
            {details}
          </ul>
        }
      </div>
    </div>
  );
}

function OptionHeader() {
  return (
    <div className="row heading">
      <div className="col-md-12">
        <h2 className="text-center">Options</h2>
      </div>
    </div>
  );
}

export default function Options() {
  const rows = APIDocumentation.map((row, index) => {
    return <ObjectOption
      key={index}
      title={row.title}
      type={row.type}
      def={row.def}
      description={row.description}
      properties={row.properties}
    />
  });

  return (
    <React.Fragment>
      <OptionHeader />
      {rows}
    </React.Fragment>
  );
}