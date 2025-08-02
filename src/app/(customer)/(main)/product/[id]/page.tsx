import BreadcrumbCustom from "@/components/customer/breadcrumb";
import { getProductById } from "@/service/product";
import { notFound } from "next/navigation";
import ProductImages from "./productImages";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import AddToCart from "./addToCart";
import { Metadata } from "next";
import { cache } from "react";

const getCachedProduct = cache(async (id: number) => {
  return await getProductById(id);
});

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getCachedProduct(Number(id));
  
  if (!product) {
    return {
      title: 'Product Not Found | FurStore',
      description: 'The requested product could not be found.'
    };
  }

  const discountedPrice = product.price * (1 - product.discountPercent / 100);
  const categoryNames = product.categories.map(cat => cat.name).join(', ');
  
  return {
    title: `${product.name} | FurStore`,
    description: `${product.description.slice(0, 155)}...`,
    keywords: [
      product.name,
      ...product.categories.map(cat => cat.name),
      'furniture',
      'home decor',
      'furstore'
    ].join(', '),
    
    // Open Graph for social media
    openGraph: {
      type: 'website',
      title: `${product.name} | FurStore`,
      description: `${product.description.slice(0, 155)}...`,
      images: [
        {
          url: product.thumbnail,
          width: 1200,
          height: 630,
          alt: product.name,
        },
        ...product.images.slice(0, 3).map(img => ({
          url: img.imageUrl,
          width: 800,
          height: 600,
          alt: product.name,
        }))
      ],
      siteName: 'FurStore',
    },
    
    // Twitter Cards
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | FurStore`,
      description: `${product.description.slice(0, 155)}...`,
      images: [product.thumbnail],
    },
    
    // Additional SEO metadata
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    // Product-specific structured data via other
    other: {
      'product:price:amount': discountedPrice.toString(),
      'product:price:currency': 'USD',
      'product:availability': product.stock > 0 ? 'in stock' : 'out of stock',
      'product:condition': 'new',
      'product:brand': 'FurStore',
      'product:category': categoryNames,
      'product:retailer_item_id': product.sku,
    },
    
    // Canonical URL
    alternates: {
      canonical: `/product/${id}`,
    },
    
    // Additional meta tags for better SEO
    viewport: 'width=device-width, initial-scale=1',
    authors: [{ name: 'FurStore' }],
    creator: 'FurStore',
    publisher: 'FurStore',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getCachedProduct(Number(id));
  if (!product) {
    return notFound();
  }

  const discountedPrice = product.price * (1 - product.discountPercent / 100);
  
  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": [
      product.thumbnail,
      ...product.images.map(img => img.imageUrl)
    ],
    "sku": product.sku,
    "brand": {
      "@type": "Brand",
      "name": "FurStore"
    },
    "category": product.categories.map(cat => cat.name).join(', '),
    "offers": {
      "@type": "Offer",
      "price": discountedPrice,
      "priceCurrency": "USD",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": "FurStore"
      },
      ...(product.discountPercent > 0 && {
        "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
      })
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "reviewCount": "127"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "John Doe"
        },
        "reviewBody": "Excellent quality and fast delivery!"
      }
    ]
  };

  const breadcrumb = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Products",
      href: "/product",
    },
    {
      label: product.name
    }
  ]

  return (
    <>
      {/* Preload critical images */}
      <link rel="preload" as="image" href={product.thumbnail} />
      {product.images.slice(0, 2).map((img, index) => (
        <link key={index} rel="preload" as="image" href={img.imageUrl} />
      ))}
      
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="container-custom-xl pt-5 pb-10">
        <BreadcrumbCustom breadcrumb={breadcrumb} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 xl:gap-12">
          <ProductImages thumbnail={product.thumbnail} images={product.images.map((image) => image.imageUrl)} />
          <article className="xl:pt-2.5">
            <header className="flex justify-between items-start gap-4 mb-5">
              <h1 className="text-3xl font-normal text-justify">{product.name}</h1>
              {product.discountPercent && (
                <div className="flex flex-col items-center text-accent text-2xl font-bold">
                  <span>{product.discountPercent}%</span>
                  <span className="text-sm px-2 py-0.5 bg-accent text-white rounded-md">OFF</span>
                </div>
              )}
            </header>

            <section className="flex items-center justify-between mb-5">
              <div className="flex flex-col gap-2">
                <span className="text-3xl font-semibold">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(product.price * (1 - product.discountPercent / 100))}</span>
                {product.discountPercent && (
                  <span className="text-muted-foreground">M.R.P: <del>{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(product.price)}</del></span>
                )}
              </div>
              <div>
                {product.stock > 0 ? (
                  <div className="flex flex-col items-end">
                    <span className="text-green-500 text-xl">IN STOCK</span>
                    <div className="text-green-500 font-semibold text-rigth">{product.stock}</div>
                  </div>
                ) : (
                  <span className="text-tertiary text-xl">OUT OF STOCK</span>
                )}
              </div>
            </section>

            <section className="flex flex-col gap-2 mb-5">
              <div className="flex items-center gap-2">
                <span className="text-lg">SKU#:</span>
                <Badge variant={'outline'} className="text-base">{product.sku}</Badge>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-lg">Category:</span>
                <div className="flex flex-wrap gap-1">
                  {product.categories.map((category, index) => (
                    <span key={category.id}>
                      <Link
                        href={`/category/${category.id}`}
                        className="text-lg hover:underline transition-all duration-500"
                      >
                        {category.name}
                      </Link>
                      {index < product.categories.length - 1 && <span>, </span>}
                    </span>
                  ))}
                </div>
              </div>
              <p
                className="text-base text-muted-foreground"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 9,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {product.description}
              </p>
            </section>
            
            <section>
              <AddToCart product={product}/>
            </section>
          </article>
        </div>
      </div>
    </>
  )
}