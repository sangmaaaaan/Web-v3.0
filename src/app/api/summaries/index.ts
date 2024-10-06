import axios from "axios";

interface CreatePracticeReq {
  practiceSize: number
  type: string; // 문제의 유형 (예: "OX")
  keywords: string; // 키워드 (예: "네트워크 강의 OSI")
  requirement: string; // 요약에 필요한 요구사항 (예: "요약에 필요한 요구사항")
}

interface PostSummaryProps {
  file: File; // 전송할 파일
  request: CreatePracticeReq; // `CreatePracticeReq` 형식의 JSON 데이터
}

// 파일과 JSON 데이터를 함께 서버로 전송하는 함수
export const postSummary = async ({ file, request }: PostSummaryProps) => {
  // FormData 객체 생성
  const formData = new FormData();

  // 파일을 FormData에 추가
  formData.append("file", file);

  // JSON 데이터를 문자열로 변환 후 FormData에 추가
  formData.append(
    "createPracticeReq",
    new Blob([JSON.stringify(request)], {
      type: "application/json", // Blob을 올바른 MIME 타입으로 생성
    })
  );

  try {
    // 서버로 POST 요청 보내기
    const response = await axios.post(
      "http://43.201.165.4:8080/api/v1/professor/practice/1/new",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // FormData를 전송할 때 올바른 Content-Type 설정
        },
      }
    );

    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};
