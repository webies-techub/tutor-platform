import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Resets scroll to the top whenever the route changes.
// Without this, React Router keeps the previous page's scroll position,
// so a new page can open part-way down ("from the bottom").
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
