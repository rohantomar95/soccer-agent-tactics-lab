
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

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {isFullPageLoader && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60">
          <div className="text-white text-xl">Creating Agent...</div>
        </div>
      )}

      <div
        className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full mx-4 overflow-y-auto"
        ref={modalRef}
      >
        <div className="flex flex-col gap-6 p-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Create New Agent</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeModal}
              className="p-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Space Selection */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Select Space Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {HARDCODED_SESSION_TYPES.filter(space => space.active).map((space) => (
                <div
                  key={space.id}
                  onClick={() => handleSpaceToggle(space)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedSpace === space.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{space.name}</div>
                  <div className="text-sm text-gray-600">{space.sessionType}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Soccer Configuration - only show if soccer space is selected */}
          {isSoccerSpace() && (
            <SoccerConfiguration 
              config={soccerConfig} 
              onConfigChange={setSoccerConfig} 
            />
          )}

          {/* Agent Info */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Agent Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Agent Name */}
              <div ref={agentNameRef}>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Agent Name</label>
                  <button
                    onClick={handleGenerateName}
                    disabled={isGenerating}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Sparkles className="w-4 h-4" />
                    Generate with AI
                  </button>
                </div>
                <Input
                  value={name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setName(e.target.value);
                    setErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  placeholder="Enter agent name"
                  maxLength={AGENT_NAME_LENGTH}
                  className="w-full"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Avatar Upload */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Avatar</label>
                <div className="flex items-center gap-4 p-3 border rounded-lg">
                  {image ? (
                    <img
                      src={blobUrl || ""}
                      alt="Agent"
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : generatedImageLink ? (
                    <img
                      src={generatedImageLink}
                      alt="Agent"
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("image-upload")?.click()}
                  >
                    Change Avatar
                  </Button>
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

            {/* System Prompt */}
            <div ref={systemPromptRef}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">System Prompt</label>
                <button
                  onClick={handlePromptAI}
                  disabled={isGenerating}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-600"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate with AI
                    </>
                  )}
                </button>
              </div>
              <Textarea
                value={systemPrompt}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                  setSystemPrompt(e.target.value);
                  setErrors((prev) => ({ ...prev, systemPrompt: "" }));
                }}
                className="w-full h-32"
                placeholder={SPACE_PROMPT_PLACEHOLDER_MAP[selectedSpace]}
                maxLength={characterLimit}
              />
              {errors.systemPrompt && (
                <p className="text-red-500 text-sm mt-1">{errors.systemPrompt}</p>
              )}
              <div className="text-xs text-gray-500 mt-1">
                {systemPrompt.length}/{characterLimit} characters
              </div>
            </div>
          </div>

          {/* Create Button */}
          <Button
            onClick={handleCreateAgent}
            disabled={isFullPageLoader}
            className="w-full"
            size="lg"
          >
            {isFullPageLoader ? "Creating..." : "Create Agent"}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DappCreateAgentModal;
