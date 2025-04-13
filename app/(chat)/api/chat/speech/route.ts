import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";

const openai = new OpenAI();

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    // リクエストボディからデータを取得
    const { text, character, voice } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "テキストが提供されていません" },
        { status: 400 }
      );
    }

    // OpenAI APIを使用して音声を生成
    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice || "alloy", // デフォルトはalloy
      input: text,
      instructions: character,
    });

    // 音声データをバイナリとして取得
    const audioBuffer = await response.arrayBuffer();

    // 音声データをレスポンスとして返す
    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.error("音声生成エラー:", error);
    return NextResponse.json(
      { error: "音声生成に失敗しました" },
      { status: 500 }
    );
  }
}
