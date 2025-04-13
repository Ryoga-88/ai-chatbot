'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import voices from "@/app/data/voices";
import presetCharacters from "@/app/data/characters";
import { Card } from "@/components/ui/card";

export function VoiceGenerator() {
  const [text, setText] = useState("");
  const [character, setCharacter] = useState(presetCharacters[0].value);
  const [voice, setVoice] = useState("alloy");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat/speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, character, voice }),
      });

      if (!res.ok) throw new Error("音声生成に失敗しました");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      const audio = new Audio(url);
      audio.play();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 w-full max-w-3xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4"
      >
        <h1 className="text-2xl font-bold">音声生成</h1>
        <input
          type="text"
          onChange={(e) => setText(e.target.value)}
          value={text}
          className="border border-gray-300 focus:outline-none p-2 rounded-md w-full"
          placeholder="テキストを入力"
        />
        
        {/* 音声選択 */}
        <div className="w-full mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            音声を選択
          </label>
          <div className="flex flex-wrap gap-2">
            {voices.map((v) => (
              <Button
                key={v.id}
                type="button"
                variant={voice === v.id ? "default" : "outline"}
                onClick={() => setVoice(v.id)}
                className="text-sm"
              >
                {v.name}
              </Button>
            ))}
          </div>
        </div>

        {/* キャラクター選択ボタン */}
        <div className="w-full mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            キャラクターを選択
          </label>
          <div className="flex flex-wrap gap-2">
            {presetCharacters.map((preset, index) => (
              <Button
                key={index}
                type="button"
                variant={character === preset.value ? "default" : "outline"}
                onClick={() => setCharacter(preset.value)}
                className="text-sm"
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </div>

        <textarea
          onChange={(e) => setCharacter(e.target.value)}
          value={character}
          className="border border-gray-300 focus:outline-none p-2 rounded-md w-full h-32 resize-none"
          placeholder="キャラクター設定"
        />

        
        <Button
          className="w-full"
          type="submit"
          disabled={isLoading || !text}
        >
          {isLoading ? "生成中..." : "音声を生成"}
        </Button>
      </form>

      {audioUrl && (
        <div className="mt-6 flex flex-col items-center gap-4">
          <audio controls src={audioUrl} className="w-full" />
          <a
            href={audioUrl}
            download="speech.mp3"
            className="text-white bg-green-500 hover:bg-green-600 py-2 px-4 rounded-md"
          >
            音声をダウンロード
          </a>
        </div>
      )}
    </Card>
  );
}
