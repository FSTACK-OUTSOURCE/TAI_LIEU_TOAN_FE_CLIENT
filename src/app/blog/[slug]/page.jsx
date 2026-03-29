import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogs } from '@/endpoints/blog';
import { marked } from 'marked';
import '../blog.css';

const renderContent = (content) => {
    if (!content) return '';
    const trimmed = content.trim();
    // Nếu content là HTML (từ Quill editor) thì giữ nguyên, nếu là Markdown thì convert
    if (trimmed.startsWith('<')) return trimmed;
    return marked.parse(trimmed);
};

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
    });
};

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const res = await getBlogs({ query: { TITLE: slug } });
    const blog = (res.Items || []).find((b) => b.TITLE_SLUG === slug);
    if (!blog) return { title: 'Không tìm thấy bài viết' };
    return {
        title: blog.TITLE,
        description: blog.DESCRIPTION || blog.TITLE,
    };
}

export default async function BlogDetailPage({ params }) {
    const { slug } = await params;
    const res = await getBlogs({ query: { TITLE: slug } });
    const blog = (res.Items || []).find((b) => b.TITLE_SLUG === slug);

    if (!blog) notFound();
console.log('Blog found:', blog);
    return (
        <section className="mt-2">
            <div className="blogDetailContainer">
                <Link href="/blog" className="blogDetailBack">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 5l-7 7 7 7" />
                    </svg>
                    Quay lại danh sách
                </Link>

                <h1 className="blogDetailTitle">{blog.TITLE}</h1>

                <div className="blogDetailMeta">
                    <span>{blog.AUTHOR_NAME || 'Admin'}</span>
                    <span className="blogDetailMetaSep" />
                    <span>{formatDate(blog.CREATED_DATE)}</span>
                    {blog.UPDATED_DATE && blog.UPDATED_DATE !== blog.CREATED_DATE && (
                        <>
                            <span className="blogDetailMetaSep" />
                            <span>Cập nhật {formatDate(blog.UPDATED_DATE)}</span>
                        </>
                    )}
                </div>

                {blog.THUMBNAIL && (
                    <div className="blogDetailThumb">
                        <img src={blog.THUMBNAIL} alt={blog.TITLE} />
                    </div>
                )}

                {blog.DESCRIPTION && (
                    <div className="blogDetailDesc">{blog.DESCRIPTION}</div>
                )}

                <div
                    className="blogContent"
                    dangerouslySetInnerHTML={{ __html: renderContent(blog.CONTENT) }}
                />
            </div>
        </section>
    );
}
