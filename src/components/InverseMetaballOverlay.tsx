import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import html2canvas from "html2canvas";

type Point = { x: number; y: number };

const TRAIL_LENGTH = 8;
const MAIN_BLOB_RADIUS = 100;
const BLOB_RADIUS = 80;
const TRAIL_LERP = 0.1;
const GOO_BLUR = 16;
const GOO_ALPHA_MULTIPLIER = 22;
const GOO_ALPHA_OFFSET = -10;
const FILTER_ID = "inverse-metaball-goo";
const MASK_ID = "inverse-metaball-holes";

type InverseMetaballOverlayProps = {
  snapshotContent: ReactNode;
  snapshotBoundsRef?: RefObject<HTMLElement | null>;
};

type SnapshotRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type SnapshotPadding = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

function createTrail(): Point[] {
  return Array.from({ length: TRAIL_LENGTH }, () => ({ x: -999, y: -999 }));
}

function stepTrail(trail: Point[], target: Point): void {
  trail[0].x += (target.x - trail[0].x) * TRAIL_LERP;
  trail[0].y += (target.y - trail[0].y) * TRAIL_LERP;

  for (let i = 1; i < trail.length; i += 1) {
    trail[i].x += (trail[i - 1].x - trail[i].x) * TRAIL_LERP;
    trail[i].y += (trail[i - 1].y - trail[i].y) * TRAIL_LERP;
  }
}

