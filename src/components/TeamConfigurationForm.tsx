
import React, { useState, useEffect } from 'react';
import { Users, Settings, Target, Zap, Brain, DollarSign, Shield, Star } from 'lucide-react';

const TeamConfigurationForm = () => {
  const [teamConfig, setTeamConfig] = useState({
    name: '',
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

  const [finalAttributes, setFinalAttributes] = useState({});

  // Formation base stats (from the simulation)
  const formationStats = {
    '4-4-2': { attack: 75, midfield: 80, defense: 85, width: 70, pressing_resist: 75, aerial_strength: 80, pace: 70, creativity: 70, physicality: 75, discipline: 80 },
    '4-3-3': { attack: 85, midfield: 75, defense: 70, width: 85, pressing_resist: 70, aerial_strength: 65, pace: 80, creativity: 80, physicality: 70, discipline: 75 },
    '4-2-3-1': { attack: 80, midfield: 85, defense: 75, width: 75, pressing_resist: 80, aerial_strength: 70, pace: 75, creativity: 85, physicality: 75, discipline: 85 }
  };

  const styleModifiers = {
    possession: { midfield: 20, creativity: 15, discipline: 10, pace: -5 },
    counter: { attack: 20, pace: 25, physicality: 10, midfield: -5, creativity: -5 },
    attacking: { attack: 25, creativity: 20, pace: 10, defense: -15, discipline: -15 }
  };

  const specialists = [
    { id: 'pace_merchant', name: 'Pace Merchant', effects: { pace: 35, attack: 40, creativity: -10 } },
    { id: 'playmaker', name: 'Playmaker', effects: { creativity: 25, midfield: 30, defense: -10 } },
    { id: 'destroyer', name: 'Destroyer', effects: { physicality: 30, defense: 25, creativity: -20 } }
  ];

  // Calculate final team attributes
  const calculateFinalAttributes = () => {
    let stats = { ...formationStats[teamConfig.formation] };
    
    // Apply style modifiers
    const styleEffects = styleModifiers[teamConfig.style];
    Object.keys(styleEffects).forEach(stat => {
      if (stats[stat] !== undefined) {
        stats[stat] += styleEffects[stat];
      }
    });

    // Apply resource allocation
    stats.attack *= (teamConfig.resources.attack / 90);
    stats.midfield *= (teamConfig.resources.midfield / 90);
    stats.defense *= (teamConfig.resources.defense / 90);

    // Apply specialist effects
    teamConfig.specialists.forEach(specialistId => {
      const specialist = specialists.find(s => s.id === specialistId);
      if (specialist) {
        Object.keys(specialist.effects).forEach(stat => {
          if (stats[stat] !== undefined) {
            stats[stat] += specialist.effects[stat];
          }
        });
      }
    });

    // Apply configuration bonuses
    if (teamConfig.pressing_intensity === 'swarm') {
      stats.physicality += 8;
      stats.pace += 5;
      stats.discipline -= 5;
    } else if (teamConfig.pressing_intensity === 'passive') {
      stats.pressing_resist += 10;
      stats.discipline += 8;
      stats.physicality -= 3;
    }

    if (teamConfig.risk_reward === 'hollywood') {
      stats.creativity += 12;
      stats.attack += 8;
      stats.discipline -= 8;
    } else if (teamConfig.risk_reward === 'conservative') {
      stats.discipline += 10;
      stats.defense += 6;
      stats.creativity -= 5;
    }

    if (teamConfig.fouling_strategy === 'aggressive') {
      stats.physicality += 10;
      stats.aerial_strength += 6;
      stats.discipline -= 12;
    } else if (teamConfig.fouling_strategy === 'clean') {
      stats.discipline += 15;
      stats.pressing_resist += 8;
      stats.physicality -= 4;
    }

    // Bound stats
    Object.keys(stats).forEach(stat => {
      stats[stat] = Math.max(10, Math.min(150, stats[stat]));
    });

    setFinalAttributes(stats);
  };

  useEffect(() => {
    calculateFinalAttributes();
  }, [teamConfig]);

  const handleResourceChange = (resource, value) => {
    const newResources = { ...teamConfig.resources };
    const oldValue = newResources[resource];
    const diff = value - oldValue;
    
    // Calculate total of other resources
    const otherTotal = Object.keys(newResources)
      .filter(key => key !== resource)
      .reduce((sum, key) => sum + newResources[key], 0);
    
    // Check if new total would exceed 240
    if (value + otherTotal <= 240 && value >= 60 && value <= 120) {
      newResources[resource] = value;
      setTeamConfig({ ...teamConfig, resources: newResources });
    }
  };

  const handleSpecialistToggle = (specialistId) => {
    const currentSpecialists = [...teamConfig.specialists];
    const index = currentSpecialists.indexOf(specialistId);
    
    if (index > -1) {
      currentSpecialists.splice(index, 1);
    } else if (currentSpecialists.length < 3) {
      currentSpecialists.push(specialistId);
    }
    
    setTeamConfig({ ...teamConfig, specialists: currentSpecialists });
  };

  const getTotalResources = () => {
    return Object.values(teamConfig.resources).reduce((sum, val) => sum + val, 0);
  };

  const getAttributeColor = (value) => {
    if (value >= 100) return 'text-green-600 font-bold';
    if (value >= 80) return 'text-green-500';
    if (value >= 60) return 'text-yellow-500';
    if (value >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-green-50 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">⚽ Team Configuration</h1>
        <p className="text-gray-600">Configure your team's tactical setup and see real-time attribute calculations</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Configuration Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Basic Information
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Team Name</label>
              <input
                type="text"
                value={teamConfig.name}
                onChange={(e) => setTeamConfig({ ...teamConfig, name: e.target.value })}
                placeholder="Enter team name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Formation & Style */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Formation & Playing Style
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Formation</label>
                <select
                  value={teamConfig.formation}
                  onChange={(e) => setTeamConfig({ ...teamConfig, formation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="4-4-2">4-4-2 (Balanced)</option>
                  <option value="4-3-3">4-3-3 (Attacking wings)</option>
                  <option value="4-2-3-1">4-2-3-1 (Creative midfield)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Playing Style</label>
                <select
                  value={teamConfig.style}
                  onChange={(e) => setTeamConfig({ ...teamConfig, style: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="possession">Possession (Patient build-up)</option>
                  <option value="counter">Counter (Hit on transition)</option>
                  <option value="attacking">Attacking (Go forward)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tempo & Mentality */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Tempo & Mentality
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Tempo</label>
                <div className="flex gap-2">
                  {['slow', 'medium', 'fast'].map(tempo => (
                    <button
                      key={tempo}
                      onClick={() => setTeamConfig({ ...teamConfig, tempo })}
                      className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                        teamConfig.tempo === tempo
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tempo.charAt(0).toUpperCase() + tempo.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mentality</label>
                <select
                  value={teamConfig.mentality}
                  onChange={(e) => setTeamConfig({ ...teamConfig, mentality: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="defensive">Defensive</option>
                  <option value="balanced">Balanced</option>
                  <option value="attacking">Attacking</option>
                </select>
              </div>
            </div>
          </div>

          {/* Resource Allocation */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Resource Allocation
            </h3>
            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-2">
                Total: {getTotalResources()}/240 points
              </div>
              {Object.entries(teamConfig.resources).map(([resource, value]) => (
                <div key={resource}>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700 capitalize">{resource}</label>
                    <span className="text-sm text-gray-600">{value} points</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="120"
                    value={value}
                    onChange={(e) => handleResourceChange(resource, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Tactical Settings */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Tactical Settings
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pressing Intensity</label>
                <select
                  value={teamConfig.pressing_intensity}
                  onChange={(e) => setTeamConfig({ ...teamConfig, pressing_intensity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="passive">Passive</option>
                  <option value="selective">Selective</option>
                  <option value="swarm">Swarm</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Risk/Reward</label>
                <select
                  value={teamConfig.risk_reward}
                  onChange={(e) => setTeamConfig({ ...teamConfig, risk_reward: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="conservative">Conservative</option>
                  <option value="ambitious">Ambitious</option>
                  <option value="hollywood">Hollywood</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fouling Strategy</label>
                <select
                  value={teamConfig.fouling_strategy}
                  onChange={(e) => setTeamConfig({ ...teamConfig, fouling_strategy: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="clean">Clean</option>
                  <option value="professional">Professional</option>
                  <option value="aggressive">Aggressive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Defensive Line</label>
                <select
                  value={teamConfig.defensive_line}
                  onChange={(e) => setTeamConfig({ ...teamConfig, defensive_line: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="high_line">High Line</option>
                  <option value="medium_line">Medium Line</option>
                  <option value="deep_block">Deep Block</option>
                </select>
              </div>
            </div>
          </div>

          {/* Specialists */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5" />
              Specialists ({teamConfig.specialists.length}/3)
            </h3>
            <div className="grid gap-3">
              {specialists.map(specialist => (
                <div
                  key={specialist.id}
                  onClick={() => handleSpecialistToggle(specialist.id)}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                    teamConfig.specialists.includes(specialist.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-800">{specialist.name}</div>
                  <div className="text-sm text-gray-600">
                    Effects: {Object.entries(specialist.effects)
                      .map(([stat, value]) => `${stat} ${value > 0 ? '+' : ''}${value}`)
                      .join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Attribute Preview */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Final Attributes
            </h3>
            <div className="space-y-3">
              {Object.entries(finalAttributes).map(([attribute, value]) => (
                <div key={attribute} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {attribute.replace('_', ' ')}
                  </span>
                  <span className={`text-sm font-mono ${getAttributeColor(value)}`}>
                    {Number(value).toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Team Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div><span className="font-medium">Name:</span> {teamConfig.name || 'Unnamed Team'}</div>
              <div><span className="font-medium">Formation:</span> {teamConfig.formation}</div>
              <div><span className="font-medium">Style:</span> {teamConfig.style}</div>
              <div><span className="font-medium">Tempo:</span> {teamConfig.tempo}</div>
              <div><span className="font-medium">Resources:</span> A:{teamConfig.resources.attack} M:{teamConfig.resources.midfield} D:{teamConfig.resources.defense}</div>
              <div><span className="font-medium">Specialists:</span> {teamConfig.specialists.length}/3 selected</div>
            </div>
          </div>

          <button className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg">
            Save Team Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamConfigurationForm;
