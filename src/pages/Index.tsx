
import { useState } from "react";
import { Button } from "@/components/ui/button";
import DappCreateAgentModal from "@/components/DappCreateAgentModal";

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Agent Creation Platform</h1>
        <p className="text-gray-600 mb-8">Create and configure your AI agents for different spaces</p>
        
        <Button 
          onClick={() => setIsModalOpen(true)}
          size="lg"
          className="mb-4"
        >
          Create New Agent
        </Button>

        {isModalOpen && (
          <DappCreateAgentModal
            closeModal={() => setIsModalOpen(false)}
            selectedSpaceId={2} // Default to soccer space
            sessionType="soccer"
            selectedSpaceNameOutside="Soccer"
          />
        )}
      </div>
    </div>
  );
};

export default Index;
