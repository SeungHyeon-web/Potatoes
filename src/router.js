import { autoSaveDocument, manualSaveDocument } from "./editor.js";
import { renderEditor, renderSidebar } from "./rendering.js";
import { fetchDocumentContent, fetchDocuments } from "./utils.js";

/**
 *
 * @param {*} docId
 * @param {*} target "all" | "editor" | "sidebar"
 */
const render = async (docId = "", target = "all") => {
  const pathname = window.location.pathname;

  if (pathname === "/") {
    document.getElementById("doc-title__input").value = `🥔 감자의 Notion`;
    document.getElementById("doc__title").innerText = `🥔 감자의 Notion`;
    document.getElementById(
      "doc-contents"
    ).value = `🥔 감자의 Notion에 오신 것을 환영합니다!
작성한 문서를 확인해보세요! 새로운 문서를 추가하거나 기존 문서를 삭제하는 것도 가능합니다.
    `;
  } else {
    switch (target) {
      case "all":
        const documentsForAll = await fetchDocuments();
        const documentContentForAll = await fetchDocumentContent(docId);
        renderSidebar(documentsForAll);
        renderEditor(documentContentForAll);
        break;

      case "sidebar":
        const documentsForSidebar = await fetchDocuments();
        renderSidebar(documentsForSidebar);
        break;

      case "editor":
        const documentContentForEditor = await fetchDocumentContent(docId);
        renderEditor(documentContentForEditor);
        break;
    }
  }
};

const renderInit = async () => {
  const documentsForSidebar = await fetchDocuments();
  renderSidebar(documentsForSidebar);
  render();
};

// 페이지를 렌더링하는 함수
export const navigateTo = async (state = { id: null }, pathname = "/") => {
  history.pushState(state, null, pathname);

  if (pathname === "/") {
    render(state.id);
  } else {
    render(state.id, "editor");

    autoSaveDocument(state.id);
    manualSaveDocument(state.id);
  }
};

// 페이지 로드 시 라우터 실행
document.addEventListener("DOMContentLoaded", renderInit);

document.body.addEventListener("click", (e) => {
  e.preventDefault();
  const target = e.target;
  const id = target.dataset.id;

  if (target.tagName === "A") {
    console.log(`클릭한 문서 ID : `, id);
    const pathname = new URL(target.href).pathname;

    // 이전에 선택된 문서가 있을 시, 비활성화
    const prevSelectedDoc = document.querySelector(".selected");
    if (prevSelectedDoc) {
      prevSelectedDoc.classList.remove("selected");
    }

    if (id) {
      // 현재 선택된 문서를 활성화
      const currentDoc = document.querySelector(
        `div.flex:has([data-id='${id}'])`
      );
      currentDoc.classList.add("selected");

      const childDocs = currentDoc.parentElement.parentElement;
      if (childDocs.classList.contains("hidden")) {
        childDocs.classList.remove("hidden");
      }
    }

    navigateTo({ id }, pathname);
  }
});

// popstate 이벤트에서 현재 경로를 전달하여 렌더링
window.addEventListener("popstate", async (e) => {
  const id = e.state?.id;

  if (id) {
    // 이전에 선택된 문서가 있을 시, 비활성화
    const prevSelectedDoc = document.querySelector(".selected");
    if (prevSelectedDoc) {
      prevSelectedDoc.classList.remove("selected");
    }

    // 현재 선택된 문서를 활성화
    const currentDoc = document.querySelector(
      `div.flex:has([data-id='${id}'])`
    );
    currentDoc.classList.add("selected");
  }

  render(id, "editor");
});
