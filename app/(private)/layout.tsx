import HeaderUser from "@/components/HeaderUser/HeaderUser";

export default function AuthLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      <HeaderUser/>
      {children}
      {modal}
    </>
  );
}
console.log("PRIVATE LAYOUT RENDER");
