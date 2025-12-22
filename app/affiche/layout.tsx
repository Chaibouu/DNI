import { Arizonia } from "next/font/google";

const arizonia = Arizonia({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function AfficheLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={arizonia.className}>
      {children}
    </div>
  );
}

