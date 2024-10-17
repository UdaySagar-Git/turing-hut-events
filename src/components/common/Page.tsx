import { ReactNode, useEffect } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

export default function Page({
  title,
  children,
}: Props) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} | Turing Hut`;
    return () => {
      document.title = previousTitle;
    };
  }, [title]);

  return (
    <>
      {children}
    </>
  );
}