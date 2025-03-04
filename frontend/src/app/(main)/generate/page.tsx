"use client";

import React, { useState, useEffect } from "react";
import PagesWrapper from "@/components/PagesWrapper";
import PresentationForm from "../_components/PresentationForm";
import { toast } from "react-toastify";
import Generated from "../_components/Generated";
import { GeneratePPTResponse } from "@/types/types";
import { apiFetcher } from "@/config/axios";
import { LayoutPreference } from "@/types/types";



function GeneratePage() {
  const [topic, setTopic] = useState<string>("");
  const [numSlides, setNumSlides] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(false);
  const [pptFile, setPptFile] = useState<string>("");
  const [isFileReady, setIsFileReady] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [layoutPreference, setLayoutPreference] = useState<LayoutPreference>("Varied");


  useEffect(() => {
    console.log("pptFile updated:", pptFile);
    if (pptFile) {
      checkIfFileIsReady(pptFile);
    }
  }, [pptFile]);
    // Handler for "Generate Again"
    const handleGenerateAgain = () => {
      setPptFile("");
      setIsFileReady(false);
      setTopic(""); 
      setNumSlides(5); 
    };

  const handleGeneratePPT = async () => {
    setLoading(true);
    try {
      const response = await apiFetcher.post<GeneratePPTResponse>("/generate_ppt", {
        topic,
        num_slides: numSlides,
        layout_preference: layoutPreference,
      });
      if (response.data?.filename) {
        setPptFile(response.data.filename);
        setIsFileReady(true); // Reset file ready state
      } else {
        console.error("No filename in API response", response);
      }
      toast.success(response.data.message || "Presentation generated successfully! 🎉", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light"
        });
    } catch (error) {
      toast.error("Failed to Generate Presentation. Please try again! 😞", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light"
        });
      console.error("Error generating PPT:", error);
    }
    setLoading(false);
  };

  // Check if file is available for download
  const checkIfFileIsReady = async (filename: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await apiFetcher.head(`/download_ppt/${filename}`);
        if (response.status === 200) {
          setIsFileReady(true);
          toast.success("Presentation downloaded successfully! 🎉", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light"
            });
          clearInterval(interval);
        }
      } catch (error) {
        console.log("File not ready yet, checking again...", error);
      }
    }, 3000);
  };

  const handleDownloadPPT = async () => {
    if (!pptFile || !isFileReady) {
      toast.error("File is not ready yet!");
      return;
    }
    setIsDownloading(true)
    try {
      const response = await apiFetcher.get(`/download_ppt/${pptFile}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", pptFile);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Presentation Downloaded Successfully! 🎉", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light"
        });
    } catch (error) {
      toast.error("Failed to Download the Presentation 😞", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light"
        });
      console.error("Error downloading PPT:", error);
      setIsDownloading(false)
    } finally {
      setIsDownloading(false)
    }
  };

  return (
    <PagesWrapper>
      <div className="w-full mx-auto text-left px-4 md:w-11/12 xl:w-9/12 md:text-center">
        <h1 className="mb-4 text-xl font-extrabold leading-none tracking-normal text-gray-900 md:text-4xl md:tracking-tight">
          <span className="block w-full text-transparent text-center bg-clip-text bg-gradient-to-r from-green-400 to-purple-500 lg:inline">
            Generate Presentations
          </span>
        </h1>
        <div className="parent-container mx-auto mt-10 max-w-2xl rounded-lg border-2 border-blue-400 p-6">
        {!pptFile || !isFileReady ? (
          <PresentationForm
            topic={topic}
            numSlides={numSlides}
            setTopic={setTopic}
            setNumSlides={setNumSlides}
            loading={loading}
            handleGeneratePPT={handleGeneratePPT}
            layoutPreference={layoutPreference}
            setLayoutPreference={setLayoutPreference}
          />
        ) : (
          <Generated
            isDownloading={isDownloading}
            handleDownloadPPT={handleDownloadPPT}
            handleGenerateAgain={handleGenerateAgain}
            pptFile={pptFile} 
          />
        )}
        </div>
      </div>
    </PagesWrapper>
  );
}

export default GeneratePage;
