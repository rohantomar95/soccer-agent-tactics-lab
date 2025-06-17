
"use client";

import React, { useState, ChangeEvent, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Sparkles, ArrowDown } from "lucide-react";
import { Textarea } from "./ui/textarea";
import SoccerConfiguration from "./SoccerConfiguration";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

// Mock types and constants
interface HardcodedSessionType {
  id: number;
  name: string;
  sessionType: string;
  active: boolean;
  characterLimit: number;
}

const HARDCODED_SESSION_TYPES: HardcodedSessionType[] = [
  { id: 1, name: "Chat", sessionType: "chat", active: true, characterLimit: 1000 },
  { id: 2, name: "Soccer", sessionType: "soccer", active: true, characterLimit: 2000 },
  { id: 3, name: "Trading", sessionType: "trading", active: true, characterLimit: 1500 },
];

const SPACE_PROMPT_PLACEHOLDER_MAP: { [key: number]: string } = {
  1: "Enter your chat agent instructions...",
  2: "Enter your soccer agent tactical instructions...",
  3: "Enter your trading agent strategy...",
};

const AGENT_NAME_LENGTH = 30;

interface SoccerConfig {
  formation: string;
  style: string;
  tempo: string;
  mentality: string;
  resources: {
    attack: number;
    midfield: number;
    defense: number;
  };
  pressing_intensity: string;
  risk_reward: string;
  fouling_strategy: string;
  defensive_line: string;
  specialists: string[];
}

