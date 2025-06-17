"use client";

import React, { useState, ChangeEvent, useEffect, useContext, useCallback, useRef } from "react";

import { apiFilePostRequestAuthenticated, apiPostRequestAuthenticated } from "@/helpers/api";
import { UserContext } from "@/providers/UserProvider";
import Image from "next/image";
import { useWaitForTransactionReceipt } from "wagmi";
import { CHAIN_ID, getChainConstants } from "@/constants/addresses";
import { AgentControllerABI } from "@/abi";
import { encodeFunctionData } from "viem";
import { AxiosError } from "axios";
import { AGENT_NAME_LENGTH, CREATE_SYSTEM_PROMPT_LENGTH, ETH_DECIMALS } from "@/constants/common";
import {
  DOBBY_MODELS,
  HARDCODED_SESSION_TYPES,
  SPACE_IMAGE_MAP,
  SPACE_PROMPT_PLACEHOLDER_MAP,
} from "@/constants/spaces";
import { HardcodedSessionType } from "@/types/home";
import useUserAgents from "@/hooks/useUserAgents";
import Textarea from "@/components/ui/Textarea";
import { createPortal } from "react-dom";
import Close from "../../../../../public/dapp-new/Close.svg";
import DappPrimaryButton from "../../dapp-common/DappPrimaryButton";
import DappInput from "../../dapp-common/ui/DappInput";
import SparkleBlue from "../../../../../public/dapp-new/SparkleBlue.svg";
import MicrophoneIcon from "../../../../../public/dapp-new/MicrophoneIcon.svg";
import DappOverlay from "../../dapp-common/DappOverlay";
import ModalGradient from "../../../../../public/dapp-new/ModalGradient.png";
import { CustomToast } from "../../dapp-common/ui/DappToast";
import CreateAgentFullPageLoader from "@/components/my-agents/CreateAgentFullPageLoader";
import DappHowItWorksModal from "../../dapp-spaces/DappHowItWorksModal";
import { useSmartAccount } from "@/hooks/useSmartAccount";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";
import { useContractBalance } from "@/components/transactions/useContractBalance";
import { useFundWallet } from "@privy-io/react-auth";
import DappSecondaryButton from "../../dapp-common/DappSecondaryButton";
import { ArrowDown } from "lucide-react";
import DappTradeHowItWorksModal from "../../dapp-spaces/DappActiveSpace/DappTrade/DappTradeHowItWorksModal";
import DappTicTacToeHowItWorksModal from "../../dapp-spaces/DappActiveSpace/DappTicTacToe/DappTicTacToeHowItWorksModal";
import SoccerConfiguration from "./SoccerConfiguration";

