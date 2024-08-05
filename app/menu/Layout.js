/*햄버거 메뉴 랜더링 */

import HamburgerMenu from './HamburgerMenu';

export default function Layout({ children }) {
  return (
    <>
      <HamburgerMenu />
      <main>{children}</main>
    </>
  );
}
