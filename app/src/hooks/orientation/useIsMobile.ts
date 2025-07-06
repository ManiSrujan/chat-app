import { useEffect, useMemo, useState } from "react";
import debounce from "src/common/utils/debounce";

const useIsMobile = (): { isMobile: boolean } => {
  const [isMobile, setIsMobile] = useState(false);

  function checkWidth() {
    if (window.innerWidth <= 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }

  useMemo(() => {
    checkWidth();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", debounce(checkWidth));
  }, []);

  return { isMobile };
};

export default useIsMobile;
