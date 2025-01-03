import React from "react";
import { useContext, useEffect, useState, useRef } from "react";
import { Header } from "../components/header";
import { AlertContext } from "../context/alertContext";
import { AlertPopUp } from "../components/alertPopUp";

import Arrow from "../imgs/arrow.svg";

// Chating Components
import { ChatingList } from "../components/chatingList";
import { ChatingTo } from "../components/chating";
import axios from "axios";
import { url } from "./config";

//CHECKLIST
/**
 * [x]채팅 메시지 보내기, 조회
 * [x]채팅방 조회
 * [ ]채팅방 삭제 & 나가기
 * [ ]채팅방 생성 & 가입
 */

export function Chating() {
  const { alertPopUp, setAlertPopUp } = useContext(AlertContext);

  const [chatList, setChatList] = useState([]);
  const [chatMsg, setChatMsg] = useState([]);
  const [textValue, setTextValue] = useState(0);
  const textarea = useRef();
  const textMaxLen = 300;

  // 텍스트 영역 높이 자동 조절
  const handleResizeHeight = () => {
    textarea.current.style.height = "auto"; // 높이 초기화
    const scrollHeight = textarea.current.scrollHeight; // 현재 스크롤 높이 가져오기

    // 최대 높이 144px로 제한
    if (scrollHeight <= 120) {
      textarea.current.style.height = `${scrollHeight}px`;
    } else {
      textarea.current.style.height = "144px"; // 최대 높이 설정
    }
  };

  // 입력 글자 수 카운트
  const handleInputCounter = (e) => {
    setTextValue(e.target.value.length);
  };

  // 채팅 메시지 보내기
  const msgPost = (event) => {
    if (event.key === "Enter") {
      if (event.shiftKey) {
        // Shift + Enter: 줄바꿈 허용
        return;
      } else {
        // Enter: 메시지 전송
        event.preventDefault();
        axios
          .post(`${url}/chat/msg/${chatList.id}`, { withCredentials: true })
          .then((res) => console.log(res.data))
          .catch((err) => console.log(err));
      }
    }
  };

  // 채팅방 목록 조회
  useEffect(() => {
    axios
      .get(`${url}/chat/room/part`, {
        withCredentials: true,
      })
      .then((res) => {
        setChatList(res.data.result);
      });
  }, []);

  // 채팅 메시지 조회
  useEffect(() => {
    axios
      .get(`${url}/chat/msg/${chatList.id}`, { withCredentials: true })
      .then((res) => {
        console.log(res.data);
        setChatMsg(res.data.result);
      })
      .catch((err) => console.log(err));
  }, [chatMsg]);

  console.log(chatList);
  console.log(chatMsg);

  return (
    <div className="flex flex-col items-center w-full h-[100vh]">
      <Header />
      {alertPopUp && <AlertPopUp />}
      <div className="flex justify-center pt-[60px] h-full w-3/5">
        {/* 전체채팅 */}
        <div className="flex flex-col w-2/5 h-full border border-gray-400">
          <header>
            <h1 className="text-[24px] font-semibold p-[25px]">전체 채팅</h1>
          </header>
          <main className="overflow-y-scroll no-scrollbar">
            {/* {chatList.map((v) => {
              return <ChatingList key={v.id} title={v.title} />;
            })} */}
          </main>
        </div>

        {/* 채팅창 */}
        <div className="flex flex-col w-3/5 h-full border border-l-0 border-gray-400">
          <header className="px-3 py-4 border-b-2">
            <h2 className="text-xl font-semibold">
              {/*채팅방 이름 추가*/}김지훈
            </h2>
            <h4 className="text-xs font-medium text-[#555555]">
              {/*채팅방 상태 추가*/}교동 짬뽕 듣는중
            </h4>
          </header>
          <main className="flex flex-col flex-1 max-h-full overflow-y-scroll no-scrollbar">
            {/* 채팅방 메시지 조회 MAP함수 사용예정 */}
            {/* {chatMsg.map((v) => {
              <ChatingTo key={v.id} msg={v.msg} />;
            })} */}
          </main>
          <form className="flex justify-center items-center border-t border-[#C4C4C4] px-3 py-5">
            <div className="flex justify-around items-start bg-[#F0F0F0] px-5 py-3 flex-grow rounded-3xl h-full">
              <textarea
                className="flex-grow pr-3 bg-transparent border-none outline-none resize-none no-scrollbar"
                placeholder="메세지를 보내보세요!"
                onChange={(e) => {
                  handleResizeHeight();
                  handleInputCounter(e);
                }}
                onKeyDown={(e) => {
                  msgPost(e);
                }}
                maxLength={textMaxLen}
                ref={textarea}
                required
                rows="1"
              />
              <div className="flex flex-col justify-between w-6 h-full align-middle">
                <input
                  type="file"
                  id="fileUpload"
                  max={300}
                  className="hidden "
                />
                {textValue >= textMaxLen - 50 ? (
                  <span
                    className={`text-right ${
                      textValue === textMaxLen ? "text-red-400" : ""
                    }`}
                  >
                    {textValue}
                  </span>
                ) : null}
              </div>
            </div>
            <button
              className="flex justify-center items-center 
              bg-[#5956E8] rounded-[50%] w-12 h-12"
            >
              {/* 화살표 */}
              <img src={Arrow} alt="arrow" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
