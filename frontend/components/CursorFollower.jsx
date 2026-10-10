import { useEffect, useRef } from "react";

const CursorFollower = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  const mouse = useRef({ x: -100, y: -100 });
  const dot = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const isInitialized = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      // Agar pehli baar mouse screen par aaya hai, toh direct snap karwa do (No delay)
      if (!isInitialized.current) {
        dot.current.x = e.clientX;
        dot.current.y = e.clientY;
        ring.current.x = e.clientX;
        ring.current.y = e.clientY;
        isInitialized.current = true;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    let animationFrameId;

    const animate = () => {
      // Magnetic Power High kar di hai (0.7 aur 0.4 - instant feel dega)
      dot.current.x += (mouse.current.x - dot.current.x) * 0.7;
      dot.current.y += (mouse.current.y - dot.current.y) * 0.7;

      ring.current.x += (mouse.current.x - ring.current.x) * 0.4;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.4;

      if (dotRef.current) {
        dotRef.current.style.transform = `
          translate3d(
            ${dot.current.x}px,
            ${dot.current.y}px,
            0
          )
          translate(-50%, -50%)
        `;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `
          translate3d(
            ${ring.current.x}px,
            ${ring.current.y}px,
            0
          )
          translate(-50%, -50%)
        `;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Outer Ring */}
      <div
        ref={ringRef}
        className="
          fixed
          top-0
          left-0
          z-[9998]
          hidden
          md:block
          w-8
          h-8
          rounded-full
          border
          border-cyan-400/50
          pointer-events-none
        "
      />

      {/* Center Dot */}
      <div
        ref={dotRef}
        className="
          fixed
          top-0
          left-0
          z-[9999]
          hidden
          md:block
          w-2
          h-2
          rounded-full
          bg-cyan-400
          pointer-events-none
          shadow-[0_0_12px_rgba(34,211,238,0.9)]
        "
      />
    </>
  );
};

export default CursorFollower;