const DappCreateAgentModal: React.FC<{ closeModal: () => void; selectedSpaceId?: number; sessionType?: string, selectedSpaceNameOutside?: string }> = ({
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
  const [agentId, setAgentId] = useState<number>();
  const { address } = useSmartAccount();
  const { client } = useSmartWallets();

  const [hash, setHash] = useState<`0x${string}`>();

  const userContext = useContext(UserContext);
  const { refetch: refetchUserAgents } = useUserAgents(userContext?.userId || undefined, false);
  const [blobUrl, setBlobUrl] = useState<string>();

  const [selectedSpace, setSelectedSpace] = useState<number>(selectedSpaceId || 0);
  const [selectedSpaceName, setSelectedSpaceName] = useState<string>(selectedSpaceNameOutside || '');
  const [startingBalance, setStartingBalance] = useState<string>("0.01");
  const [battleType, setBattleType] = useState<string>(sessionType || HARDCODED_SESSION_TYPES[0].sessionType);
  const [characterLimit, setCharacterLimit] = useState<number>(CREATE_SYSTEM_PROMPT_LENGTH);

  const [nonce, setNonce] = useState<string>("");
  const [captchaText, setCaptchaText] = useState<string>("");
  const modalRef = useRef<HTMLDivElement>(null);
  const [model, setModel] = useState<string>("");
  const [isDobbyWhitelist, setIsDobbyWhitelist] = useState<boolean>(true);
  const [errors, setErrors] = useState({
    name: "",
    systemPrompt: "",
    captchaText: "",
  });

  // Soccer configuration state
  const [soccerConfig, setSoccerConfig] = useState({
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
    specialists: [] as string[]
  });

  const agentNameRef = useRef<HTMLDivElement>(null);
  const systemPromptRef = useRef<HTMLDivElement>(null);

  const { amount: ethBalance } = useContractBalance();
  const { contractBalance } = userContext!;
  const { fundWallet } = useFundWallet();

  // Check if current space is soccer
  const isSoccerSpace = () => {
    const currentSpace = HARDCODED_SESSION_TYPES.find(space => space.id === selectedSpace);
    return currentSpace?.sessionType === 'soccer' || currentSpace?.name?.toLowerCase().includes('soccer');
  };

  const handleGenerateName = async () => {
    try {
      // setIsGenerating(true);
      const responseData = (
        await apiPostRequestAuthenticated(`agents/generate/name`, {
          battleType: battleType,
        })
      ).data;
      setName(responseData?.name?.split("")?.slice(0, AGENT_NAME_LENGTH)?.join(""));
      setErrors((prev) => ({ ...prev, name: "" }));
    } catch (error) {
      CustomToast.error("Error!", error instanceof AxiosError ? error?.response?.data?.error : "Something went wrong!");
    } finally {
      // setIsGenerating(false);
    }
  };

  const handlePromptAI = async () => {
    try {
      setIsGenerating(true);

      if (isNeededToGenerateFromAi) {
        // Generate from AI
        const responseData = (
          await apiPostRequestAuthenticated(`agents/generate/prompt`, {
            battleType: battleType,
            agentId: agentId,
          })
        ).data;
        setSystemPrompt(responseData.prompt?.split("")?.slice(0, characterLimit)?.join(""));
        setErrors((prev) => ({ ...prev, systemPrompt: "" }));
      } else {
        // Improve from AI
        const responseData = (
          await apiPostRequestAuthenticated(`agents/improve/prompt`, {
            battleType: battleType,
            currentPrompt: systemPrompt,
            agentId: agentId,
          })
        ).data;
        setSystemPrompt(responseData.prompt?.split("")?.slice(0, characterLimit)?.join(""));
      }
    } catch (error) {
      CustomToast.error("Error!", error instanceof AxiosError ? error?.response?.data?.error : "Something went wrong!");
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
        CustomToast.error("Error!", `Image size exceeds ${maxSizeInMB} MB. Please upload a smaller file.`);
        return;
      }

      setImage(file);
      setBlobUrl(URL.createObjectURL(file));
    }
  };

  const getWhitelistStatus = async () => {
    // const whitelistResponse = await apiGetRequestAuthenticated("auth/isDobbySpaceWhitelistedForUser");
    // const isWhitelisted = whitelistResponse.data.isWhitelisted;
    setIsDobbyWhitelist(true);
  };

  const handleGenerateImage = useCallback(async () => {
    try {
      const responseData = (
        await apiPostRequestAuthenticated(`agents/generate/avatar`, {
          battleType: battleType,
          userId: userContext?.userId,
        })
      ).data;

      setGeneratedImageLink(responseData.avatarUrl);
    } catch (err) {
      console.log(err);
    }
  }, [userContext?.userId, battleType]);

  useEffect(() => {
    handleGenerateImage();
  }, [userContext?.userId, handleGenerateImage]);

  const { isLoading, isSuccess, isError, error } = useWaitForTransactionReceipt({
    hash: hash,
  });

  useEffect(() => {
    if (isSuccess && agentId) {
      pushTxnHash();
    }
  }, [isSuccess, agentId]);

  useEffect(() => {
    if (isError && agentId) {
      CustomToast.error("Error!", "Something went wrong");
      setIsFullPageLoader(false);
    }
  }, [isError, agentId]);

  useEffect(() => {
    getWhitelistStatus();
  }, []);

  const pushTxnHash = async () => {
    try {
      const txnResponse = await apiPostRequestAuthenticated("agents/saveTxnHash", {
        agentId: agentId,
        txnHash: hash,
      });
      refetchUserAgents();
      closeModal();
      CustomToast.success("Success!", "Agent has been created successfully!");
    } catch (err) {
      console.log(err);
    } finally {
      setIsFullPageLoader(false);
    }
  };

  const isNeededToGenerateFromAi = systemPrompt.length >= 20 ? false : true;
  const isBalanceZero = Number(contractBalance) <= 0 ? true : false;

  const handleCreateAgent = async () => {
    const newErrors: { name?: string; systemPrompt?: string; captchaText?: string } = {};

    if (!selectedSpace) {
      CustomToast.error("Error!", "Please select a space");
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

    if (!userContext?.userId || isFullPageLoader || !address || !client || !name || !systemPrompt || !selectedSpace)
      return;
    if (Number(startingBalance) > Number(ethBalance)) {
      CustomToast.error("Error!", `Your wallet balance is only ${Number(ethBalance).toFixed(ETH_DECIMALS)} USDC`);
      return;
    }

    if (name.length > AGENT_NAME_LENGTH) {
      CustomToast.error("Error!", `Name should be less than ${AGENT_NAME_LENGTH} characters`);
      return;
    }

    // if (battleType === "dobby" && !model) {
    //   CustomToast.error("Error!", `Please select a model first`);
    //   return;
    // }

    try {
      setIsFullPageLoader(true);
      let imageResponseData;

      if (image) {
        imageResponseData = (
          await apiFilePostRequestAuthenticated("agents/upload/avatar", {
            userId: userContext.userId,
            file: image,
          })
        ).data;
      }

      // Include soccer config in the request if soccer space is selected
      const agentData: any = {
        name,
        userId: userContext?.userId,
        battleType: battleType,
        sessionTypeId: selectedSpace,
        systemPrompt,
        avatarLink: (imageResponseData && imageResponseData.key) || generatedImageLink,
        nonce,
        captchaText,
        model,
      };

      // Add soccer configuration if soccer space is selected
      if (isSoccerSpace()) {
        agentData.soccerConfig = soccerConfig;
      }

      const responseData = (
        await apiPostRequestAuthenticated(`agents/create`, agentData)
      ).data;
      const agentId = Number(responseData?.agent?.id);
      setAgentId(agentId);

      const signature: `0x${string}` = responseData.signature;

      const contractAddress = getChainConstants(CHAIN_ID).AGENT_CONTROLLER_ADDRESS;
      // Web3 interactions
      const txnHash = await client.sendTransaction({
        to: contractAddress,
        data: encodeFunctionData({
          abi: AgentControllerABI,
          functionName: "createAgent",
          args: [address, BigInt(agentId), signature],
        }),
      });
      setHash(txnHash);
    } catch (err) {
      CustomToast.error("Error!", err instanceof AxiosError ? err?.response?.data?.error : "Unable to create agent.");
      setIsFullPageLoader(false);
    }
  };

  const handleSpaceToggle = (space: HardcodedSessionType) => {
    setName("");
    setSystemPrompt("");
    setSelectedSpace(space.id);
    setBattleType(space.sessionType);
    setCharacterLimit(space.characterLimit);
    handleGenerateImage();
    setModel("");
    
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

  const handleButtonClick = (handler?: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    if (handler) handler();
  };


  return createPortal(
    <DappOverlay onClose={closeModal}>
      {isFullPageLoader && <CreateAgentFullPageLoader onClose={() => setIsFullPageLoader(false)} />}

      <div
        className="bg-dapp-bgPage absolute bottom-0 md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 right-0 rounded-[4.267rem] md:rounded-[1.25rem] gap-[3.2rem] md:gap-0 backdrop-blur-[220px] brightness-100 md:border-l-[0.078rem] overflow-hidden w-full md:w-[40.25rem] border-dapp-strokeSecondary z-50 h-full md:h-fit overflow-y-scroll hide-scrollbar"
        ref={modalRef}
      >
        <Image
          src={ModalGradient.src}
          alt="Gradient"
          width={400}
          height={765}
          className="absolute top-0 left-0 w-full h-full hidden md:block"
        />
        <div
          className={`flex flex-col w-full items-start justify-between gap-[4.267rem] md:gap-[0.938rem] h-full relative ${
            isBalanceZero && "opacity-50 blur-sm"
          }`}
        >
          <div className="inline-flex flex-col relative gap-[4.267rem] md:gap-[1rem] pb-[20rem] md:pb-[1.5rem] flex-none items-start overflow-y-scroll hide-scrollbar md:h-full z-20 w-full md:p-[1.563rem]">
            {/* top container */}
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
                    <Image
                      src={Close.src}
                      alt="Close"
                      width={16}
                      height={16}
                      className="size-[4.267rem] md:size-[1.25rem]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* space type */}
            <div className="w-full h-full px-[3.2rem] md:px-0 flex flex-col gap-[2.667rem] md:gap-[0.625rem]">
              <SpaceSelectionBox
                spaces={HARDCODED_SESSION_TYPES?.filter((space) => space.active)}
                selectedSpaceId={selectedSpace}
                handleSpaceToggle={handleSpaceToggle}
                isDobbyWhitelist={isDobbyWhitelist}
                setSelectedSpace={setSelectedSpace}
                selectedSpaceName={selectedSpaceName || ''}
              />
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

            {/* agent info */}
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
                          <Image
                            src={SparkleBlue.src}
                            alt="generate"
                            width={12}
                            height={12}
                            className="size-[3.2rem] md:size-[0.938rem]"
                          />
                          <button
                            onClick={handleGenerateName}
                            // disabled={isGenerating}
                            className={`flex w-fit whitespace-nowrap text-left relative md:leading-[1.094rem] text-content md:text-[0.781rem] text-dapp-textAccentTerq font-normal font-polySansTrialNeutral`}
                          >
                            Generate with AI
                          </button>
                        </div>
                      </div>

                      <DappInput
                        value={name}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setName(e.target.value);
                          setErrors((prev) => ({ ...prev, name: "" }));
                        }}
                        placeholder="Enter agent name"
                        maxLength={AGENT_NAME_LENGTH}
                        className="w-full !text-white"
                        showSearchIcon={false}
                      />
                      {errors.name && (
                        <p className="flex self-stretch md:leading-[1.094rem] text-left relative text-content md:text-[0.938rem] text-[#fd827a] font-normal font-sourceSansRegular mt-[2.133rem] md:mt-[0.313rem]">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Change avatar */}
                    <div className="flex relative w-full items-start flex-none flex-col gap-[2.133rem] md:gap-[0.625rem]">
                      <div className="flex flex-none w-full relative items-center self-stretch bg-dapp-surfaceMenu border-[0.133rem] md:border-[0.039rem] border-dapp-strokeSecondary rounded-[2.133rem] md:rounded-[0.625rem] justify-between py-[2.133rem] md:py-[0.625rem] px-[3.2rem] md:px-[0.938rem]">
                        {image ? (
                          <Image
                            src={blobUrl || ""}
                            alt="Agent"
                            width={100}
                            height={100}
                            className="size-[12.8rem] md:size-[3rem] object-cover rounded-[1.6rem] md:rounded-[0.469rem]"
                          />
                        ) : generatedImageLink ? (
                          <Image
                            src={generatedImageLink || ""}
                            alt="Agent"
                            width={100}
                            height={100}
                            className="size-[12.8rem] md:size-[3rem] object-cover rounded-[1.6rem] md:rounded-[0.469rem]"
                          />
                        ) : null}

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

                  {/* System prompt */}
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
                            <Image
                              src={SparkleBlue.src}
                              alt="generate"
                              width={12}
                              height={12}
                              className="size-[3.2rem] md:size-[0.938rem]"
                            />
                            <button
                              onClick={handlePromptAI}
                              disabled={isGenerating}
                              className={`flex w-fit whitespace-nowrap text-left relative md:leading-[1.094rem] text-content md:text-[0.781rem] text-dapp-textAccentTerq font-normal font-polySansTrialNeutral ${
                                isGenerating && "cursor-not-allowed"
                              }`}
                            >
                              {!isNeededToGenerateFromAi ? "Improve with AI" : "Generate with AI"}
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <Textarea
                      id="systemPrompt"
                      maxLength={characterLimit}
                      value={systemPrompt}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                        setSystemPrompt(e.target.value);
                        setErrors((prev) => ({ ...prev, systemPrompt: "" }));
                      }}
                      className="w-full h-[32rem] md:h-[13rem] bg-white/5 border border-dapp-strokeSecondary rounded-[1.28rem] md:rounded-md px-[2.56rem] py-[1.707rem] md:px-3 md:py-2 focus:border-dapp-strokeSecondary text-white resize-none outline-none"
                      placeholder={SPACE_PROMPT_PLACEHOLDER_MAP[selectedSpace]}
                    />
                    {errors.systemPrompt && (
                      <p className="absolute bottom-0 flex self-stretch md:leading-[1.094rem] text-left text-content md:text-[0.938rem] text-[#fd827a] font-normal font-sourceSansRegular">
                        {errors.systemPrompt}
                      </p>
                    )}
                  </div>

                  {/* model selection */}
                  {/* {battleType === "dobby" && <ModelSelectionBox model={model} setModel={setModel} />} */}
                </div>
              </div>
            </div>
            {/* create agent */}
            <div className="px-[3.2rem] md:px-0 w-full">
              <DappPrimaryButton
                text={isLoading ? "Loading..." : "Create Agent"}
                classNames={`w-full !justify-center`}
                onClick={handleCreateAgent}
              />
            </div>
          </div>
        </div>
        {isBalanceZero && (
          <div className="absolute inset-0 z-10 bg-gray-900 bg-opacity-60 backdrop-blur-sm flex flex-col items-center p-16 md:p-6 w-full justify-center">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-16 md:p-6 rounded-3xl md:rounded-xl w-full border border-gray-700 shadow-2xl relative">
              <div
                className="absolute top-8 right-8 md:top-4 md:right-4 inline-flex items-center p-[2.133rem] md:p-[0.625rem] gap-[1.6rem] md:gap-[0.469rem] rounded-[1.6rem] md:rounded-[0.469rem] border-[0.267rem] md:border-[0.078rem] border-dapp-strokeSecondary backdrop-blur-[3.2rem] md:backdrop-blur-[0.938rem] brightness-100 cursor-pointer"
                onClick={handleButtonClick(closeModal)}
              >
                <Image
                  src={Close.src}
                  alt="Close"
                  width={16}
                  height={16}
                  className="size-[4.267rem] md:size-[1.25rem]"
                />
              </div>
              <div className="flex flex-col items-center text-center mb-16 md:mb-6 gap-4 md:gap-0">
                <div className="w-fit whitespace-nowrap md:leading-[1.875rem] text-dapp-textPrimary text-header md:text-[1.45rem] font-semibold font-polySansTrialMedianMono tracking-[-0.027rem] md:tracking-[-0.008rem]">
                  Create New Agent
                </div>
                <div className="relative flex flex-1 md:leading-[1.094rem] text-left text-dapp-textSecondary text-subheader2 md:text-[0.938rem] font-normal font-sourceSansRegular">
                  Please deposit funds to start creating agents.
                </div>
              </div>

              <DappSecondaryButton
                text="Add Funds to your Wallet"
                classNames={`w-full !justify-center gap-4 md:gap-1 !py-[3.2rem] md:!py-[0.625rem] hover:bg-[#73fff840] hover:text-white group !font-normal !font-sourceSansRegular`}
                onClick={() => fundWallet(address || "")}
                textClassName="md:!text-[1rem]"
              >
                <ArrowDown className="size-[4.267rem] md:size-[0.938rem] text-dapp-textAccentTerq group-hover:text-white" />
              </DappSecondaryButton>
            </div>
          </div>
        )}
      </div>
    </DappOverlay>,
    document.body
  );
};

