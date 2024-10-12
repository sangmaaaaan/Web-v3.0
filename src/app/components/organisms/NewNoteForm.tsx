import React, { useEffect, useState } from "react";
import { FormInput } from "@/app/components/atoms/FormInput";
import FileUpload from "@/app/components/atoms/FileUpload";
import TabComponent from "@/app/components/atoms/Tab";
import { usePracticeContext } from "@/app/context/PracticeContext";
import { getFolders } from "@/app/api/folders";

interface NewNoteFormProps {
  folderId: number;
  noteId: number;
  setNoteName: (name: string) => void;
  setFile: (file: File) => void;
  setKeywords: (keywords: string) => void;
  setRequirement: (requirement: string) => void;
  onSubmit: () => void;
}

const NewNoteForm: React.FC<NewNoteFormProps> = ({ folderId, noteId, setNoteName, onSubmit }) => {
  const { setFile, setKeywords, setRequirement } = usePracticeContext();
  const [keywords, setLocalKeywords] = useState(""); // 로컬 키워드
  const [requirement, setLocalRequirement] = useState(""); // 로컬 요구사항
  const [folderInfo, setFolderInfo] = useState<{ folderName: string; professor: string }>({
    folderName: "",
    professor: "",
  });
  
 // Fetch folder details
 useEffect(() => {
    const fetchFolderDetails = async () => {
      try {
        // 모든 폴더 리스트 가져오기
        const folders = await getFolders();
        
        // 현재 folderId에 해당하는 폴더 찾기
        const currentFolder = folders.find(folder => folder.folderId === folderId);
        if (currentFolder) {
          setFolderInfo({
            folderName: currentFolder.folderName,
            professor: currentFolder.professor,
          });
        } else {
          console.error("Folder not found");
        }
      } catch (error) {
        console.error("Failed to fetch folder details:", error);
      }
    };

    fetchFolderDetails();
  }, [folderId]);

  // 키워드와 요구사항 업데이트
  useEffect(() => {
    setKeywords(keywords);
    setRequirement(requirement);
  }, [keywords, requirement, setKeywords, setRequirement]);

  return (
    <div className="flex flex-col justify-between h-full space-y-4">
    <div className="flex flex-col space-y-5 px-8 pt-4">
        <FormInput
            name="folderName"
            defaultValue={folderInfo.folderName}
            label="폴더명"
            variant="square"
            onChange={() => {}} // 폴더명 수동 변경 시 동작
            labelClassName="mr-14"
            disabled={true}
        />

        <FormInput
            name="professorName"
            defaultValue={folderInfo.professor}
            label="교수자"
            variant="square"
            onChange={() => {}} // 교수자명 수동 변경 시 동작
            labelClassName="mr-14"
            disabled={true}
        /> 
        {/* 강의명 */}
        <FormInput
            name="noteName"
            placeholder="노트 이름을 입력하세요"
            label="강의명"
            variant="square"
            onChange={(e) => setNoteName(e.target.value)}
            labelClassName="mr-14"
        />

        {/* File Upload */}
        <FileUpload noteId={noteId} onUploadSuccess={setFile} onUploadError={console.error} label="강의 파일" labelClassName="mr-[38px] mt-2" />

        {/* Important Content Section */}
        <TabComponent onKeywordChange={setKeywords} onRequirementChange={setRequirement} labelClassName="mr-[38px] mt-2" />
        </div>
    </div>
  );
};

export default NewNoteForm;
