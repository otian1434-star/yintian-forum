export const metadata = {
  title: "胤天天堂｜正統承胤・天命再臨",
  description: "胤天天堂獨立官方網站",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-Hant">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
