import "./globals.css";

export const metadata = {
  title: "Social freeText",
  description:
    "Social freeText - Connect, chat, share and communicate in real time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
