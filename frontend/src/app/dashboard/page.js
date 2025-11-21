"use client";
import { useState, useRef, useEffect } from "react";
import { Upload, Send } from "lucide-react";
import axios from "axios";

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [message, setMessage] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);

  const chatContainerRef = useRef(null);

  // Scroll to bottom on new chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, loadingChat]);

  // Upload PDF
  const handleUpload = async () => {
    if (!file) return;
    setLoadingUpload(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/upload-pdf",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setMessage("PDF uploaded successfully!");
      setPdfUploaded(true);
      console.log(res.data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to upload PDF.");
    } finally {
      setLoadingUpload(false);
    }
  };

  // Send chat query
  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const userMessage = chatInput.trim();

    setChatHistory([...chatHistory, { sender: "user", text: userMessage }]);
    setChatInput("");
    setLoadingChat(true);

    try {
      const res = await axios.post("http://localhost:8000/api/user-query", {
        user_query: userMessage,
      });

      setChatHistory((prev) => [
        ...prev,
        { sender: "bot", text: res.data.response },
      ]);
    } catch (error) {
      console.error(error);
      setChatHistory((prev) => [
        ...prev,
        { sender: "bot", text: "Error fetching response." },
      ]);
    } finally {
      setLoadingChat(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100">
      {/* Left: Upload Section */}
      <div className="w-1/3 border-r border-gray-800 p-6 bg-gray-900/70 backdrop-blur-lg">
        <h2 className="text-xl font-semibold mb-6 text-blue-400 flex items-center gap-2">
          <Upload className="w-5 h-5" /> Upload PDF
        </h2>

        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-700 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-gray-800/50 transition">
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <span className="text-gray-400 text-sm">
            {file ? (
              <span className="text-blue-400 font-medium">{file.name}</span>
            ) : (
              "Click or drag a PDF file here"
            )}
          </span>
        </label>

        {file && (
          <button
            onClick={handleUpload}
            disabled={loadingUpload}
            className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition shadow-lg disabled:opacity-50"
          >
            {loadingUpload ? "Uploading..." : "Process PDF"}
          </button>
        )}

        {message && <p className="mt-4 text-sm text-gray-300">{message}</p>}
      </div>

      {/* Right: Chat Section */}
      {pdfUploaded && (
        <div className="flex-1 flex flex-col p-6">
          <h2 className="text-xl font-semibold mb-6 text-blue-400">
            Chat With Your PDF
          </h2>

          <div
            ref={chatContainerRef}
            className="flex-1 border border-gray-800 rounded-xl p-4 bg-gray-900/70 overflow-y-auto shadow-inner flex flex-col gap-2"
          >
            {chatHistory.length === 0 && (
              <p className="text-gray-500 italic">
                Chat responses will appear here...
              </p>
            )}
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`px-3 py-2 rounded-lg max-w-[80%] ${
                  msg.sender === "user"
                    ? "bg-blue-600 self-end text-white"
                    : "bg-gray-800/70 self-start text-gray-200"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loadingChat && (
              <p className="text-gray-400 italic self-start">
                Bot is typing...
              </p>
            )}
          </div>

          <div className="mt-4 flex">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask something about the PDF..."
              className="flex-1 px-4 py-3 rounded-l-lg bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            />
            <button
              onClick={handleSendChat}
              disabled={loadingChat}
              className="px-5 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-500 transition flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
