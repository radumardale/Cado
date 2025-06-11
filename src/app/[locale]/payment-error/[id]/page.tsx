import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import { getTranslations } from "next-intl/server";
import { PageContent } from "./PageContent";

export async function generateMetadata() {
  const t = await getTranslations("PageTitles");

  return {
    title: t("payment_err"),
    description: "",
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {

  const { id } = await params;

  return (
    <>
      <div className="grid grid-cols-8 lg:grid-cols-15 gap-x-2 lg:gap-x-6 px-4 lg:px-16 max-w-3xl mx-auto relative">
        <Header />
        <PageContent id={id}/>
      </div>
      <Footer />
    </>
  );
}
