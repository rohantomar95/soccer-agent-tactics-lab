
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
    
    // Only require system prompt for non-soccer spaces
    if (!isSoccerSpace() && !systemPrompt) {
      newErrors.systemPrompt = "Please enter a system prompt";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...newErrors }));

      // Scroll to the first missing field
      if (!name) agentNameRef.current?.scrollIntoView({ behavior: "smooth" });
      else if (!systemPrompt && !isSoccerSpace()) systemPromptRef.current?.scrollIntoView({ behavior: "smooth" });

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
        systemPrompt: isSoccerSpace() ? "Soccer tactical configuration" : systemPrompt,
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={closeModal}>
      {isFullPageLoader && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-60">
          <div className="text-white text-xl">Creating Agent...</div>
        </div>
      )}

      <div
        className="bg-gray-900 rounded-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Create New Agent</h2>
            <button
              onClick={closeModal}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Select Space Type */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-white">Select Space Type</h3>
            <div className="relative" ref={inputRef}>
              <Input
                placeholder="BTC Tradewars V2"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-gray-600"
                onClick={() => {
                  setIsSpaceClicked(true);
                  setSearchText("");
                  setSelectedSpace(0);
                }}
              />
              
              {isSpaceClicked && (
                <div
                  ref={dropdownRef}
                  className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto"
                >
                  {filteredSpaces?.map((space) => {
                    const isSelected = selectedSpace === space.id;
                    return (
                      <div
                        key={space.id}
                        className="flex items-center p-3 hover:bg-gray-700 cursor-pointer"
                        onClick={() => handleSpaceToggle(space)}
                      >
                        <div className="flex items-center justify-center w-5 h-5 mr-3">
                          <div className="w-4 h-4 rounded-full border-2 border-gray-500 flex items-center justify-center">
                            {isSelected && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                          </div>
                        </div>
                        <span className="text-white">{space.name}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Agent Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Agent Info</h3>
            
            {/* Agent Name */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-300">Agent Name</label>
                <button
                  onClick={handleGenerateName}
                  className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
                >
                  <Sparkles className="w-3 h-3" />
                  Generate with AI
                </button>
              </div>
              <Input
                placeholder="Enter agent name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((prev) => ({ ...prev, name: "" }));
                }}
                maxLength={AGENT_NAME_LENGTH}
                className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-gray-600"
              />
              {errors.name && (
                <p className="text-red-400 text-sm">{errors.name}</p>
              )}
            </div>

            {/* Avatar */}
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              {image ? (
                <img
                  src={blobUrl || ""}
                  alt="Agent"
                  className="w-12 h-12 object-cover rounded-lg"
                />
              ) : generatedImageLink ? (
                <img
                  src={generatedImageLink || ""}
                  alt="Agent"
                  className="w-12 h-12 object-cover rounded-lg"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-gray-500 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-amber-500 rounded-sm"></div>
                  </div>
                </div>
              )}

              <button
                onClick={() => document.getElementById("image-upload")?.click()}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
              >
                Change Avatar
              </button>
              <input
                id="image-upload"
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Soccer Configuration - only show if soccer space is selected */}
          {isSoccerSpace() && (
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-white">Your Strategies</h3>
              <SoccerConfiguration 
                config={soccerConfig} 
                onConfigChange={setSoccerConfig} 
              />
            </div>
          )}

          {/* System Prompt - only show for non-soccer spaces */}
          {!isSoccerSpace() && (
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-white">Your Strategies</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-300">Select a strategy...</label>
                  <button
                    onClick={handlePromptAI}
                    disabled={isGenerating}
                    className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-t border-b border-cyan-400"></div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3" />
                        Generate with AI
                      </>
                    )}
                  </button>
                </div>
                <Textarea
                  value={systemPrompt}
                  onChange={(e) => {
                    setSystemPrompt(e.target.value);
                    setErrors((prev) => ({ ...prev, systemPrompt: "" }));
                  }}
                  className="w-full h-24 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-gray-600 resize-none"
                  placeholder={SPACE_PROMPT_PLACEHOLDER_MAP[selectedSpace]}
                  maxLength={characterLimit}
                />
                {errors.systemPrompt && (
                  <p className="text-red-400 text-sm">{errors.systemPrompt}</p>
                )}
                <div className="text-xs text-gray-500">
                  {systemPrompt.length}/{characterLimit} characters
                </div>
              </div>
            </div>
          )}

          {/* Create Button */}
          <button
            onClick={handleCreateAgent}
            disabled={isFullPageLoader}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFullPageLoader ? "Creating..." : "Create Agent"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DappCreateAgentModal;
