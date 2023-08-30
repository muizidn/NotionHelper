import React from "react";
import Base from "./Base";
import Translate from "./Translate";
import Rate from "./Rate";
import Feedback from "./Feedback";

const FAB: React.FC = () => {
  return (
    <Base>
      <Translate />
      <Rate />
      <Feedback />
    </Base>
  );
};

export default FAB;