const DappCreateAgentModal: React.FC<{ 
  closeModal: () => void; 
  selectedSpaceId?: number; 
  sessionType?: string;
  selectedSpaceNameOutside?: string;
}> = ({
  closeModal,
  selectedSpaceId,
  sessionType,
  selectedSpaceNameOutside
}) => {
  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<File>();
  const [systemPrompt, setSystemPrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedImageLink, setGeneratedImageLink] = useState<string>();
  const [isFullPageLoader, setIsFullPageLoader] = useState<boolean>(false);
  const [blobUrl, setBlobUrl] = useState<string>();

  const [selectedSpace, setSelectedSpace] = useState<number>(selectedSpaceId || 1);
  const [selectedSpaceName, setSelectedSpaceName] = useState<string>(selectedSpaceNameOutside || '');
  const [battleType, setBattleType] = useState<string>(sessionType || HARDCODED_SESSION_TYPES[0].sessionType);
  const [characterLimit, setCharacterLimit] = useState<number>(1000);
  const [searchText, setSearchText] = useState<string>(selectedSpaceNameOutside || "");
  const [isSpaceClicked, setIsSpaceClicked] = useState<boolean>(false);

  const [errors, setErrors] = useState({
    name: "",
    systemPrompt: "",
  });

  // Soccer configuration state
  const [soccerConfig, setSoccerConfig] = useState<SoccerConfig>({
    formation: '4-4-2',
    style: 'possession',
    tempo: 'medium',
    mentality: 'balanced',
    resources: {
      attack: 80,
      midfield: 80,
      defense: 80
    },
    pressing_intensity: 'selective',
    risk_reward: 'ambitious',
    fouling_strategy: 'professional',
    defensive_line: 'medium_line',
    specialists: []
  });

  const agentNameRef = useRef<HTMLDivElement>(null);
  const systemPromptRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check if current space is soccer
  const isSoccerSpace = () => {
    const currentSpace = HARDCODED_SESSION_TYPES.find(space => space.id === selectedSpace);
    return currentSpace?.sessionType === 'soccer' || currentSpace?.name?.toLowerCase().includes('soccer');
  };

  const handleGenerateName = async () => {
    try {
      setIsGenerating(true);
      // Mock name generation
      const mockNames = ["SoccerPro", "TacticalMaster", "FieldCommander", "GoalSeeker"];
      const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
      setName(randomName);
      setErrors((prev) => ({ ...prev, name: "" }));
    } catch (error) {
      console.error("Error generating name:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePromptAI = async () => {
    try {
      setIsGenerating(true);
      
      // Mock prompt generation based on soccer config if soccer space
      if (isSoccerSpace()) {
        const mockPrompt = `You are a tactical soccer agent with ${soccerConfig.formation} formation, playing with ${soccerConfig.style} style at ${soccerConfig.tempo} tempo. Your mentality is ${soccerConfig.mentality} with ${soccerConfig.pressing_intensity} pressing intensity.`;
        setSystemPrompt(mockPrompt.slice(0, characterLimit));
      } else {
        const mockPrompt = `You are an AI agent specialized in ${battleType}. Provide helpful and accurate responses.`;
        setSystemPrompt(mockPrompt.slice(0, characterLimit));
      }
      
      setErrors((prev) => ({ ...prev, systemPrompt: "" }));
    } catch (error) {
      console.error("Error generating prompt:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];

    if (file) {
      const maxSizeInMB = 1;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

      if (file.size > maxSizeInBytes) {
        alert(`Image size exceeds ${maxSizeInMB} MB. Please upload a smaller file.`);
        return;
      }

      setImage(file);
      setBlobUrl(URL.createObjectURL(file));
    }
  };

  const handleCreateAgent = async () => {
    const newErrors: { name?: string; systemPrompt?: string } = {};

    if (!selectedSpace) {
      alert("Please select a space");
      return;
    }

    if (!name) newErrors.name = "Please enter agent name";
    if (!systemPrompt) newErrors.systemPrompt = "Please enter a system prompt";

    if (Object.keys(newErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...newErrors }));

      // Scroll to the first missing field
      if (!name) agentNameRef.current?.scrollIntoView({ behavior: "smooth" });
      else if (!systemPrompt) systemPromptRef.current?.scrollIntoView({ behavior: "smooth" });

      return;
    }

    if (name.length > AGENT_NAME_LENGTH) {
      alert(`Name should be less than ${AGENT_NAME_LENGTH} characters`);
      return;
    }

    try {
      setIsFullPageLoader(true);

      // Include soccer config in the request if soccer space is selected
      const agentData: any = {
        name,
        battleType: battleType,
        sessionTypeId: selectedSpace,
        systemPrompt,
        avatarLink: generatedImageLink,
      };

      // Add soccer configuration if soccer space is selected
      if (isSoccerSpace()) {
        agentData.soccerConfig = soccerConfig;
      }

      console.log("Creating agent with data:", agentData);
      
      // Mock success
      setTimeout(() => {
        setIsFullPageLoader(false);
        alert("Agent created successfully!");
        closeModal();
      }, 2000);

    } catch (err) {
      console.error("Error creating agent:", err);
      setIsFullPageLoader(false);
      alert("Unable to create agent.");
    }
  };

  const handleSpaceToggle = (space: HardcodedSessionType) => {
    setName("");
    setSystemPrompt("");
    setSelectedSpace(space.id);
    setBattleType(space.sessionType);
    setCharacterLimit(space.characterLimit);
    setIsSpaceClicked(false);
    setSearchText(space.name);
    
    // Reset soccer config when switching spaces
    if (space.sessionType !== 'soccer' && !space.name?.toLowerCase().includes('soccer')) {
      setSoccerConfig({
        formation: '4-4-2',
        style: 'possession',
        tempo: 'medium',
        mentality: 'balanced',
        resources: {
          attack: 80,
          midfield: 80,
          defense: 80
        },
        pressing_intensity: 'selective',
        risk_reward: 'ambitious',
        fouling_strategy: 'professional',
        defensive_line: 'medium_line',
        specialists: []
      });
    }
  };

  const filteredSpaces = HARDCODED_SESSION_TYPES?.filter((space) => 
    space?.name.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsSpaceClicked(false);
      }
    };

    if (isSpaceClicked) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSpaceClicked]);

  const handleButtonClick = (handler?: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    if (handler) handler();
  };

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeModal}>
      {isFullPageLoader && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60">
          <div className="text-white text-xl">Creating Agent...</div>
        </div>
      )}

      <div
        className="bg-dapp-bgPage rounded-[4.267rem] md:rounded-[1.25rem] gap-[3.2rem] md:gap-0 backdrop-blur-[220px] brightness-100 md:border-l-[0.078rem] overflow-hidden w-full md:w-[40.25rem] border-dapp-strokeSecondary max-h-[90vh] overflow-y-auto hide-scrollbar"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col w-full items-start justify-between gap-[4.267rem] md:gap-[0.938rem] h-full relative">
          <div className="inline-flex flex-col relative gap-[4.267rem] md:gap-[1rem] pb-[20rem] md:pb-[1.5rem] flex-none items-start overflow-y-scroll hide-scrollbar md:h-full z-20 w-full md:p-[1.563rem]">
            
            {/* Header */}
            <div className="flex flex-col relative w-full items-start self-stretch pt-[4.267rem] pb-[2.133rem] md:pb-0 md:pt-0 gap-[4.267rem] md:gap-[0.938rem]">
              <div className="flex items-center justify-between w-full border-b-[0.267rem] md:border-b-0 border-dapp-strokeSecondary pb-[2.133rem] md:pb-0">
                <div className="flex items-center justify-between w-full px-[3.2rem] md:px-0">
                  <div className="w-fit whitespace-nowrap md:leading-[1.875rem] text-dapp-textPrimary text-header md:text-[1.45rem] font-semibold font-polySansTrialMedianMono tracking-[-0.027rem] md:tracking-[-0.008rem]">
                    Create New Agent
                  </div>
                  <div
                    className="inline-flex items-center p-[2.133rem] md:p-[0.625rem] gap-[1.6rem] md:gap-[0.469rem] rounded-[1.6rem] md:rounded-[0.469rem] border-[0.267rem] md:border-[0.078rem] border-dapp-strokeSecondary backdrop-blur-[3.2rem] md:backdrop-blur-[0.938rem] brightness-100 cursor-pointer"
                    onClick={handleButtonClick(closeModal)}
                  >
                    <X className="size-[4.267rem] md:size-[1.25rem]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Space Selection */}
            <div className="w-full h-full px-[3.2rem] md:px-0 flex flex-col gap-[2.667rem] md:gap-[0.625rem]">
              <div className="flex flex-col w-full relative items-start self-stretch backdrop-blur-[220px] brightness-100 md:gap-[0.781rem] rounded-[3.2rem] md:rounded-[0.938rem] border-[0.267rem] md:border-[0.078rem] border-dapp-strokeSecondary bg-dapp-cardPrimary z-30">
                <div className="flex items-center w-full p-[4.267rem] md:p-[1.1rem] justify-between h-[12.8rem] md:h-[3rem] bg-dapp-surfaceCardTitle">
                  <div className="flex-1 md:leading-[1.25rem] tracking-[-0.021rem] md:tracking-[-0.006rem] text-dapp-textPrimary text-subheader md:text-[1.1rem] font-semibold font-polySansTrialMedianMono">
                    Select Space Type
                  </div>
                </div>

                <div className="flex flex-col p-[4.267rem] md:p-[1.25rem] md:pt-0 flex-none w-full relative items-start self-stretch gap-[2.133rem] md:gap-[0.625rem] md:pb-[1rem]">
                  <div
                    className="relative w-full flex-none flex items-start self-stretch gap-[2.133rem] md:gap-[0.625rem]"
                    ref={inputRef}
                  >
                    <Input
                      placeholder="Search Space"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      className="flex-1 flex-grow bg-white/5 border border-dapp-strokeSecondary text-white"
                      onClick={() => {
                        setIsSpaceClicked(true);
                        setSearchText("");
                        setSelectedSpace(0);
                      }}
                    />
                  </div>

                  {isSpaceClicked && (
                    <div
                      ref={dropdownRef}
                      className="flex flex-none flex-col items-start self-stretch rounded-[1.6rem] md:rounded-[0.469rem] h-[32rem] md:h-[9.375rem] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-500 [&::-webkit-scrollbar]:w-[0.313rem] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-dapp-buttonTertiary [&::-webkit-scrollbar-thumb]:rounded-[0.469rem] [&::-webkit-scrollbar-thumb:hover]:bg-white absolute bg-[#191b20] top-[18rem] md:top-[3rem] w-[94%]"
                    >
                      {filteredSpaces?.map((space) => {
                        const isSelected = selectedSpace === space.id;

                        return (
                          <div
                            key={space.id}
                            className="w-full relative items-center justify-between self-stretch flex flex-none gap-[2.133rem] md:gap-[0.625rem] p-[3.2rem] md:p-[0.625rem] hover:bg-dapp-surfaceMenu cursor-pointer"
                            onClick={() => handleSpaceToggle(space)}
                          >
                            <div className="items-center self-stretch flex flex-none gap-[2.133rem] md:gap-[0.625rem]">
                              <div className="relative size-[4.267rem] md:size-[1.25rem] flex items-center justify-center">
                                <div className="size-[4.267rem] md:w-5 md:h-5 rounded-full border-2 transition-colors border-[#e5e1ea33] flex items-center justify-center">
                                  {isSelected && <div className="size-[1.6rem] md:size-[0.469rem] rounded-full bg-[#73fff8]" />}
                                </div>
                              </div>

                              <div className="inline-flex relative flex-none items-center gap-[2.133rem] md:gap-[0.625rem]">
                                <div className="w-fit whitespace-nowrap md:leading-[1.094rem] text-subheader2 md:text-[1rem] font-normal font-sourceSansRegular text-dapp-textPrimary">
                                  {space.name}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Soccer Configuration - only show if soccer space is selected */}
            {isSoccerSpace() && (
              <div className="w-full h-full px-[3.2rem] md:px-0">
                <SoccerConfiguration 
                  config={soccerConfig} 
                  onConfigChange={setSoccerConfig} 
                />
              </div>
            )}

            {/* Agent Info */}
            <div className="w-full h-full relative px-[3.2rem] md:px-0">
              <div className="flex flex-col w-full relative items-start self-stretch backdrop-blur-[220px] brightness-100 gap-[2.667rem] md:gap-[0.781rem] rounded-[3.2rem] md:rounded-[0.938rem] border-[0.267rem] md:border-[0.078rem] border-dapp-strokeSecondary bg-dapp-cardPrimary">
                <div className="flex items-center w-full p-[4.267rem] md:p-[1.1rem] justify-between h-[12.8rem] md:h-[3rem] bg-dapp-surfaceCardTitle">
                  <div className="flex-1 md:leading-[1.25rem] tracking-[-0.021rem] md:tracking-[-0.006rem] text-dapp-textPrimary text-subheader md:text-[1.1rem] font-semibold font-polySansTrialMedianMono md:ml-[0.17rem]">
                    Agent info
                  </div>
                </div>

                <div className="px-[4.267rem] md:px-[1.25rem] pb-[4.267rem] md:pb-[1.25rem] w-full flex flex-col gap-[4.267rem] md:gap-[0.5rem] items-start">
                  <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-[4.267rem] md:gap-[1rem]">
                    {/* Agent Name */}
                    <div
                      className="flex flex-col flex-none items-start self-stretch relative w-full gap-[2.133rem] md:gap-0"
                      ref={agentNameRef}
                    >
                      <div className="flex w-full items-center self-stretch gap-[2.133rem] md:gap-[0.625rem] h-[6.4rem] md:h-[1.875rem]">
                        <div className="relative flex flex-1 md:leading-[1.094rem] text-left text-dapp-textSecondary text-subheader2 md:text-[0.938rem] font-normal font-sourceSansRegular">
                          Agent Name
                        </div>
                        <div className="relative items-center rounded-[1.067rem] md:rounded-[0.313rem] inline-flex flex-none gap-[1.6rem] md:gap-[0.469rem] py-[1.6rem] md:py-[0.469rem]">
                          <Sparkles className="size-[3.2rem] md:size-[0.938rem] text-dapp-textAccentTerq" />
                          <button
                            onClick={handleGenerateName}
                            className="flex w-fit whitespace-nowrap text-left relative md:leading-[1.094rem] text-content md:text-[0.781rem] text-dapp-textAccentTerq font-normal font-polySansTrialNeutral"
                          >
                            Generate with AI
                          </button>
                        </div>
                      </div>

                      <Input
                        value={name}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setName(e.target.value);
                          setErrors((prev) => ({ ...prev, name: "" }));
                        }}
                        placeholder="Enter agent name"
                        maxLength={AGENT_NAME_LENGTH}
                        className="w-full bg-white/5 border border-dapp-strokeSecondary text-white"
                      />
                      {errors.name && (
                        <p className="flex self-stretch md:leading-[1.094rem] text-left relative text-content md:text-[0.938rem] text-[#fd827a] font-normal font-sourceSansRegular mt-[2.133rem] md:mt-[0.313rem]">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Avatar Upload */}
                    <div className="flex relative w-full items-start flex-none flex-col gap-[2.133rem] md:gap-[0.625rem]">
                      <div className="flex flex-none w-full relative items-center self-stretch bg-dapp-surfaceMenu border-[0.133rem] md:border-[0.039rem] border-dapp-strokeSecondary rounded-[2.133rem] md:rounded-[0.625rem] justify-between py-[2.133rem] md:py-[0.625rem] px-[3.2rem] md:px-[0.938rem]">
                        {image ? (
                          <img
                            src={blobUrl || ""}
                            alt="Agent"
                            className="size-[12.8rem] md:size-[3rem] object-cover rounded-[1.6rem] md:rounded-[0.469rem]"
                          />
                        ) : generatedImageLink ? (
                          <img
                            src={generatedImageLink || ""}
                            alt="Agent"
                            className="size-[12.8rem] md:size-[3rem] object-cover rounded-[1.6rem] md:rounded-[0.469rem]"
                          />
                        ) : (
                          <div className="size-[12.8rem] md:size-[3rem] bg-gray-200 rounded-[1.6rem] md:rounded-[0.469rem] flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Image</span>
                          </div>
                        )}

                        <div className="inline-flex relative justify-center items-start flex-none flex-col md:gap-[0.313rem]">
                          <div
                            className="inline-flex flex-none items-center bg-dapp-buttonTertiary rounded-[1.6rem] md:rounded-[0.469rem] gap-[1.6rem] md:gap-[0.469rem] py-[2.133rem] md:py-[0.469rem] px-[3.2rem] md:px-[0.938rem] cursor-pointer"
                            onClick={() => document.getElementById("image-upload")?.click()}
                          >
                            <div className="w-fit whitespace-nowrap text-center md:leading-[0.938rem] font-normal font-polySansTrialNeutral text-content md:text-[0.781rem] text-dapp-textPrimary">
                              Change Avatar
                            </div>
                          </div>
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/png,image/jpeg"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* System Prompt */}
                  <div
                    className="flex flex-col flex-none items-start self-stretch relative w-full gap-[2.133rem] md:gap-0"
                    ref={systemPromptRef}
                  >
                    <div className="flex w-full items-center self-stretch gap-[2.133rem] md:gap-[0.625rem] h-[6.4rem] md:h-[1.875rem]">
                      <div className="relative flex flex-1 md:leading-[1.094rem] text-left text-dapp-textSecondary text-subheader2 md:text-[0.938rem] font-normal font-sourceSansRegular">
                        System Prompt
                      </div>
                      <div className="relative items-center rounded-[1.067rem] md:rounded-[0.313rem] inline-flex flex-none gap-[1.6rem] md:gap-[0.469rem] py-[1.6rem] md:py-[0.469rem]">
                        {isGenerating ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-[3.2rem] w-[3.2rem] md:h-[0.938rem] md:w-[0.938rem] border-t-2 border-b-2 border-dapp-textAccentTerq"></div>
                            <span className="ml-[1.6rem] md:ml-[0.469rem] whitespace-nowrap text-left relative md:leading-[1.094rem] text-content md:text-[0.781rem] text-dapp-textAccentTerq font-normal font-polySansTrialNeutral">
                              Generating...
                            </span>
                          </div>
                        ) : (
                          <>
                            <Sparkles className="size-[3.2rem] md:size-[0.938rem] text-dapp-textAccentTerq" />
                            <button
                              onClick={handlePromptAI}
                              disabled={isGenerating}
                              className="flex w-fit whitespace-nowrap text-left relative md:leading-[1.094rem] text-content md:text-[0.781rem] text-dapp-textAccentTerq font-normal font-polySansTrialNeutral"
                            >
                              Generate with AI
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <Textarea
                      value={systemPrompt}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                        setSystemPrompt(e.target.value);
                        setErrors((prev) => ({ ...prev, systemPrompt: "" }));
                      }}
                      className="w-full h-[32rem] md:h-[13rem] bg-white/5 border border-dapp-strokeSecondary rounded-[1.28rem] md:rounded-md px-[2.56rem] py-[1.707rem] md:px-3 md:py-2 focus:border-dapp-strokeSecondary text-white resize-none outline-none"
                      placeholder={SPACE_PROMPT_PLACEHOLDER_MAP[selectedSpace]}
                      maxLength={characterLimit}
                    />
                    {errors.systemPrompt && (
                      <p className="flex self-stretch md:leading-[1.094rem] text-left text-content md:text-[0.938rem] text-[#fd827a] font-normal font-sourceSansRegular">
                        {errors.systemPrompt}
                      </p>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      {systemPrompt.length}/{characterLimit} characters
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Create Button */}
            <div className="px-[3.2rem] md:px-0 w-full">
              <Button
                onClick={handleCreateAgent}
                disabled={isFullPageLoader}
                className="w-full bg-dapp-buttonPrimary hover:bg-dapp-buttonPrimary/90 text-white font-semibold py-[3.2rem] md:py-[0.625rem] rounded-[1.6rem] md:rounded-[0.469rem] text-header md:text-[1rem]"
                size="lg"
              >
                {isFullPageLoader ? "Creating..." : "Create Agent"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DappCreateAgentModal;
