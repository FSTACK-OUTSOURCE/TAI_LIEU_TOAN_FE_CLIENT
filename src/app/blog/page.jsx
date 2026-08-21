import { getBlogs } from "@/endpoints/blog";
import Link from "next/link";
import "./blog.css";

export const metadata = {
    title: "Blog",
    description: "Các bài viết kiến thức hữu ích từ tailieutoan.vn",
};

const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

const authorInitial = (name) => (name ? name.charAt(0).toUpperCase() : "A");

export default async function BlogListPage() {
    const res = await getBlogs();
    const blogs = res.success ? res.Items || [] : [];

    return (
        <section className="mt-2">
            <div className="blogPageHeader">
                <h1>Bài viết</h1>
                {blogs.length > 0 && <span>{blogs.length} bài viết</span>}
            </div>

            {blogs.length === 0 ? (
                <div className="blogEmpty">
                    <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        style={{
                            marginBottom: 12,
                            display: "block",
                            margin: "0 auto 12px",
                        }}
                    >
                        <path
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    Chưa có bài viết nào.
                </div>
            ) : (
                <div className="row g-3">
                    {blogs.map((blog) => (
                        <div className="col-sm-6 col-lg-4" key={blog.BLOG_ID}>
                            <Link
                                href={`/blog/${blog.TITLE_SLUG}`}
                                className="blogCard"
                            >
                                {blog.THUMBNAIL ? (
                                    <div className="blogCardThumb">
                                        <img
                                            src={blog.THUMBNAIL?.replace(
                                                /\\/g,
                                                "/",
                                            )}
                                            alt={blog.TITLE}
                                        />
                                    </div>
                                ) : (
                                    <div className="blogCardAccent" />
                                )}
                                <div className="blogCardBody">
                                    <h2 className="blogCardTitle">
                                        {blog.TITLE}
                                    </h2>
                                    {blog.DESCRIPTION && (
                                        <p className="blogCardDesc">
                                            {blog.DESCRIPTION}
                                        </p>
                                    )}
                                    <div className="blogCardFooter">
                                        <div className="blogCardFooterAuthor">
                                            <div className="blogCardAuthorDot">
                                                {authorInitial(
                                                    blog.AUTHOR_NAME,
                                                )}
                                            </div>
                                            <span>
                                                {blog.AUTHOR_NAME || "Admin"}
                                            </span>
                                        </div>
                                        <span>
                                            {formatDate(blog.CREATED_DATE)}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
