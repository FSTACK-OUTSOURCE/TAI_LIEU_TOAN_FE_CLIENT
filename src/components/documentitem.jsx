"use client";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/appcontext";
import { List, Checkbox, Row, Col, Image, Button, Divider, Select } from "antd";
import {
  DownloadOutlined,
  EyeOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons";
import { useState, useEffect, useCallback } from "react";
import { checkSignIn, downloadDocument } from "@/constants/client";
import DocumentTopup from "@/components/documenttopup";

const SORT_OPTIONS = [
  { label: "Mặc định", value: "default" },
  { label: "Mới nhất", value: "date_desc" },
  { label: "Cũ nhất", value: "date_asc" },
];

const DocumentItem = ({ props }) => {
  const { documentinfo, topics, isShowDetail, isBundle, parentDocument } =
    props;
  const [displayDocuments, setDisplayDocuments] = useState([]);
  const [childDocumentInfo, setChildDocumentInfo] = useState({});
  const [selectedTopicIds, setSelectedTopicIds] = useState([]);
  const [sortBy, setSortBy] = useState("default");
  const [showTopup, setShowTopup] = useState(false);
  const { appcontext, setAppContext } = useAppContext();
  const router = useRouter();

  const toggleTopup = () => {
    setShowTopup(!showTopup);
  };

  const buyDocument = async (item) => {
    setChildDocumentInfo(item);
    if (!appcontext.username) {
      var response = await checkSignIn();
      if (response.success) {
        setAppContext({ ...appcontext, ...response.userinfo });
        window.location.reload();
      }
    } else {
      setShowTopup(true);
    }
  };

  const checkDownloaded = (documentId) => {
    var downloaded = localStorage.getItem("downloaded");
    if (downloaded) {
      var downloadedArray = JSON.parse(downloaded);
      if (downloadedArray.includes(documentId)) {
        return true;
      }
    }
    return false;
  };

  const getActions = (item) => {
    var result = [];

    if (item.PRICE) {
      if (checkDownloaded(item.DOCUMENT_ID)) {
        result.push(
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              background: "#f6ffed",
              color: "#52c41a",
              border: "1px solid #b7eb8f",
              borderRadius: 12,
              padding: "2px 10px",
              fontSize: "0.78rem",
              fontWeight: 600,
            }}
          >
            ✓ Đã tải
          </span>,
        );
      }

      if (!item.BOUGHT) {
        result.push(
          <span style={{ fontSize: "0.82rem", color: "#595959" }}>
            Giá:{" "}
            <span style={{ fontWeight: 700, color: "#d46b08" }}>
              {new Intl.NumberFormat("vi-VN").format(item.PRICE)} đ
            </span>
          </span>,
        );
        result.push(
          <Button
            style={{
              marginLeft: 3,
              backgroundColor: "#389e0d",
              borderRadius: 6,
              padding: "0 14px",
              fontWeight: 600,
              border: "none",
            }}
            type="primary"
            icon={<DownloadOutlined />}
            size={"small"}
            onClick={() => {
              buyDocument(item);
            }}
          >
            Tải về
          </Button>,
        );
        if (item.LINK_FULL) {
          result.push(
            <Button
              style={{
                marginLeft: 3,
                borderRadius: 6,
                padding: "0 14px",
                fontWeight: 600,
              }}
              type="default"
              icon={<EyeOutlined />}
              size={"small"}
              onClick={() => {
                window.open(`${item.LINK_FULL}`);
              }}
            >
              Xem thử
            </Button>,
          );
        }
      } else {
        result.push(
          <Button
            style={{
              marginLeft: 3,
              backgroundColor: "#1677ff",
              borderRadius: 6,
              padding: "0 14px",
              fontWeight: 600,
              border: "none",
            }}
            type="primary"
            icon={<DownloadOutlined />}
            size={"small"}
            onClick={() => {
              downloadDocument(item);
            }}
          >
            Tải lại
          </Button>,
        );
      }
    }

    return result;
  };

  const getFirstTopicName = useCallback(
    (doc) => {
      if (!doc.TOPIC_IDS) return "";
      const firstId = doc.TOPIC_IDS.split(",")[0].trim();
      return topics.find((t) => t.TOPIC_ID === firstId)?.NAME || "";
    },
    [topics],
  );

  const applyFilterAndSort = useCallback(
    (docs, topicFilter, sort) => {
      let result = [...docs];

      if (topicFilter.length > 0) {
        result = result.filter((x) =>
          topicFilter.some((tid) => x.TOPIC_IDS && x.TOPIC_IDS.includes(tid)),
        );
      }

      if (sort === "date_desc") {
        result.sort(
          (a, b) => new Date(b.CREATED_DATE) - new Date(a.CREATED_DATE),
        );
      } else if (sort === "date_asc") {
        result.sort(
          (a, b) => new Date(a.CREATED_DATE) - new Date(b.CREATED_DATE),
        );
      } else if (sort === "topic") {
        result.sort((a, b) =>
          getFirstTopicName(a).localeCompare(getFirstTopicName(b), "vi"),
        );
      } else if (sort === "author") {
        result.sort((a, b) =>
          (a.CREATED_USER || "").localeCompare(b.CREATED_USER || "", "vi"),
        );
      }

      return result;
    },
    [getFirstTopicName],
  );

  useEffect(() => {
    setDisplayDocuments(
      applyFilterAndSort(documentinfo.childDocuments, selectedTopicIds, sortBy),
    );
  }, [documentinfo, selectedTopicIds, sortBy, applyFilterAndSort]);

  const hasNonFolderDocs = documentinfo.childDocuments.some(
    (x) => !x.IS_FOLDER,
  );
  const showFilterCard =
    !documentinfo.PRICE && hasNonFolderDocs && topics.length > 0;

    return (
    <section>
      {displayDocuments?.length > 0 ? (
        <div className="form-group row">
          {(() => {
            if(!documentinfo?.PRICE) return null
            let content = null;
            if (isBundle) {
              const count = documentinfo.childDocuments.filter(
                (x) => !x.IS_FOLDER,
              ).length;
              content = (
                <>
                  <span
                    style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "#d46b08",
                    }}
                  >
                    Bộ tài liệu bao gồm: {count} tài liệu lẻ
                  </span>
                  <span
                    style={{
                      fontSize: "0.9rem",
                      color: "#389e0d",
                      marginLeft: 8,
                    }}
                  >
                    (mua theo bộ tiết kiệm đến 50%)
                  </span>
                </>
              );
            } else if (!isBundle && parentDocument?.NAME) {
              content = (
                <>
                  <span
                    style={{
                      fontSize: "0.82rem",
                      color: "#8c8c8c",
                      fontWeight: 500,
                    }}
                  >
                    Thuộc bộ tài liệu:
                  </span>
                  <div
                    style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "#d46b08",
                      marginTop: "2px",
                    }}
                    dangerouslySetInnerHTML={{ __html: parentDocument.NAME }}
                  />
                </>
              );
            }
            if (!content) return null;
            return (
              <>
                <div
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    background: "linear-gradient(90deg, #fff7e6 0%, #fff 100%)",
                    borderLeft: "4px solid #fa8c16",
                    borderRadius: "4px",
                    marginBottom: "4px",
                  }}
                >
                  {content}
                </div>
                <Divider style={{ margin: "10px 0 0" }} />
              </>
            );
          })()}

          {/*  */}
          {
            <div className="col-md-12">
              {showFilterCard ? (
                <div className="card">
                  <div className="card-header">
                    <span
                      className="text-danger fontBold"
                      style={{ fontSize: "1.3rem" }}
                    >
                      LỌC & SẮP XẾP
                    </span>
                  </div>
                  <div className="card-body">
                    <div style={{ marginBottom: 10 }}>
                      <span
                        style={{
                          fontSize: "0.85rem",
                          color: "#595959",
                          marginRight: 8,
                        }}
                      >
                        Chủ đề{" "}
                        <span style={{ color: "#8c8c8c" }}>
                          (có thể chọn nhiều)
                        </span>
                        :
                      </span>
                      <Checkbox.Group
                        style={{ width: "100%", marginTop: 6 }}
                        value={selectedTopicIds}
                        onChange={setSelectedTopicIds}
                      >
                        <Row>
                          {topics.map((element) => (
                            <Col
                              span={8}
                              className="p-1"
                              key={element.TOPIC_ID}
                            >
                              <Checkbox value={element.TOPIC_ID}>
                                {element.NAME}
                              </Checkbox>
                            </Col>
                          ))}
                        </Row>
                      </Checkbox.Group>
                    </div>
                    <Divider style={{ margin: "8px 0" }} />
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <SortAscendingOutlined style={{ color: "#595959" }} />
                      <span style={{ fontSize: "0.85rem", color: "#595959" }}>
                        Sắp xếp:
                      </span>
                      <Select
                        value={sortBy}
                        onChange={setSortBy}
                        options={SORT_OPTIONS}
                        style={{ width: 160 }}
                        size="small"
                      />
                      {selectedTopicIds.length > 0 && (
                        <Button
                          size="small"
                          onClick={() => setSelectedTopicIds([])}
                        >
                          Xóa lọc
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <SortAscendingOutlined style={{ color: "#595959" }} />
                  <span style={{ fontSize: "0.85rem", color: "#595959" }}>
                    Sắp xếp:
                  </span>
                  <Select
                    value={sortBy}
                    onChange={setSortBy}
                    options={SORT_OPTIONS}
                    style={{ width: 160 }}
                    size="small"
                  />
                </div>
              )}
            </div>
          }

          {displayDocuments.length > 0 ? (
            <div style={{ width: "100%", marginTop: 8 }}>
              <List
                pagination={{
                  pageSize: 10,
                  locale: { items_per_page: "tài liệu / trang" },
                }}
                grid={
                  !displayDocuments.some((x) => x.PRICE)
                    ? { gutter: 12, column: 2 }
                    : undefined
                }
                dataSource={displayDocuments}
                renderItem={(item) => {
                  return (
                    <List.Item
                      className="filterListFile"
                      style={{
                        padding: "10px 14px",
                        marginBottom: 6,
                        background: "#fff",
                        borderRadius: 8,
                        border: "1px solid #f0f0f0",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                        transition: "box-shadow 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.boxShadow =
                          "0 3px 10px rgba(0,0,0,0.12)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.boxShadow =
                          "0 1px 4px rgba(0,0,0,0.06)")
                      }
                      actions={getActions(item)}
                    >
                      <List.Item.Meta
                        avatar={
                          <div
                            style={{
                              width: 50,
                              height: 50,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: 8,
                              background: "#fafafa",
                              overflow: "hidden",
                            }}
                          >
                            <Image
                              preview={false}
                              src={
                                item.IMAGE_LINK
                                  ? `${item.IMAGE_LINK}`
                                  : item.IS_FOLDER
                                    ? "/folder.png"
                                    : "/docTaiLieu.png"
                              }
                              alt="Tài liệu toán.vn"
                              className="img-fluid"
                              width={44}
                              height={44}
                            />
                          </div>
                        }
                        title={
                          <button
                            style={{
                              border: "none",
                              background: "none",
                              textAlign: "left",
                              padding: 0,
                            }}
                            className="customLink font10pt"
                            title={item.NAME}
                            onClick={() => {
                              if (item.PRICE) {
                                window.open(
                                  `/${item.ROOT_PARENT_NAME_SLUG}/${item.NAME_SLUG}-${item.IDENTITY_KEY}`,
                                  "_blank",
                                );
                              } else {
                                router.push(
                                  `/${item.ROOT_PARENT_NAME_SLUG}/${item.NAME_SLUG}-${item.IDENTITY_KEY}`,
                                  { scroll: false },
                                );
                              }
                            }}
                          >
                            <div
                              dangerouslySetInnerHTML={{ __html: item.NAME }}
                            />
                          </button>
                        }
                      />
                    </List.Item>
                  );
                }}
              />
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <div className={`text-center`}>
          <iframe
            src={documentinfo.LINK_PREVIEW}
            width="800"
            height="750"
          ></iframe>
        </div>
      )}
      {showTopup && (
        <DocumentTopup
          props={{ onClose: toggleTopup, documentinfo: childDocumentInfo }}
        />
      )}
    </section>
  );
};

export default DocumentItem;
