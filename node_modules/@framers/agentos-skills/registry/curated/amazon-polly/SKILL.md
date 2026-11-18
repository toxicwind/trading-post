---
name: amazon-polly
version: '1.0.0'
description: Neural text-to-speech via Amazon Polly — high-quality voices, MP3 output, voice listing, default Joanna (en-US Neural).
author: Wunderland
namespace: wunderland
category: voice
tags: [voice, tts, text-to-speech, amazon, aws, polly, neural]
requires_secrets: [aws.accessKeyId, aws.secretAccessKey]
requires_tools: []
metadata:
  agentos:
    emoji: "\U0001F50A"
    primaryEnv: AWS_ACCESS_KEY_ID
    homepage: https://docs.aws.amazon.com/polly/
---

# Amazon Polly TTS

Use this skill when the agent is deployed on AWS infrastructure or when the user prefers Amazon Polly's Neural engine voices. Polly provides high-quality neural TTS with MP3 output and a wide range of voices across languages and regions.

Prefer this over OpenAI or ElevenLabs TTS when the user already has AWS credentials configured, or when cost efficiency at high volume is a priority (Polly pricing is per-character rather than per-request).

## Setup

Set the following in the environment or agent secrets store:

| Variable                  | Description              |
|---------------------------|--------------------------|
| `AWS_ACCESS_KEY_ID`       | IAM access key ID        |
| `AWS_SECRET_ACCESS_KEY`   | IAM secret access key    |
| `AWS_REGION`              | AWS region (default `us-east-1`) |

## Configuration

```json
{
  "voice": {
    "tts": "amazon-polly"
  }
}
```

With a specific voice:

```json
{
  "voice": {
    "tts": "amazon-polly",
    "providerOptions": {
      "voice": "Matthew"
    }
  }
}
```

## Provider Rules

- Default voice is `Joanna` (en-US, Neural engine).
- Always use the Neural engine for production — Standard voices are lower quality.
- Call `listAvailableVoices()` to enumerate all voices available in the configured region.
- Audio is returned as MP3. Playback requires an MP3-capable audio pipeline.

## Examples

- "Use Amazon Polly with the Matthew voice for this agent."
- "List available Polly voices in us-east-1."
- "Synthesize this message using Amazon Polly."

## Constraints

- Requires `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` with `polly:SynthesizeSpeech` and `polly:DescribeVoices` IAM permissions.
- Neural engine voices are region-specific. Not all voices are available in every AWS region.
- API costs apply per character synthesized (Neural engine pricing).
