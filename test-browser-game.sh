#!/bin/bash

# Test script for browser game generation
# This will call the Grok API and save the result

echo "🎮 Testing Browser Game Generation with Grok API"
echo "================================================"
echo ""

# Test prompt
PROMPT="A space shooter where you pilot a ship across the entire screen. Use WASD to move your ship and click to shoot lasers. Asteroids come from the top of the screen and you need to destroy them. Make it full screen with a dark space background and neon effects."

echo "📝 Prompt: $PROMPT"
echo ""
echo "🚀 Calling API..."
echo ""

# Make the API call
curl -X POST http://localhost:3002/api/generate-game \
  -H "Content-Type: application/json" \
  -d '{
    "userPrompt": "'"$PROMPT"'",
    "temperature": 0.7,
    "gameType": "browser"
  }' \
  | jq '.' > test-result.json

echo ""
echo "✅ Response saved to test-result.json"
echo ""

# Check if generation was successful
if grep -q '"success": true' test-result.json; then
  echo "✅ Game generation successful!"
  echo ""
  
  # Extract the game code
  jq -r '.gameCode' test-result.json > test-game-output.tsx
  echo "📦 Game code saved to test-game-output.tsx"
  echo ""
  echo "📊 File size: $(wc -c < test-game-output.tsx) bytes"
  echo "📊 Lines: $(wc -l < test-game-output.tsx) lines"
  echo ""
  
  # Show token usage
  TOKENS=$(jq -r '.tokensUsed' test-result.json)
  echo "🎯 Tokens used: $TOKENS"
else
  echo "❌ Game generation failed"
  echo ""
  echo "Error details:"
  jq -r '.error' test-result.json
fi

echo ""
echo "================================================"
echo "Test complete!"

