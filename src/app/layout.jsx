import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '@/components/footer';
import Header from '@/components/header';
import "./pages.css"
import "./mobile.css"
import { AppContextProvider } from '@/appcontext';
import { getConfigs } from '@/endpoints/config';
import { userInfo } from '@/endpoints/identity';
import { getDocuments } from '@/endpoints/document';
import { Suspense } from "react";
import Right from '@/components/right';
import Category from '@/components/category';
import Sidebar from '@/components/sidebar';

const SITE_URL = "https://tailieutoan.vn";
const SITE_NAME = "tailieutoan.vn";
const DEFAULT_TITLE = "Tài Liệu Toán - Kho tài liệu Toán, Lý, Hóa, Văn cho giáo viên & học sinh";
const DEFAULT_DESCRIPTION =
  "tailieutoan.vn - Kho tài liệu Toán học và các môn học khác (Lý, Hóa, Văn, Anh, Sinh...) dành cho giáo viên và học sinh từ Tiểu học đến THPT. Tải đề thi, giáo án, bài giảng, chuyên đề ôn thi miễn phí và chất lượng cao.";

export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },

  description: DEFAULT_DESCRIPTION,

  applicationName: SITE_NAME,
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,

  keywords: [
    "tài liệu toán",
    "tailieutoan",
    "tailieutoan.vn",
    "tài liệu học tập",
    "đề thi toán",
    "giáo án toán",
    "bài giảng toán",
    "chuyên đề toán",
    "ôn thi THPT Quốc Gia",
    "ôn thi vào lớp 10",
    "tài liệu lớp 6",
    "tài liệu lớp 7",
    "tài liệu lớp 8",
    "tài liệu lớp 9",
    "tài liệu lớp 10",
    "tài liệu lớp 11",
    "tài liệu lớp 12",
    "toán tiểu học",
    "toán THCS",
    "toán THPT",
    "tài liệu giáo viên",
    "tài liệu học sinh",
  ],

  category: "education",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  alternates: {
    canonical: "/",
    languages: {
      "vi-VN": "/",
      "x-default": "/",
    },
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },

  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: "/banner.png",
        width: 1200,
        height: 630,
        alt: "tailieutoan.vn - Kho tài liệu Toán và các môn học",
      },
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Logo tailieutoan.vn",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ["/banner.png"],
  },

  verification: {
    google: "6ZF008_cLMo6WgpNQ9R-XqjL-KsDe3zvRbL8s3o7IxI",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLdWebsite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  alternateName: "Tài Liệu Toán",
  url: SITE_URL,
  inLanguage: "vi-VN",
  description: DEFAULT_DESCRIPTION,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/search?keyword={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/banner.png`,
  description: DEFAULT_DESCRIPTION,
  sameAs: [],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#fdcd02",
};


const fetchConfigs = async () => {
  var response = await getConfigs()
  return response.success ? response.Items : []
}

const fetchUserInfo = async () => {
  var response = await userInfo();
  return response.success ? response : {}
}

const fetchCategories = async () => {
  var response = await getDocuments({ query: { PARENT_DOCUMENT_ID: "00000000-0000-0000-0000-000000000000", Columns: "*" } });
  return response.success ? response.Items : []
}



export default async function RootLayout({ children }) {
  const configs = await fetchConfigs();
  const userInfo = await fetchUserInfo();
  const categories = await fetchCategories();
  return (
    <html lang="vi" style={{minHeight:"100vh"}}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
      </head>
      <AppContextProvider>
        <body style={{display:"flex", flexDirection:"column", minHeight:"100vh"}}>
          <div className="container">
            <div className="row d-flex">
              <div className="col-lg-12 col-xl-12">
                <Header props={{ configs, userInfo }} />
              </div>
            </div>
          </div>
          <div className="container pb-3 flex-grow-1">
            <div className="col-lg-12 col-xl-12">
              <div className="row">
                <div className="col-md-3">
                  <Category props={{ categories }} />
                </div>
                <div className="col-md-9">
                  <Sidebar />
                </div>

              </div>
              <div>
                <Suspense>
                  {children}
                </Suspense>
              </div>
              {/* <div className="row">
                <div className="col-lg-9 col-xl-9">
                  <Suspense>
                    {children}
                  </Suspense>
                </div>
                <Right />
              </div> */}
            </div>
          </div>
          <Footer />
        </body>
      </AppContextProvider>
    </html>
  );
}
