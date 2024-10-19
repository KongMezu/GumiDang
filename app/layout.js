/*햄버거 메뉴 레이아웃 렌더링 */ 
import Layout from './menu/Layout'; //햄버거메뉴 랜더링

export const metadata = {
  title: 'test',
  description: '해피',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
        <body>
          <Layout>{children}</Layout>
        </body>
    </html>
  );
}

