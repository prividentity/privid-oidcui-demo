/* eslint no-use-before-define: 0 */ // --> OFF
import { useSpring, animated } from "@react-spring/web";
import {
  DOCUMENT_ANIMATION_COMPLETED_DURATION,
  DOCUMENT_ANIMATION_DURATION,
  DOCUMENT_ANIMATION_INPROGRESS_DURATION,
} from "constant/animation";
import { useState } from "react";

const AnimatedCircle = ({
  isCircle,
  children,
  isScanned,
  onAnimationComplete,
  documentScan,
}: any) => {
  const [completed, setCompleted] = useState(false);
  const styles: any = useSpring({
    borderRadius:
      documentScan && isScanned
        ? "20px"
        : isScanned
        ? "50%"
        : isCircle
        ? "150px"
        : "16px",
    border:
      !isScanned && completed && !documentScan
        ? "3px dashed #fff"
        : "3px solid transparent",
    maxWidth: isScanned ? "100px" : isCircle ? "300px" : "560px",
    maxHeight: isScanned ? "100px" : isCircle ? "300px" : "340px",
    config: {
      duration: isScanned
        ? DOCUMENT_ANIMATION_INPROGRESS_DURATION
        : completed
        ? DOCUMENT_ANIMATION_COMPLETED_DURATION
        : DOCUMENT_ANIMATION_DURATION,
    },
    padding: isCircle ? "5px" : "0px",
    filter: isScanned ? "blur(5px)" : "blur(0px)",
    onRest: () => {
      if (onAnimationComplete) {
        requestAnimationFrame(() =>
          onAnimationComplete(isScanned ? "completed" : "start")
        );
      }
    },
  });

  const borderWith: any = useSpring({
    width: !documentScan && isCircle ? "155" : "40px",
    height: !documentScan && isCircle ? "155" : "40px",
    borderTopLeftRadius: !documentScan && isCircle ? "150px" : "15px",
    borderStyle: "solid",
    opacity: "1",
    margin: "0px",
    config: { duration: DOCUMENT_ANIMATION_DURATION },
    zIndex: "9999999",
    onRest: () => {
      setCompleted(true);
    },
  });
  return (
    <animated.div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        borderRadius: "2px",
        ...styles,
      }}
    >
      <animated.div
        style={{
          ...borderWith,
          position: "absolute",
          top: 0,
          left: 0,
          borderTop: "3px solid #fff",
          borderLeft: "3px solid #fff",
        }}
      ></animated.div>
      <animated.div
        style={{
          ...borderWith,
          position: "absolute",
          top: 0,
          right: 0,
          transform: "scaleX(-1)",
          borderLeft: "3px solid #fff",
          borderTop: "3px solid #fff",
        }}
      ></animated.div>
      <animated.div
        style={{
          ...borderWith,
          position: "absolute",
          bottom: 0,
          left: 0,
          transform: "scaleY(-1)",
          borderLeft: "3px solid #fff",
          borderTop: "3px solid #fff",
        }}
      ></animated.div>
      <animated.div
        style={{
          ...borderWith,
          position: "absolute",
          bottom: 0,
          right: 0,
          transform: "rotate(180deg)",
          borderLeft: "3px solid #fff",
          borderTop: "3px solid #fff",
        }}
      ></animated.div>
      {children}
    </animated.div>
  );
};

const DocumentAnimation = ({
  children,
  isCircle,
  isScanned,
  handleAnimationComplete,
  documentScan,
}: any) => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <AnimatedCircle
        size={"100%"}
        isCircle={isCircle}
        children={children}
        isScanned={isScanned}
        onAnimationComplete={handleAnimationComplete}
        documentScan={documentScan}
      />
    </div>
  );
};

export default DocumentAnimation;
