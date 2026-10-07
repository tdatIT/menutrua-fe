import type {ComponentProps} from 'react';
import {Link} from 'react-router';

const EXTERNAL = /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i;

/**
 * Adapter that lets every Astryx link-rendering component (Link, Button
 * with href, TopNavItem…) navigate client-side through React Router.
 * Registered once via <LinkProvider component={RouterLink}>.
 */
export function RouterLink({href = '', ref, children, ...props}: ComponentProps<'a'>) {
  if (EXTERNAL.test(href) || props.target === '_blank' || props.download) {
    return (
      <a ref={ref} href={href} {...props}>
        {children}
      </a>
    );
  }
  return (
    <Link ref={ref} to={href} {...props}>
      {children}
    </Link>
  );
}
