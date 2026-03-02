import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '@/components/footer';
import Header from '@/components/header';
import "./pages.css"
import { AppContextProvider } from '@/appcontext';
import { getConfigs } from '@/endpoints/config';
import { userInfo } from '@/endpoints/identity';
import { getDocuments } from '@/endpoints/document';
import { Suspense } from "react";
import Right from '@/components/right';
import Category from '@/components/category';

export const metadata = {

  metadataBase: new URL("https://tailieutoan.vn"),

  title: {
    default: "tailieutoan.vn Trang tài liệu toán và các môn học khác",
    template: "%s | tailieutoan.vn Trang tài liệu toán và các môn học khác",
  },

  description: "Trang tài liệu dành cho giáo viên, học sinh",

  verification: {
    google: "6ZF008_cLMo6WgpNQ9R-XqjL-KsDe3zvRbL8s3o7IxI",
  },

  robots: {
    index: true,
    follow: true,
  }
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
    <html lang="en">
      <AppContextProvider>
        <body>
          <div className="container">
            <div className="row d-flex">
              <div className="col-lg-12 col-xl-12">
                <Header props={{ configs, userInfo }} />
              </div>
            </div>
          </div>
          <div className="container pb-3">
            <div className="col-lg-12 col-xl-12">
              <div className="row">
                <div className="col-md-9">
                  <Category props={{ categories }} />
                </div>

              </div>
              <div className="row">
                <div className="col-lg-9 col-xl-9">
                  <Suspense>
                    {children}
                  </Suspense>
                </div>
                <Right />
              </div>
            </div>
          </div>
          <Footer />
        </body>
      </AppContextProvider>
    </html>
  );
}
