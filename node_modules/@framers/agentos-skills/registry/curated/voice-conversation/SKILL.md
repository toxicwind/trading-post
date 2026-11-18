---
name: voice-conversation
version: '1.0.0'
description: Run provider-agnostic live voice conversations with VAD, silence boundaries, wake-word gating, STT, and TTS through the AgentOS speech runtime.
author: Wunderland
namespace: wunderland
category: communication
tags: [voice, speech, conversation, stt, tts, vad, wake-word, whisper, elevenlabs]
requires_secrets: []
requires_tools: []
metadata:
  agentos:
    emoji: "\U0001F3A4"
---

# Live Voice Conversations

Use this skill when the user wants an agent to listen, transcribe, respond with speech, or switch between speech providers without changing the rest of the workflow.

Prefer the unified AgentOS speech runtime over provider-specific one-offs. Treat STT, TTS, VAD, and wake-word detection as separate capabilities that can be swapped independently.

## Workflow

1. Pick providers for:
   - STT
   - TTS
   - optional wake word
   - optional telephony
2. Start a speech session in one of three modes:
   - `manual` for push-to-talk or file transcription
   - `vad` for continuous listen-until-silence loops
   - `wake-word` when the user wants hands-free activation
3. Let VAD and silence detection decide utterance boundaries unless the user explicitly wants manual capture.
4. Transcribe the utterance, generate the response, then synthesize speech with the selected TTS provider.
5. Support interruption and provider switching without changing the higher-level agent behavior.

## Provider Rules

- Prefer `openai-whisper` for simple hosted transcription.
- Prefer `openai-tts` for a default hosted voice path when one API key should cover both LLM and speech.
- Prefer `elevenlabs` when voice quality or cloning matters more than simplicity.
- Prefer local providers such as `whisper-local` or `piper` when the user wants offline or lower-cost operation.
- Treat wake-word detection as optional. Default to VAD + silence detection unless the user asked for hands-free wake-up.

## Voice UX Rules

- Do not keep listening forever without a boundary policy.
- Use significant pauses as a hint; use utterance-end silence as the final cutoff.
- When speech playback is active, be ready for barge-in and interruption if the user starts speaking again.
- Surface which provider combination is active so the user knows what is handling STT and TTS.
- When provider credentials are missing, degrade to whichever speech providers are configured instead of failing the whole interaction.

## Examples

- "Start a live voice session with Whisper for STT and ElevenLabs for TTS."
- "Use OpenAI for both speech recognition and speech output."
- "Run voice chat locally with VAD and no wake word."
- "Switch the TTS provider but keep the same voice conversation flow."

## Constraints

- Hosted speech providers need API keys.
- Wake-word support is optional and may depend on a plugin or local model.
- VAD and silence thresholds should be tuned for the environment; do not hardcode one value for every context.
- Telephony call control is separate from local microphone capture, but both should share the same speech provider abstractions.
