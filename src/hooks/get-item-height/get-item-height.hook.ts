import { useEffect, useState } from "react";

export function useGetItemHeight(parentElementId: string) {
  const [itemHeight, setItemHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    function handleResize() {
      setItemHeight(getPrecedingElementHeight(parentElementId));
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [parentElementId]);

  return itemHeight;
}

function getPrecedingElementHeight(parentElementId: string): number | undefined {
  // Gets the second to last item's height (which is the item right before the item we want to calculate the height for)
  return document
    .querySelector(`.MuiGrid-container#${parentElementId} .MuiGrid-root:nth-last-child(2) > .MuiPaper-root`)
    ?.getBoundingClientRect().height;
}