export default DappCreateAgentModal;

export const ModelSelectionBox: React.FC<{
  model: string;
  setModel: (value: string) => void;
}> = ({ model, setModel }) => {
  return (
    <div className="flex flex-col w-full relative items-start self-stretch gap-[2.667rem] md:gap-[0.781rem] rounded-[3.2rem] md:rounded-[0.938rem]">
      <div className="flex items-center w-full justify-between">
        <div className="relative flex flex-1 md:leading-[1.094rem] text-left text-dapp-textSecondary text-subheader2 md:text-[1.094rem] font-normal font-sourceSansRegular">
          Select Model
        </div>
      </div>

      <div className="flex flex-col md:pt-0 flex-none w-full relative items-start self-stretch gap-[2.133rem] md:gap-[0.625rem]">
        <ModelSelectionDropdown selectedModel={model} handleModelToggle={setModel} />
      </div>
    </div>
  );
};

const SpaceSelectionBox: React.FC<{
  spaces: HardcodedSessionType[] | undefined;
  selectedSpaceId: number;
  handleSpaceToggle: (value: HardcodedSessionType) => void;
  isDobbyWhitelist: boolean;
  setSelectedSpace: (value: number) => void;
  selectedSpaceName?: string
}> = ({ spaces, selectedSpaceId, handleSpaceToggle, isDobbyWhitelist, setSelectedSpace, selectedSpaceName }) => {
  const [searchText, setSearchText] = useState(selectedSpaceName || "");

  const filteredSpaces = spaces?.filter((space) => space?.name.toLowerCase().includes(searchText.toLowerCase()));
  const [isHowItWorksModalOpen, setIsHowItWorksModalOpen] = useState<boolean>(false);
  const [isTradeHowItWorksModalOpen, setIsTradeHowItWorksModalOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const [isTicTacToeHowItWorksModalOpen, setIsTicTacToeHowItWorksModalOpen] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedSpace = spaces?.find((space) => space.id === selectedSpaceId);

  const [isSpaceClicked, setIsSpaceClicked] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close dropdown if click is outside both the dropdown and the input
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsSpaceClicked(false);
      }
    };

    // Only add the event listener if the dropdown is open
    if (isSpaceClicked) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSpaceClicked]);

  return (
    <div className="flex flex-col w-full relative items-start self-stretch backdrop-blur-[220px] brightness-100 md:gap-[0.781rem] rounded-[3.2rem] md:rounded-[0.938rem] border-[0.267rem] md:border-[0.078rem] border-dapp-strokeSecondary bg-dapp-cardPrimary z-30">
      {isHowItWorksModalOpen && selectedSpaceId && selectedSpace && (
        <DappHowItWorksModal spaceInfo={selectedSpace} onClose={() => setIsHowItWorksModalOpen(false)} />
      )}

      {isTicTacToeHowItWorksModalOpen && (
        <DappTicTacToeHowItWorksModal onClose={() => setIsTicTacToeHowItWorksModalOpen(false)} />
      )}

      {isTradeHowItWorksModalOpen && <DappTradeHowItWorksModal onClose={() => setIsTradeHowItWorksModalOpen(false)} />}

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
          {/* Search Input */}
          <DappInput
            placeholder="Search Space"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-1 flex-grow"
            onClick={() => {
              setIsSpaceClicked(true);
              setSearchText("");
              setSelectedSpace(0);
            }}
          />
        </div>

        {isSpaceClicked && (
          <SpaceSelectionDropdown
            spaces={filteredSpaces}
            selectedSpaceId={selectedSpaceId}
            handleSpaceToggle={(selectedSpace) => {
              handleSpaceToggle(selectedSpace);
              setIsSpaceClicked(false);
              setSearchText(selectedSpace?.name || "");
            }}
            isDobbyWhitelist={isDobbyWhitelist}
            setIsHowItWorksModalOpen={setIsHowItWorksModalOpen}
            setIsTradeHowItWorksModalOpen={setIsTradeHowItWorksModalOpen}
            setIsTicTacToeHowItWorksModalOpen={setIsTicTacToeHowItWorksModalOpen}
            ref={dropdownRef}
          />
        )}
      </div>
    </div>
  );
};

