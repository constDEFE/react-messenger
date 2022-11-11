import { Style } from "../models/models";
import React from "react";

interface OnlineIndicatorProps {
  online: boolean;
}

const styles: Style = {
  online: "w-[16px] h-[16px] bg-green-600 rounded-full",
  offline: "w-[16px] h-[16px] bg-red-600 rounded-full",
};

const OnlineIndicator = ({ online }: OnlineIndicatorProps) => {
  return <div className={online ? styles.online : styles.offline} />;
};

export default OnlineIndicator;
