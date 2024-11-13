import { autoSaveDocument, manualSaveDocument } from "./editor.js";
import { renderEditor, renderSidebar } from "./rendering.js";
import { fetchDocumentContent, fetchDocuments } from "./utils.js";

const render = async (docId = "") => {
  const pathname = window.location.pathname;

  if (pathname === "/") {
    document.getElementById("doc-title__input").value = `🥔 감자의 Notion`;
    document.getElementById("doc__title").innerText = `🥔 감자의 Notion`;
    document.getElementById(
      "doc-contents"
    ).value = `🥔 감자의 Notion에 오신 것을 환영합니다!
작성한 문서를 확인해보세요! 새로운 문서를 추가하거나 기존 문서를 삭제하는 것도 가능합니다.
    `;
    const documents = await fetchDocuments();
    renderSidebar(documents);
  } else {
    const documents = await fetchDocuments();
    const documentContent = await fetchDocumentContent(docId);
    renderSidebar(documents);
    renderEditor(documentContent);
  }
};

// 페이지를 렌더링하는 함수
export const navigateTo = async (state = { id: null }, pathname) => {
  history.pushState(state, null, pathname);

  if (pathname === "/") {
    render(state.id);
  } else {
    const documentContent = await fetchDocumentContent(state.id);
    renderEditor(documentContent);

    autoSaveDocument(state.id);
    manualSaveDocument(state.id);
  }
};

// 페이지 로드 시 라우터 실행
document.addEventListener("DOMContentLoaded", render);

document.body.addEventListener("click", (e) => {
  e.preventDefault();
  const target = e.target;
  const id = target.dataset.id;

  if (target.tagName === "A") {
    const pathname = new URL(target.href).pathname;
    navigateTo({ id }, pathname);
  }
});

// popstate 이벤트에서 현재 경로를 전달하여 렌더링
window.addEventListener("popstate", (e) => {
  render(e.state?.id);
});
