"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Gallery from "./gallery";
import "../../styles/globals.css";
import GalleryForm from "./gallery-form";
import CommentsForm from "./comments-form";
import Comments from "./comments";

declare global {
  interface Window {
    voiceflow: any;
  }
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("comments");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.voiceflow.com/widget/bundle.mjs";
    script.onload = function () {
      window.voiceflow.chat
        .load({
          verify: { projectID: "658352b659d44a121ceb1565" },
          url: "https://general-runtime.voiceflow.com",
          versionID: "production",
        })
        .then(() => {
          setTimeout(function () {
            window.voiceflow.chat.open();
            updateChatbotPositionAndSize();
            initializeMutationObserver(); // Initialize the MutationObserver here
          }, 200);
        });
    };
    document.body.appendChild(script);

    function removeHeader(chatbot_window: HTMLElement) {
      let headerElements = [".vfrc-header", ".vfrc-assistant-info"];
      headerElements.forEach(function (selector) {
        let element = chatbot_window.querySelector(selector);
        if (element) {
          element.remove();
        }
      });
      styleChatbotInput(chatbot_window);
      styleChatbotWindow(chatbot_window);
    }

    function styleChatbotInput(chatbot_window: HTMLElement) {
      let chatbot_window_input = chatbot_window.querySelector(
        ".vfrc-chat-input textarea"
      ) as HTMLElement;
      let chatbot_window_input_label = chatbot_window.querySelector(
        ".vfrc-chat-input label"
      ) as HTMLElement;

      if (chatbot_window_input) {
        chatbot_window_input.style.background = "none";
        chatbot_window_input.style.color = "white";
        chatbot_window_input_label.style.background = "none";
      }
    }

    function styleChatbotWindow(chatbot_window: HTMLElement) {
      chatbot_window.style.background = "#101010";
      chatbot_window.style.border = "1px solid rgb(41, 41, 41)";
      chatbot_window.style.borderRadius = "10px";
    }

    function updateChatbotPositionAndSize() {
      let iframe = document.querySelector("#chatbot-container");
      let chatbot = document.getElementById("voiceflow-chat");

      if (chatbot && chatbot.shadowRoot) {
        let chatbot_window = chatbot.shadowRoot.querySelector(
          ".vfrc-widget--chat"
        ) as HTMLElement;
        if (chatbot_window && iframe) {
          let chatbot_window_body = chatbot_window.querySelector(
            ".vfrc-chat"
          ) as HTMLElement;
          let rect = iframe.getBoundingClientRect();
          chatbot_window.style.position = "fixed";
          chatbot_window.style.left = rect.left + "px";
          chatbot_window.style.top = rect.top + "px";
          chatbot_window.style.width = rect.width + "px";
          chatbot_window.style.height = rect.height + "px";
          chatbot_window_body.style.background =
            "linear-gradient(135deg, #141414 0%, #141414 100%), linear-gradient(135deg, #3E3E3E 0%, rgba(62, 62, 62, 0) 44.79%)";
          styleChatbotWindow(chatbot_window);
          styleChatbotInput(chatbot_window);
          removeHeader(chatbot_window);
        }
      }
    }

    function initializeMutationObserver() {
      var observer = new MutationObserver(function (mutationsList, observer) {
        for (var mutation of mutationsList) {
          if (mutation.type === "childList") {
            var chatbot = document.getElementById("voiceflow-chat");
            if (chatbot && chatbot.shadowRoot) {
              var chatbot_window = chatbot.shadowRoot.querySelector(
                ".vfrc-widget--chat"
              ) as HTMLElement;
              if (chatbot_window) {
                removeHeader(chatbot_window);
              }
            }
          }
        }
      });
      var targetNode = document.getElementById("voiceflow-chat");
      if (targetNode && targetNode.shadowRoot) {
        observer.observe(targetNode.shadowRoot, {
          childList: true,
          subtree: true,
        });
      }
    }

    window.addEventListener("scroll", updateChatbotPositionAndSize);
    window.addEventListener("resize", updateChatbotPositionAndSize);
    window.addEventListener(
      "message",
      (event) => {
        if (JSON.parse(event.data).type.includes("voiceflow")) {
          updateChatbotPositionAndSize();
        }
      },
      false
    );

    return () => {
      document.body.removeChild(script);
      window.removeEventListener("scroll", updateChatbotPositionAndSize);
      window.removeEventListener("resize", updateChatbotPositionAndSize);
      window.removeEventListener(
        "message",
        (event) => {
          if (JSON.parse(event.data).type.includes("voiceflow")) {
            updateChatbotPositionAndSize();
          }
        },
        false
      );
    };
  }, []);

  return (
    <main className="w-full sm:px-4 md:px-8 flex flex-col items-center justify-between">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <section className="header my-12">
          <h1 className="text-4xl font-bold">Gestation</h1>
          <h2 className="text-2xl font-bold mt-4">A Collection of Memories</h2>
        </section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          <div>
            <div className="h-[400px]" id="chatbot-container">
              {/* Insert your chatbot component here */}
            </div>
            <section className="paragraph-section mt-8">
              <p>
                Thirty-three years ago, Gestation took root in Palisades Park, a
                sculpture born as I welcomed my first child, symbolizing the
                intertwining of life, the rebirth of the sun, and our
                interconnectedness. This piece, dedicated to those who strive to
                heal our planet, stands as a beacon of hope and continuity. As
                Gestation marks its 33rd anniversary, it remains a silent
                witness to our community&apos;s journey—capturing our joys,
                reflections, and shared moments. It&apos;s more than a
                sculpture; it&apos;s a testament to the cycles of nature and the
                resilience of life. I warmly invite you to share how Gestation
                has graced your life. Your stories and memories are the
                heartbeat of its legacy, celebrating the rich tapestry of our
                community and the spirit of renewal that binds us.
              </p>
            </section>
          </div>
          <div>
            <CommentsForm />

            {/* <div className="my-12" /> */}
            {/* <GalleryForm /> */}
            {/* <Gallery /> */}

            <div className="flex justify-center my-4 mt-14">
              <button
                onClick={() => setActiveTab("comments")}
                className={`w-full flex-1 px-4 py-2 ${
                  activeTab === "comments"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-black"
                }`}
              >
                Comments
              </button>
              <button
                onClick={() => setActiveTab("gallery")}
                className={`w-full flex-1 px-4 py-2 ${
                  activeTab === "gallery"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-black"
                }`}
              >
                Gallery
              </button>
            </div>
            {activeTab === "comments" ? <Comments /> : <Gallery />}
          </div>
        </div>
      </div>
    </main>
  );
}
