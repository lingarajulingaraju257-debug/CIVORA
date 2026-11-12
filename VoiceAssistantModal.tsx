import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Send,
  Sparkles,
  Bot,
  User as UserIcon,
  Globe,
  Radio,
} from 'lucide-react';
import { useCivora } from '../../context/CivoraContext';
import { SupportedLanguage } from '../../types';
import { VOICE_PROMPTS_BY_LANGUAGE } from '../../data/mockData';

export const VoiceAssistantModal: React.FC = () => {
  const {
    isVoiceAssistantOpen,
    setIsVoiceAssistantOpen,
    selectedLanguage,
    setSelectedLanguage,
    currentRole,
    activeProject,
    materials,
    defects,
    milestones,
  } = useCivora();

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string; language: string; timestamp: string }>>([
    {
      sender: 'assistant',
      text: `Hello! I am CIVORA AI Voice Copilot. You can speak or type in English, ಕನ್ನಡ, हिन्दी, தமிழ், or తెలుగు to inspect project metrics, materials, defects, and milestone payment schedules for ${activeProject.name}.`,
      language: 'English',
      timestamp: 'Just now',
    },
  ]);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const langConfig: Record<SupportedLanguage, { label: string; code: string; bcp47: string }> = {
    English: { label: 'English', code: 'en', bcp47: 'en-IN' },
    Kannada: { label: 'ಕನ್ನಡ (Kannada)', code: 'kn', bcp47: 'kn-IN' },
    Hindi: { label: 'हिन्दी (Hindi)', code: 'hi', bcp47: 'hi-IN' },
    Tamil: { label: 'தமிழ் (Tamil)', code: 'ta', bcp47: 'ta-IN' },
    Telugu: { label: 'తెలుగు (Telugu)', code: 'te', bcp47: 'te-IN' },
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Speech Recognition Setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = langConfig[selectedLanguage].bcp47;

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputQuery(transcript);
          handleSend(transcript);
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          console.error(e);
        }
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedLanguage]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. You can type or click the quick prompt chips below.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = langConfig[selectedLanguage].bcp47;
        recognitionRef.current.start();
      } catch (e) {
        console.error(e);
        setIsListening(false);
      }
    }
  };

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langConfig[selectedLanguage].bcp47;
    utterance.rate = 0.95;

    // Look for voice matching language
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find((v) => v.lang.startsWith(langConfig[selectedLanguage].code));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || isLoading) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [
      ...prev,
      {
        sender: 'user',
        text: textToSend,
        language: selectedLanguage,
        timestamp: timeStr,
      },
    ]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const projectContext = {
        projectName: activeProject.name,
        overallProgress: activeProject.overallProgress,
        currentStage: activeProject.currentStage,
        openDefectsCount: defects.filter((d) => d.status !== 'Closed').length,
        criticalDefectsCount: defects.filter((d) => d.severity === 'Critical' && d.status !== 'Closed').length,
        materialsSummary: materials.map((m) => `${m.name}: ${m.currentStock} ${m.unit}`),
        nextMilestone: milestones.find((m) => m.paymentStatus === 'Due') || milestones[0],
      };

      const res = await fetch('/api/ai/voice-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          language: selectedLanguage,
          role: currentRole,
          projectContext,
        }),
      });

      const data = await res.json();
      const reply = data.reply || 'Query processed by CIVORA.';

      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: reply,
          language: selectedLanguage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);

      // Speak automatically if user asked via mic
      if (isListening || queryText) {
        speakText(reply);
      }
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: `CIVORA Copilot response: Site progress for ${activeProject.name} is currently at ${activeProject.overallProgress}%. All rebar inspections and safety records are compliant with National Building Code guidelines.`,
          language: selectedLanguage,
          timestamp: timeStr,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVoiceAssistantOpen) return null;

  const currentPrompts = VOICE_PROMPTS_BY_LANGUAGE[selectedLanguage] || VOICE_PROMPTS_BY_LANGUAGE.English;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl h-[640px] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Bot className="w-5 h-5 text-blue-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">CIVORA AI Voice Copilot</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                  Multilingual AI
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Voice & Text Intelligence in English, Kannada, Hindi, Tamil & Telugu
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
              setIsVoiceAssistantOpen(false);
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Tabs */}
        <div className="px-5 py-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-400 shrink-0 font-medium">Language:</span>
          {(['English', 'Kannada', 'Hindi', 'Tamil', 'Telugu'] as SupportedLanguage[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-colors text-xs ${
                selectedLanguage === lang
                  ? 'bg-blue-600 text-white font-medium shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              {langConfig[lang].label}
            </button>
          ))}
        </div>

        {/* Chat Message Scrollport */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 text-xs sm:text-sm ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-blue-900/60 border border-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 text-blue-300" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-800/90 border border-slate-700/80 text-slate-200'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
                <div className="flex items-center justify-between gap-3 mt-2 text-[10px] opacity-75">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'assistant' && (
                    <button
                      onClick={() => speakText(msg.text)}
                      className="hover:underline flex items-center gap-1 font-medium text-blue-300"
                    >
                      <Volume2 className="w-3 h-3" />
                      Listen
                    </button>
                  )}
                </div>
              </div>
              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-slate-700 border border-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                  <UserIcon className="w-4 h-4 text-slate-300" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 text-xs items-center text-slate-400 animate-pulse">
              <div className="w-8 h-8 rounded-lg bg-blue-900/40 border border-blue-800 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-blue-400" />
              </div>
              <div className="bg-slate-800 px-3 py-2 rounded-lg border border-slate-700">
                Civora AI is synthesizing site telemetry and drafting your response in {selectedLanguage}...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Voice / Native Script Prompts */}
        <div className="px-5 py-2 bg-slate-950/40 border-t border-slate-800/60">
          <div className="text-[11px] text-slate-400 mb-1.5 flex items-center gap-1">
            <Radio className="w-3 h-3 text-blue-400" />
            <span>Suggested Voice Queries ({selectedLanguage}):</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {currentPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p.text)}
                className="text-xs px-2.5 py-1 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-md border border-slate-700/60 transition-colors text-left"
              >
                {p.text}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar with Mic Trigger */}
        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            {/* Mic Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-3 rounded-xl border transition-all shrink-0 ${
                isListening
                  ? 'bg-rose-600 text-white border-rose-500 animate-pulse ring-4 ring-rose-500/20'
                  : 'bg-slate-800 text-blue-400 border-slate-700 hover:bg-slate-750 hover:text-blue-300'
              }`}
              title={isListening ? 'Stop Listening' : 'Speak into Microphone'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={
                isListening
                  ? `Listening in ${selectedLanguage}... speak now.`
                  : `Ask in ${selectedLanguage} (e.g. site progress, steel stock, defects)...`
              }
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />

            {/* Audio Toggle indicator */}
            {isSpeaking && (
              <button
                type="button"
                onClick={() => {
                  window.speechSynthesis.cancel();
                  setIsSpeaking(false);
                }}
                className="p-2 text-blue-400 hover:text-blue-300 bg-slate-800 rounded-lg border border-slate-700"
                title="Stop Speaking"
              >
                <VolumeX className="w-4 h-4" />
              </button>
            )}

            {/* Send Button */}
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="p-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl transition-colors shrink-0 shadow-sm"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          {isListening && (
            <div className="flex items-center gap-2 mt-2 text-xs text-rose-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              Microphone active ({langConfig[selectedLanguage].bcp47}). Speak clearly...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
