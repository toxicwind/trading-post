---
name: voice-telephony
version: '1.0.0'
description: Voice call routing with Twilio, Telnyx, and Plivo plus STT/TTS streaming providers — IVR setup, provider selection, and voice pipeline configuration.
author: Wunderland
namespace: wunderland
category: voice
tags: [voice, telephony, twilio, telnyx, plivo, stt, tts, ivr, call-routing, streaming]
requires_secrets: []
requires_tools: []
metadata:
  agentos:
    emoji: "\U0001F4DE"
---

# Voice & Telephony

You are a voice pipeline specialist. You configure telephony providers for call routing, set up IVR flows, and wire STT/TTS streaming providers for real-time voice conversations.

## Telephony Providers

### Twilio
- **Tool IDs**: `twilioVoiceCall`, `twilioVoiceProvider`
- **Secrets**: `twilio.accountSid`, `twilio.authToken`
- **Best for**: Most popular choice; rich ecosystem, global coverage, excellent docs
- **Capabilities**:
  - Outbound phone calls with TwiML scripting
  - Inbound call webhook handling
  - Notify mode (TTS message + hangup)
  - Conversation mode (bidirectional media streams)
  - HMAC-SHA1 webhook signature verification
  - Call status callbacks
  - E.164 phone number validation
- **Pricing**: ~$0.013/min outbound US, ~$0.0085/min inbound US; phone numbers from $1/mo

### Telnyx
- **Tool IDs**: `telnyxVoiceCall`, `telnyxVoiceProvider`
- **Secrets**: `telnyx.apiKey`, `telnyx.connectionId`
- **Best for**: Cost-effective alternative to Twilio; private IP network for better quality
- **Capabilities**:
  - Outbound/inbound calls via Telnyx Call Control API
  - WebSocket media streaming for real-time audio
  - Programmable call flows (transfer, conference, record)
  - Mission Control portal for configuration
  - SIP trunking support
- **Pricing**: ~$0.007/min outbound US (roughly half of Twilio); phone numbers from $1/mo

### Plivo
- **Tool IDs**: `plivoVoiceCall`, `plivoVoiceProvider`
- **Secrets**: `plivo.authId`, `plivo.authToken`
- **Best for**: High-volume call centers; simple API; good APAC/India coverage
- **Capabilities**:
  - Outbound/inbound calls with XML-based call flows
  - Conference calling with moderation
  - Call recording and transcription
  - DTMF input handling
  - Number masking for privacy
- **Pricing**: ~$0.010/min outbound US; competitive international rates

## STT (Speech-to-Text) Streaming Providers

### Deepgram Streaming STT
- **Extension**: `streaming-stt-deepgram`
- **Secrets**: `deepgram.apiKey`
- **Best for**: Fastest real-time transcription; best accuracy for conversational speech
- **Features**:
  - WebSocket streaming with <300ms latency
  - Multiple models: Nova-2 (general), Enhanced (noisy), Base (fastest)
  - Interim results for responsive UX
  - Punctuation, diarization, smart formatting
  - 30+ languages
- **Recommendation**: Default choice for production voice apps

### Whisper Streaming STT
- **Extension**: `streaming-stt-whisper`
- **Secrets**: `openai.apiKey` (for API) or none (for local)
- **Best for**: Self-hosted/local deployment; highest accuracy for non-English languages
- **Features**:
  - OpenAI Whisper model (local or API)
  - Chunk-based streaming (not true real-time, ~1-2s chunks)
  - 97+ languages with strong multilingual performance
  - Local mode: no API costs, requires GPU for real-time
- **Recommendation**: Use when Deepgram is unavailable or for local/offline deployments

### Google Cloud STT
- **Extension**: `google-cloud-stt`
- **Secrets**: `google.serviceAccountJson`
- **Best for**: Enterprise Google Cloud integration; medical/legal domain models
- **Features**:
  - Streaming recognition via gRPC
  - Multiple models: default, phone_call, video, medical_conversation
  - Speaker diarization (who said what)
  - Word-level confidence and timing
  - Automatic punctuation

### Vosk (Offline)
- **Extension**: `vosk`
- **Secrets**: None
- **Best for**: Fully offline/airgapped deployments; edge devices
- **Features**:
  - Local models, no internet required
  - Lightweight enough for Raspberry Pi
  - 20+ language models available
  - Speaker identification
- **Recommendation**: Use for privacy-critical or offline scenarios

## TTS (Text-to-Speech) Streaming Providers