const SpaceSelectionDropdown: React.FC<{
  spaces: HardcodedSessionType[] | undefined;
  selectedSpaceId: number;
  handleSpaceToggle: (value: HardcodedSessionType) => void;
  isDobbyWhitelist: boolean;
  setIsHowItWorksModalOpen: (value: boolean) => void;
  setIsTradeHowItWorksModalOpen: (value: boolean) => void;
  setIsTicTacToeHowItWorksModalOpen: (value: boolean) => void;
  ref: React.RefObject<HTMLDivElement>;
}> = ({
  spaces,
  selectedSpaceId,
  handleSpaceToggle,
  isDobbyWhitelist,
  setIsHowItWorksModalOpen,
  setIsTradeHowItWorksModalOpen,
  setIsTicTacToeHowItWorksModalOpen,
  ref,
}) => {
  const isSpaceActive = (space: HardcodedSessionType) => {
    if (space.sessionType == "dobby") {
      return space.active && isDobbyWhitelist;
    }
    return space.active;
  };

  return (
    <div
      ref={ref}
      className="flex flex-none flex-col items-start self-stretch rounded-[1.6rem] md:rounded-[0.469rem] h-[32rem] md:h-[9.375rem] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-500
        [&::-webkit-scrollbar]:w-[0.313rem]
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-dapp-buttonTertiary
        [&::-webkit-scrollbar-thumb]:rounded-[0.469rem]
        [&::-webkit-scrollbar-thumb:hover]:bg-white absolute bg-[#191b20] top-[18rem] md:top-[3rem] w-[94%]"
    >
      {spaces?.map((space) => {
        const isSelected = selectedSpaceId === space.id;

        return (
          <div
            key={space.id}
            className={`w-full relative items-center justify-between self-stretch flex flex-none gap-[2.133rem] md:gap-[0.625rem] p-[3.2rem] md:p-[0.625rem] hover:bg-dapp-surfaceMenu cursor-pointer ${
              isSpaceActive(space) ? "cursor-pointer" : "cursor-not-allowed blur-[1px]"
            }`}
            onClick={() => isSpaceActive(space) && handleSpaceToggle(space)}
          >
            <div className="items-center self-stretch flex flex-none gap-[2.133rem] md:gap-[0.625rem] ">
              {/* Custom radio button */}
              <div className="relative size-[4.267rem] md:size-[1.25rem] flex items-center justify-center">
                <div className="size-[4.267rem] md:w-5 md:h-5 rounded-full border-2 transition-colors border-[#e5e1ea33] flex items-center justify-center">
                  {isSelected && <div className="size-[1.6rem] md:size-[0.469rem] rounded-full bg-[#73fff8]" />}
                </div>
              </div>

              {/* space name */}
              <div className="inline-flex relative flex-none items-center gap-[2.133rem] md:gap-[0.625rem]">
                <Image
                  src={SPACE_IMAGE_MAP[space?.id] || MicrophoneIcon.src}
                  width={100}
                  height={100}
                  alt={space?.name || ""}
                  className="size-[5.333rem] md:size-[1.25rem] object-cover relative"
                />
                <div className="w-fit whitespace-nowrap md:leading-[1.094rem] text-subheader2 md:text-[1rem] font-normal font-sourceSansRegular text-dapp-textPrimary">
                  {space.name}
                </div>
              </div>
            </div>
            {space && space.sessionType === "burning_game" && (
              <div
                onClick={() => setIsHowItWorksModalOpen(true)}
                className="flex items-center justify-center underline text-dapp-textSecondary text-content md:text-[0.781rem] md:leading-[1.094rem]"
              >
                How it works?
              </div>
            )}
            {space && space.sessionType === "trading" && (
              <div
                onClick={() => setIsTradeHowItWorksModalOpen(true)}
                className="flex items-center justify-center underline text-dapp-textSecondary text-content md:text-[0.781rem] md:leading-[1.094rem]"
              >
                How it works?
              </div>
            )}
            {space && space.sessionType === "bid_tac_toe" && (
              <div
                onClick={() => setIsTicTacToeHowItWorksModalOpen(true)}
                className="flex items-center justify-center underline text-dapp-textSecondary text-content md:text-[0.781rem] md:leading-[1.094rem]"
              >
                How it works?
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const ModelSelectionDropdown: React.FC<{
  selectedModel: string;
  handleModelToggle: (value: string) => void;
}> = ({ selectedModel, handleModelToggle }) => {
  return (
    <div className="flex flex-none flex-col w-full relative items-start self-stretch rounded-[1.6rem] md:rounded-[0.469rem] bg-dapp-cardPrimary">
      {DOBBY_MODELS?.map((model) => {
        const isSelected = selectedModel === model;

        return (
          <div
            key={model}
            className="w-full relative items-center self-stretch flex flex-none gap-[2.133rem] md:gap-[0.625rem] p-[3.2rem] md:p-[0.938rem] hover:bg-dapp-surfaceMenu cursor-pointer"
            onClick={() => handleModelToggle(model)}
          >
            {/* Custom radio button */}
            <div className="relative size-[4.267rem] md:size-[1.25rem] flex items-center justify-center">
              <div className="size-[4.267rem] md:w-5 md:h-5 rounded-full border-2 transition-colors border-[#e5e1ea33] flex items-center justify-center">
                {isSelected && <div className="size-[1.6rem] md:size-[0.469rem] rounded-full bg-[#73fff8]" />}
              </div>
            </div>

            {/* model name */}
            <div className="inline-flex relative flex-none items-center gap-[2.133rem] md:gap-[0.625rem]">
              <div className="w-fit whitespace-nowrap md:leading-[1.094rem] text-subheader2 md:text-[1.094rem] font-normal font-sourceSansRegular text-dapp-textPrimary">
                {model}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
