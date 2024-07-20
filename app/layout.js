// app/layout.js
import './globals.css';

export const metadata = {
  title: 'GumiDang',
  description: '산책 기록 입력 페이지',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
