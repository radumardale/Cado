import { getQueryClient, HydrateClient, prefetch, trpc } from "@/app/_trpc/server";
import BlogSection from "@/components/blog/BlogSection";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Faq from "@/components/home/faq/Faq";
import Recommendations from "@/components/home/recommendations/Recommendations";
import LinksMenu from "@/components/LinksMenu";
import { setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params } : {params: Promise<{locale: string, id: string}>}) {
  
  const { locale, id } = await params;
  setRequestLocale(locale);

  const queryClient = getQueryClient();

  const queryOptions = trpc.blog.getBlogById.queryOptions({ id });
  const blogData = await queryClient.fetchQuery(queryOptions);

  const title = blogData.blog?.title[locale] || "Blog Post";
  const description = blogData.blog?.sections[0].content[locale] || "";
  const image = blogData.blog?.image || "https://your-default-image-url.com/default.jpg";

  return {
    title: title,
    description: description,
    openGraph: {
      title : title,
      description : description ,
      images: [
        {
          url: image,
          alt: title
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function AboutUs({params}: {params: Promise<{locale: string, id: string}>;}) {
  const {locale, id} = await params;
  setRequestLocale(locale);

  await prefetch(
    trpc.blog.getBlogById.queryOptions({ id }),
  );

  return (
    <HydrateClient>
      <div className="grid grid-cols-8 lg:grid-cols-15 gap-x-2 lg:gap-x-6 px-4 lg:px-16 max-w-3xl mx-auto relative">
        <Header />
        <BlogSection id={id}/>
        <Recommendations />
        <Faq />
      </div>
      <Footer />
      <LinksMenu />
    </HydrateClient>
  );
}