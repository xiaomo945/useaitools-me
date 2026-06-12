#!/usr/bin/env python3
"""Patch remaining tools with missing best_for field."""
import json

with open('data/tools.json') as f:
    tools = json.load(f)

# ID → best_for mapping
best_for_map = {
    # Writing
    1349: "Teams that need AI text expansion and keyboard shortcuts for repetitive writing",
    1350: "E-commerce brands needing AI product descriptions and marketing copy at scale",
    1351: "Content marketers who need AI to research and write fact-checked long-form articles",
    1381: "Enterprise teams needing AI writing with brand governance and style guides",
    1408: "Startups who need AI to generate marketing copy for multiple channels quickly",
    # Image
    1353: "Artists who want Stable Diffusion with an intuitive web interface and fine controls",
    1383: "Anyone needing quick AI background removal from photos",
    1384: "Photographers and designers who need AI image upscaling without quality loss",
    1385: "Artists who want to create surreal and dreamlike AI-generated artwork",
    1386: "Creatives who want to breed and evolve AI-generated images through genetic mixing",
    # Productivity
    1359: "Remote teams that need AI-powered task management and real-time collaboration",
    1387: "Meeting-heavy professionals who want AI transcription and searchable notes",
    1388: "Sales and customer success teams that need AI meeting analysis and insights",
    1390: "Teams that need AI to record, transcribe, and highlight key moments in meetings",
    1391: "Managers who need AI meeting summaries with action item extraction",
    # Code
    1365: "AWS developers who want AI code suggestions optimized for cloud services",
    1393: "Developers who want an AI-enhanced terminal with modern features and smart completions",
    1396: "Dev teams wanting AI code review that catches bugs before merging PRs",
    1422: "GitLab users who want AI code suggestions and vulnerability explanations",
    1423: "JetBrains IDE users wanting AI code completion and refactoring assistance",
    # Audio
    1368: "Podcasters who need AI audio editing, transcription, and filler word removal",
    1369: "Remote workers needing AI background noise removal during calls and recordings",
    1397: "Musicians and creators who want AI to generate original songs from text prompts",
    1398: "Music enthusiasts wanting AI music generation with high-quality instrumentation",
    1399: "Content creators needing AI-generated royalty-free background music",
    # Video
    1375: "Corporate trainers creating AI presenter videos with digital avatars",
    1376: "Sales teams using AI to create personalized video messages for prospects",
    1403: "Social media managers who need AI to repurpose long videos into short clips",
    1404: "Content marketers who need AI to extract the most engaging moments from videos",
    1405: "Gaming streamers who want AI to automatically create highlight clips from streams",
    1406: "Video editors who want AI to auto-remove silences and create smooth jump cuts",
    1434: "Marketers creating AI-powered promotional and social media videos quickly",
    1435: "Businesses needing AI video creation with templates for logos, intros, and explainers",
    1436: "Small teams wanting to create simple AI-animated explainer videos",
    1462: "Content creators who need AI to turn blog posts into professional videos",
    1463: "Enterprises wanting AI-powered digital human video presenters for training",
    1465: "Creators who want AI to generate whimsical and artistic short video clips",
    1466: "Artists who want AI to generate music-synced animated video artworks",

    # Writing
    1410: "Marketing teams wanting quick AI copywriting for ads, emails, and social posts",
    1411: "Content teams needing an all-in-one AI design and writing platform",
    1437: "Agencies needing AI copywriting with advanced tone matching and SEO features",
    1439: "Writers who need AI-powered grammar checking with multilingual support",
    1440: "Small business owners wanting AI website copy and product descriptions",
    1441: "Side hustlers who need AI to generate niche business and marketing ideas",

    # Image
    1412: "Photographers who need AI to sharpen, denoise, and upscale images to pro quality",
    1415: "E-commerce sellers needing batch AI photo enhancement and background processing",
    1416: "Non-designers who want AI to create social graphics, icons, and mockups",
    1442: "Selfie enthusiasts wanting AI portrait enhancement and artistic style filters",
    1443: "Portrait photographers using AI for professional photo retouching and enhancement",
    1444: "Users who want AI face aging, gender swap, and fun photo transformations",
    1445: "Photographers who need AI to relight portraits with studio-quality lighting effects",
    1446: "Anyone who needs AI to instantly remove unwanted objects from photos",

    # Productivity
    1418: "Power users who want to build AI-automated workflows without coding",
    1419: "Professionals wanting AI browser automation to eliminate repetitive tasks",
    1420: "Teams that need AI to build custom classification and automation models without code",
    1421: "Businesses wanting AI to connect apps and automate data transfers",

    # Code
    1425: "Developers exploring OpenAI's code generation and natural language programming",
    1426: "Startup teams wanting AI to auto-generate full-stack boilerplate from prompts",
    1452: "Mistral users who want an optimized AI code assistant for fast completions",
    1453: "Chinese-speaking developers wanting open-source AI code generation and completion",
    1454: "QA engineers who want AI to auto-generate comprehensive test suites",
    1456: "Solo developers wanting AI to refactor code, write tests, and document APIs",

    # Audio
    1400: "Video creators who need AI to find and license the perfect soundtrack",
    1401: "Content creators who want AI to compose original background music instantly",
    1427: "Musicians who need AI-powered audio mastering to make tracks sound professional",
    1428: "Mobile creators wanting pro-quality AI audio recording and noise reduction",
    1429: "Beginner musicians wanting AI-assisted music creation and collaboration tools",
    1430: "Music producers who need AI to discover and match samples and sounds",
    1431: "Podcasters wanting open-source AI audio editing with noise reduction plugins",
    1457: "Sound designers who want AI to generate custom audio samples from text descriptions",
    1458: "Music producers who need AI to extract stems, acapellas, and instrumentals",
    1459: "Musicians who want AI to separate vocals, drums, and instruments from any song",
    1460: "Karaoke creators who need AI to remove vocals and create backing tracks",
}

# Apply
patched = 0
for tool in tools:
    tid = tool.get('id')
    if tid in best_for_map and ('best_for' not in tool or not tool.get('best_for')):
        tool['best_for'] = best_for_map[tid]
        patched += 1

# Save
with open('data/tools.json', 'w') as f:
    json.dump(tools, f, indent=2, ensure_ascii=False)

print(f'Patched {patched} tools')

# Verify
no_best = [t for t in tools if 'best_for' not in t or not t['best_for']]
print(f'Remaining without best_for: {len(no_best)}')
for t in no_best:
    print(f'  #{t["id"]} {t["name"]} ({t["category"]})')