export default function InverseMetaballOverlay({
  snapshotContent,
  snapshotBoundsRef,
}: InverseMetaballOverlayProps) {
  const instanceId = useId().replace(/:/g, "");
  const filterId = `${FILTER_ID}-${instanceId}`;
  const maskId = `${MASK_ID}-${instanceId}`;
  const snapshotSourceId = `inverse-metaball-snapshot-source-${instanceId}`;

  const svgRef = useRef<SVGSVGElement>(null);
  const snapshotSourceRef = useRef<HTMLDivElement>(null);
  const snapshotFrameRef = useRef<HTMLDivElement>(null);
  const circlesRef = useRef<(SVGCircleElement | null)[]>([]);
  const mouseRef = useRef<Point>({ x: -999, y: -999 });
  const trailRef = useRef<Point[]>(createTrail());
  const [snapshotDataUrl, setSnapshotDataUrl] = useState<string | null>(null);
  const [snapshotRect, setSnapshotRect] = useState<SnapshotRect>({
    x: 0,
    y: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [snapshotPadding, setSnapshotPadding] = useState<SnapshotPadding>({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });
  const sizeRef = useRef({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) {
      return;
    }

    const syncSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      sizeRef.current = { width, height };
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    };

    syncSize();

    const onMouseMove = (event: MouseEvent) => {
      mouseRef.current = { x: event.clientX, y: event.clientY };
    };

    const onResize = () => {
      syncSize();
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", onResize);

    let frameId = 0;

    const animate = () => {
      stepTrail(trailRef.current, mouseRef.current);

      for (let i = 0; i < trailRef.current.length; i += 1) {
        const circle = circlesRef.current[i];
        const point = trailRef.current[i];

        if (!circle) {
          continue;
        }

        circle.setAttribute("cx", String(point.x));
        circle.setAttribute("cy", String(point.y));
      }

      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const updateSnapshotRect = () => {
      const targetElement = snapshotBoundsRef?.current;
      if (!targetElement) {
        setSnapshotRect({
          x: 0,
          y: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        });
        setSnapshotPadding({
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        });
        return;
      }

      const rect = targetElement.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(targetElement);
      setSnapshotRect({
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      });
      setSnapshotPadding({
        top: Number.parseFloat(computedStyle.paddingTop) || 0,
        right: Number.parseFloat(computedStyle.paddingRight) || 0,
        bottom: Number.parseFloat(computedStyle.paddingBottom) || 0,
        left: Number.parseFloat(computedStyle.paddingLeft) || 0,
      });
    };

    updateSnapshotRect();
    window.addEventListener("resize", updateSnapshotRect);

    return () => {
      window.removeEventListener("resize", updateSnapshotRect);
    };
  }, [snapshotBoundsRef]);

  useEffect(() => {
    let isCancelled = false;

    const captureSnapshot = async () => {
      const sourceElement = snapshotFrameRef.current;
      if (!sourceElement || snapshotRect.width <= 0 || snapshotRect.height <= 0) {
        return;
      }

      // Let layout and skeleton placeholders settle before capture.
      await new Promise<void>((resolve) => {
        window.requestAnimationFrame(() => resolve());
      });
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 40);
      });
      if ("fonts" in document) {
        await document.fonts.ready;
      }

      let canvas: HTMLCanvasElement;
      try {
        canvas = await html2canvas(sourceElement, {
          backgroundColor: "#ffffff",
          width: snapshotRect.width,
          height: snapshotRect.height,
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight,
          scrollX: 0,
          scrollY: 0,
          useCORS: true,
          onclone: (clonedDocument) => {
            const clonedSource = clonedDocument.getElementById(snapshotSourceId);
            if (!(clonedSource instanceof HTMLElement)) {
              return;
            }

            clonedSource.style.visibility = "visible";
            clonedSource.style.opacity = "1";
            clonedSource.style.transform = "none";
            clonedSource.style.position = "fixed";
            clonedSource.style.inset = "0";
            clonedSource.style.width = "100vw";
            clonedSource.style.height = "100vh";
            clonedSource.style.zIndex = "0";
          },
        });
      } catch (error) {
        console.error("Failed to capture overlay snapshot", error);
        return;
      }

      if (isCancelled) {
        return;
      }

      setSnapshotDataUrl(canvas.toDataURL("image/png"));
    };

    void captureSnapshot();

    return () => {
      isCancelled = true;
    };
  }, [snapshotContent, snapshotRect, snapshotSourceId]);

  const gooMatrix = `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${GOO_ALPHA_MULTIPLIER} ${GOO_ALPHA_OFFSET}`;

  return (
    <div className="pointer-events-none fixed inset-0 z-overlay" aria-hidden="true">
      <div
        id={snapshotSourceId}
        ref={snapshotSourceRef}
        className="pointer-events-none invisible fixed inset-0 -z-1"
      >
        <div
          ref={snapshotFrameRef}
          className="fixed box-border overflow-hidden"
          style={{
            left: `${snapshotRect.x}px`,
            top: `${snapshotRect.y}px`,
            width: `${snapshotRect.width}px`,
            height: `${snapshotRect.height}px`,
            paddingTop: `${snapshotPadding.top}px`,
            paddingRight: `${snapshotPadding.right}px`,
            paddingBottom: `${snapshotPadding.bottom}px`,
            paddingLeft: `${snapshotPadding.left}px`,
          }}
        >
          {snapshotContent}
        </div>
      </div>
      <svg ref={svgRef} className="block h-full w-full">
        <defs>
          <filter
            id={filterId}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation={GOO_BLUR}
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values={gooMatrix}
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
          <mask id={maskId}>
            <rect width="100%" height="100%" fill="white" />
            <g filter={`url(#${filterId})`}>
              {Array.from({ length: TRAIL_LENGTH }, (_, index) => (
                <circle
                  key={index}
                  ref={(element) => {
                    circlesRef.current[index] = element;
                  }}
                  cx={-999}
                  cy={-999}
                  r={index === 0 ? MAIN_BLOB_RADIUS : BLOB_RADIUS}
                  fill="black"
                />
              ))}
            </g>
          </mask>
        </defs>
        {snapshotDataUrl ? (
          <image
            href={snapshotDataUrl}
            x={snapshotRect.x}
            y={snapshotRect.y}
            width={snapshotRect.width}
            height={snapshotRect.height}
            preserveAspectRatio="none"
            mask={`url(#${maskId})`}
          />
        ) : null}
      </svg>
    </div>
  );
}
