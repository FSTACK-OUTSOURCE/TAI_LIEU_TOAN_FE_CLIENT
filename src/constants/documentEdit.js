export const canEditDocument = (user) =>
    Boolean(user?.IS_ROOT || user?.IS_EDITER || user?.IS_EDITOR);

export const buildDocumentEditUrl = (documentinfo) => {
    const params = new URLSearchParams();

    if (documentinfo?.PARENT_DOCUMENT_ID) {
        params.set("parentDocumentId", documentinfo.PARENT_DOCUMENT_ID);
    }

    if (documentinfo?.DOCUMENT_ID) {
        params.set("edit", documentinfo.DOCUMENT_ID);
    }

    const query = params.toString();
    return `${process.env.NEXT_PUBLIC_ADMIN_URL}/Admin/Document${query ? `?${query}` : ""}`;
};
