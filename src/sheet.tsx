import { useEffect, useRef } from "react";
import { useDrag } from "@use-gesture/react";
import { a, config, useSpring } from "@react-spring/web";

export default function App({
  open,
  close,
  nonblocking = false,
  snapPoints,
  changeIndex,
  children,
}: any) {
  const content = useRef(null);
  const [{ height }, api] = useSpring(() => ({
    height: snapPoints[0],
  }));

  const openBottomsheet = () => {
    changeIndex(0);
    api.start({ height: snapPoints[0], immediate: false });
  };

  const closeBottomsheet = () => {
    close();
    return api.start({ height: 0, immediate: false });
  };

  const hiddenAuto = height.to((py: number) => {
    // return py >= snapPoints[snapPoints.length - 1] ? "auto" : "hidden";
  });

  const display = height.to((py: number) => {
    return py < 1 ? "none" : "block";
  });

  const bind = useDrag(
    ({
      last,
      offset: [, oy],
      movement: [, my],
      direction: [, dy],
      cancel,
      lastOffset,
      velocity: [, vy],
    }) => {
      const goal = lastOffset[1] - my;
      const { scrollTop } = content.current;

      if (goal > snapPoints[snapPoints.length - 1]) {
        cancel();
        content.current.style.overflow = "auto";
      }

      if (goal > snapPoints[snapPoints.length - 1] && dy !== 1)
        content.current.style.overflow = "auto";

      if (goal < snapPoints[snapPoints.length - 1] && scrollTop <= 0) {
        content.current.style.overflow = "hidden";
      }

      if (goal < snapPoints[snapPoints.length - 1] && scrollTop > 0) {
        cancel();
      }

      if (last) {
        if (goal < snapPoints[0]) closeBottomsheet();
        else {
          const output = snapPoints.reduce((prev, curr) =>
            Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev
          );

          const findIndex = snapPoints.findIndex((item) => item === output);

          if (findIndex != -1) {
            changeIndex(findIndex);

            api.start({
              height: output,
              immediate: false,
              // config: { ...config.stiff, velocity: vy },
            });
          }
        }
      } else {
        const output = snapPoints.reduce((prev, curr) =>
          Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev
        );

        const findIndex = snapPoints.findIndex((item) => item === output);

        if (findIndex !== -1) changeIndex(findIndex);

        api.start({
          height: goal,
          immediate: true,
          config: { ...config.stiff, velocity: vy },
        });
      }
    },
    {
      from: () => [0, height.get()],
      filterTaps: true,
      // bounds: { top: 0 },
      // rubberband: false,
      // round: true,
    }
  );

  useEffect(() => {
    if (open) openBottomsheet();
    else closeBottomsheet();
  }, [open]);

  return (
    <a.div className="react-bottom-sheet" style={{ display }}>
      {!nonblocking && open && <a.div className="backdrop" onClick={close} />}
      <a.div
        className="sheet"
        {...bind()}
        style={{
          display,
          height,
        }}
      >
        <div className="header" />
        <a.div
          ref={content}
          style={{
            overflow: hiddenAuto,
          }}
          className={"root"}
        >
          {children}
        </a.div>
      </a.div>
    </a.div>
  );
}
