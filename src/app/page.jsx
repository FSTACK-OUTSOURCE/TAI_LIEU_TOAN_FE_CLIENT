import { getDocuments } from '@/endpoints/document';
import FolderItem from '@/components/folderitem';
import { Tabs } from 'antd';
import PinItem from '@/components/pinitem';
import { getGroups } from '@/endpoints/group';
import DocumentGroupItem from '@/components/documentgroupitem';
import MainTempalte from '@/components/mainTempalte';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Banner from '@/components/banner';

const fetchDocuments = async ({ query }) => {
  var response = await getDocuments({ query });
  return response.success ? response.Items : []
}

const fetchGroups = async ({ query }) => {
  var response = await getGroups({ query });
  return response.success ? response.Items : []
}

const fetchPins = async () => {

  var tabs = [
    { title: "nổi bật", filter: { Columns: "PIN,ROOT_PARENT" } },
    // { title: "miễn phí", filter: { PRICE: 0, IS_FOLDER: false, Columns: "*,ROOT_PARENT" } }
  ]
  for (var item of tabs) {
    const result = await fetchDocuments({ query: item.filter });
    item.documents = result;
  }
  return tabs;
}


export default async function Page() {

  var folders = await fetchDocuments({ query: { PARENT_DOCUMENT_ID: "00000000-0000-0000-0000-000000000000", IS_FOLDER: true, Columns: "*" } });
  var tabs = await fetchPins();
  var groups = await fetchGroups({ query: { IS_HIDDEN: false } });

  for (var group of groups) {
    if (group.DOCUMENT_IDS) {
      var documents = await fetchDocuments({ query: { DOCUMENT_IDS: group.DOCUMENT_IDS, Columns: "BOUGHT" } })
      group.documents = documents
    }
  }
  return (
    <MainTempalte>
    <section>
      <div className="mt-3 divLe categoriesBox backgroundHome">
        <div className="centerContent fontBold titleYellow">
          DANH MỤC
        </div>
        <div className={`card-body  col-lg-12 col-xs-12`} style={{ backgroundColor: '#fdf9ed' }}>
          <div className="row">
            {folders.map((folder, key) =>
              <FolderItem props={{ folder }} key={key} />
            )}
          </div>
        </div>
      </div>
      {/* banner */}
      <div style={{
        margin:"20px 0"
      }}>
        <Banner/>
      </div>
      <div className="divLe">
        <Tabs
          defaultActiveKey="0"
          type="card"
          size="small"
          items={tabs.map((pin, i) => {
            return {
              label: `Tài liệu ${pin.title}`,
              key: i.toString(),
              children: <PinItem props={{ pin }} />,
            };
          })}
        />
      </div>
      <div className="divLe">
        <DocumentGroupItem props={{ groups }} />
      </div>
    </section>
    </MainTempalte>
  )
}