### ElevenLabs Streaming TTS
- **Extension**: `streaming-tts-elevenlabs`
- **Secrets**: `elevenlabs.apiKey`
- **Best for**: Most natural-sounding voices; voice cloning; emotional expression
- **Features**:
  - WebSocket streaming with ~200ms time-to-first-byte
  - 30+ pre-built voices, custom voice cloning
  - Adjustable stability, similarity, style
  - 29 languages with accent control
  - SSML support
- **Recommendation**: Default choice for the best voice quality

### OpenAI Streaming TTS
- **Extension**: `streaming-tts-openai`
- **Secrets**: `openai.apiKey`
- **Best for**: Simple integration; consistent quality; bundled with OpenAI key
- **Features**:
  - 6 voices (alloy, echo, fable, onyx, nova, shimmer)
  - Real-time streaming
  - Speed adjustment (0.25x to 4.0x)
  - HD quality option
- **Recommendation**: Use when already using OpenAI for LLM; quality is good but fewer customization options

### Amazon Polly
- **Extension**: `amazon-polly`
- **Secrets**: `aws.accessKeyId`, `aws.secretAccessKey`
- **Best for**: AWS ecosystem; SSML control; Neural and Standard voices
- **Features**:
  - Neural voices (natural) and Standard voices (cheaper)
  - Full SSML support (pauses, emphasis, phonemes)
  - 60+ voices across 30+ languages
  - Newscaster and Conversational styles
- **Recommendation**: Use for AWS-native deployments or when SSML control is critical

### Google Cloud TTS
- **Extension**: `google-cloud-tts`
- **Secrets**: `google.serviceAccountJson`
- **Best for**: Google Cloud integration; WaveNet voices; Studio voices
- **Features**:
  - WaveNet voices (very natural), Standard, Neural2, and Studio
  - SSML support with audio effects
  - 50+ languages, 380+ voices
  - Audio profiles (telephony, headphone, smart speaker)

### Piper (Offline)
- **Extension**: `piper`
- **Secrets**: None
- **Best for**: Offline/local TTS; edge deployment; no API costs
- **Features**:
  - ONNX-based, runs entirely local
  - 100+ voices across 30+ languages
  - Fast inference on CPU
  - Configurable quality levels
- **Recommendation**: Use for offline deployments or when API costs are a concern

## Voice Pipeline Architecture

A complete voice pipeline connects these components:

```
Microphone → VAD → STT Provider → LLM → TTS Provider → Speaker
                                    ↑
                              Memory/Context
```

### Pipeline Components
1. **VAD (Voice Activity Detection)** — `openwakeword` or `porcupine` for wake word, built-in adaptive VAD for speech detection
2. **STT** — converts speech to text in real-time
3. **LLM** — processes the transcribed text and generates a response
4. **TTS** — converts the LLM response back to speech
5. **Audio Transport** — WebRTC, WebSocket, or telephony media stream

### Provider Selection Guide

| Requirement | STT Pick | TTS Pick |
|-------------|----------|----------|
| Best quality | Deepgram Nova-2 | ElevenLabs |
| Lowest latency | Deepgram | ElevenLabs or OpenAI |
| Cheapest | Vosk (free) | Piper (free) |
| Offline capable | Vosk | Piper |
| Multilingual | Whisper | Google Cloud TTS |
| Enterprise/compliance | Google Cloud STT | Amazon Polly |
| Simplest setup | Deepgram | OpenAI TTS |

### IVR (Interactive Voice Response) Setup
1. Provision a phone number from Twilio, Telnyx, or Plivo
2. Configure inbound webhook URL pointing to your AgentOS endpoint
3. Wire the voice pipeline: STT → LLM → TTS
4. Define call flow states: greeting, menu, transfer, voicemail
5. Handle DTMF input for numeric menu selections
6. Set fallback to human operator for unhandled cases
7. Enable call recording for quality assurance (with consent disclosure)

## Best Practices

- **Latency budget** — total round-trip (STT + LLM + TTS) should be under 2 seconds for natural conversation
- **Interruption handling** — enable barge-in so users can interrupt the TTS playback
- **Fallback chain** — if primary STT/TTS fails, fall back to a secondary provider
- **Cost management** — use Vosk/Piper for development/testing; paid providers for production
- **Audio quality** — use 16kHz 16-bit mono PCM for telephony; 44.1kHz for high-fidelity
- **Silence detection** — configure VAD sensitivity to avoid cutting off slow speakers
- **Regional compliance** — recording laws vary by jurisdiction; always disclose when recording
