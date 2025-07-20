import Header from "@/components/customer/header";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header/>
      <main>
        {children}
      </main>
    </>
  );
}