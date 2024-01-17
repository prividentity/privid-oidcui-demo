import {
  DOCUMENT_PROGRESS_DURATION,
  DOCUMENT_PROGRESS_MOBILE_DURATION,
  DOCUMENT_PROGRESS_SPEED,
} from "constant/animation";
import { useEffect, useState } from "react";
import { isMobile } from "utils";

const DocumentProgressAnimation = ({ progressData, setCompleted }: any) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(
      () => {
        if (progress <= 2005 + DOCUMENT_PROGRESS_SPEED) {
          setProgress((prevProgress) => prevProgress + DOCUMENT_PROGRESS_SPEED);
          if (progress >= 2005 + DOCUMENT_PROGRESS_SPEED) {
            if (progressData === 100) {
              setProgress(2100);
              clearInterval(intervalId);
              setCompleted(true);
              return;
            } else {
              clearInterval(intervalId);
            }
          }
        }
      },
      isMobile ? DOCUMENT_PROGRESS_MOBILE_DURATION : DOCUMENT_PROGRESS_DURATION
    );

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [progress, progressData]);

  const rectStyle = {
    strokeDasharray: `${progress}, 2100`,
    transition: "stroke-dasharray",
  };

  // Calculate the starting position for the square from the center
  const squareSize: any = isMobile ? "calc(100% - 18px)" : 470;
  const squareHeight: any = isMobile ? "83%" : 331;
  const cornerRadius = 10;
  const startX = isMobile ? 9 : (488 - squareSize) / 2;
  const startY = isMobile ? 27 : (350 - squareHeight) / 2;

  return (
    <svg width="100%" height="100%" style={{ transform: "rotate(0deg)" }}>
      {/* Progress bar */}
      <rect
        x={startX}
        y={startY}
        width={squareSize}
        height={squareHeight}
        rx={cornerRadius}
        ry={cornerRadius}
        fill="none"
        stroke="#4CAF50"
        strokeWidth="5"
        style={rectStyle}
      />
    </svg>
  );
};

export default DocumentProgressAnimation;
