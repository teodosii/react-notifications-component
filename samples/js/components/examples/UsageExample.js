import React from "react";
import Highlight from "react-highlight";
import { usage } from "helpers/code";

export default function UsageExample() {
  return (
    <div className="row">
      <div className="col-lg-8 offset-lg-2 column col-md-10 offset-md-1 col-sm-12 heading">
        <h2 className="text-center">Usage</h2>
        <div className="usage-example">
          <Highlight>
            {usage}
          </Highlight>
        </div>
      </div>
    </div>
  );
}