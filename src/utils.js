const BASE_URL = `https://kdt-api.fe.dev-cos.com/documents`;
const username = `potatoes`;

// 문서 목록을 가져옴
export const fetchDocuments = async () => {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: "GET",
      headers: {
        "x-username": username,
      },
    });

    if (!response.ok) throw new Error(`문서 목록 요청 실패`);

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(`문서 목록 요청 실패 : `, error);
  }
};

export const fetchDocumentContent = async (docId = "") => {
  try {
    const response = await fetch(`${BASE_URL}/${docId}`, {
      method: "GET",
      headers: { "x-username": username },
    });

    if (!response.ok) throw new Error("문서 내용을 불러오지 못했습니다.");

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("문서 내용 요청 실패:", error);
  }
};

export const fetchDeleteDocument = async (docId = "") => {
  try {
    const response = await fetch(`${BASE_URL}/${docId}`, {
      method: "DELETE",
      headers: { "x-username": username },
    });

    if (!response.ok) throw new Error(`문서 ${docId}를 삭제하지 못했습니다.`);

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("문서 내용 요청 실패:", error);
  }
};
