// generateAndPostArticles.js

const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// === CONFIGURATION ===
const SUPABASE_URL = 'https://aspoyyswwwsuqpgduaew.supabase.co'; // <-- Replace with your Supabase URL
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzcG95eXN3d3dzdXFwZ2R1YWV3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTM3MzQ2OSwiZXhwIjoyMDY2OTQ5NDY5fQ.dkO8mnSfnmJkciMYtoIJ4i-Y3wBy3reXt3xlxf0dWik';    // <-- Replace with your Supabase service role key
const OLLAMA_URL = 'http://localhost:11434/api/generate';
const LLAMA_MODEL = 'llama2'; // or whatever model you have pulled
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const UNSPLASH_ACCESS_KEY = 'fsGVCx93QOhubfy3bGHZhoKn0aYvC0eoN-R3L67_Kyo';

// Create images directory if it doesn't exist
const IMAGES_DIR = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// Validate environment variables
console.log('Environment check:');
console.log('- GEMINI_API_KEY:', GEMINI_API_KEY ? '✓ Set' : '✗ Missing');
console.log('- DEEPSEEK_API_KEY:', DEEPSEEK_API_KEY ? '✓ Set' : '✗ Missing');
console.log('- OLLAMA_URL:', OLLAMA_URL);
console.log('- LLAMA_MODEL:', LLAMA_MODEL);
console.log('- IMAGES_DIR:', IMAGES_DIR);

// List your categories here
const CATEGORIES = ['Europe', 'Asia', 'South America', 'Africa', 'North America', 'Oceania'];

// === CATEGORY ROTATION LOGIC ===
function getCurrentCategory() {
  const now = new Date();
  const slot = Math.floor(now.getHours() / 2) % CATEGORIES.length;
  return CATEGORIES[slot];
}

// === POST-PROCESSING HELPERS ===
const DESTINATION_LINKS = {
  'Switzerland': 'https://www.myswitzerland.com/',
  'Swiss Alps': 'https://www.myswitzerland.com/en/destinations/nature-parks/alps/',
  'Florence': 'https://www.visitflorence.com/',
  'Prague': 'https://www.prague.eu/en',
  'Algarve': 'https://www.visitalgarve.pt/en/',
  'Scotland': 'https://www.visitscotland.com/',
  'Cinque Terre': 'https://www.cinqueterre.eu.com/en/',
  'Tuscany': 'https://www.visittuscany.com/en/',
  'Greece': 'https://www.visitgreece.gr/',
  'Fiji': 'https://www.fiji.travel/',
  'Australia': 'https://www.australia.com/',
  'New Zealand': 'https://www.newzealand.com/',
  'Papua New Guinea': 'https://www.papuanewguinea.travel/',
  'Europe': 'https://www.visiteurope.com/',
  'Italy': 'https://www.italia.it/en',
  'France': 'https://www.france.fr/en',
  'Spain': 'https://www.spain.info/en/',
  'Japan': 'https://www.japan.travel/en/',
  'Peru': 'https://www.peru.travel/en',
  'Paris': 'https://en.parisinfo.com/',
  'London': 'https://visitlondon.com/',
  'Venice': 'https://www.veneziaunica.it/en',
  'Rome': 'https://www.turismoroma.it/en',
  'Hawaii': 'https://www.gohawaii.com/',
  'Bali': 'https://www.balitourismboard.org/',
  'Thailand': 'https://www.tourismthailand.org/',
  'USA': 'https://www.visittheusa.com/',
  'Canada': 'https://travel.destinationcanada.com/',
  'Mexico': 'https://www.visitmexico.com/en/',
  // Add more as needed
};

function cleanMarkdown(md) {
  // Remove asterisks used for bold/italic
  let cleaned = md.replace(/\*\*([^*]+)\*\*/g, '$1')
                  .replace(/\*([^*]+)\*/g, '$1');
  // Remove stray asterisks
  cleaned = cleaned.replace(/\*/g, '');
  // Remove extra blank lines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  // Remove leading/trailing whitespace
  cleaned = cleaned.trim();
  // Replace [Link to ...] with real URLs
  cleaned = cleaned.replace(/\[Link to ([^\]]+)\]/g, (match, place) => {
    const url = DESTINATION_LINKS[place.trim()] || '';
    return url ? `[${place}](${url})` : '';
  });
  return cleaned;
}

// === IMPROVED ASTERISK CLEANING ===
/**
 * Removes stray asterisks that are not part of valid markdown formatting (bold/italic).
 * Keeps *text* and **text** but removes asterisks that are alone or surrounded by whitespace/punctuation.
 */
function cleanAsterisks(markdown) {
  // Remove lines that are just asterisks
  markdown = markdown.replace(/^\s*\*+\s*$/gm, '');
  // Remove stray asterisks surrounded by spaces or punctuation, but not those in *text* or **text**
  markdown = markdown.replace(/(^|\s|[.,;:!?])\*+(?=\s|[.,;:!?]|$)/g, '$1');
  return markdown;
}

// === JOIN SPLIT HEADINGS ===
/**
 * Joins lines that are part of the same heading (e.g., if a heading is split across multiple lines, join them).
 * Example: '# My Heading\nTitle' => '# My Heading Title'
 */
function joinSplitHeadings(markdown) {
  // Join lines that start with '#' and are immediately followed by a line that does not start with '#' or a blank line
  return markdown.replace(/(#+ .+?)\n(?!#|\s|$)/g, (match, p1, offset, str) => {
    // Find the next line
    const nextLine = str.slice(offset + match.length).split('\n')[0];
    if (nextLine && nextLine.trim().length > 0 && !nextLine.trim().startsWith('#')) {
      return p1 + ' ';
    }
    return match;
  }).replace(/(#+ [^\n]+)\n(?!#|\s|$)/g, '$1 '); // fallback join
}

function joinAllSplitHeadings(markdown) {
  // Split into lines for easier processing
  const lines = markdown.split('\n');
  const result = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    // If this is a heading and the next lines are short fragments, join them
    if (/^#+\s/.test(line)) {
      let heading = line.trim();
      let j = i + 1;
      // Collect short lines/fragments (including those separated by blank lines)
      while (
        j < lines.length &&
        (
          lines[j].trim() === '' || // blank line
          (/^[a-zA-Z0-9.,'’”\"-]{1,10}$/.test(lines[j].trim())) // short fragment
        )
      ) {
        if (lines[j].trim() !== '') {
          heading += ' ' + lines[j].trim();
        }
        j++;
      }
      result.push(heading);
      i = j;
    } else {
      result.push(line);
      i++;
    }
  }
  return result.join('\n');
}

// Fixes malformed links like [[url](url)...] to [url](url)
function fixMalformedLinks(markdown) {
  // Replace double-bracketed links with single-bracket markdown links
  return markdown.replace(/\[\[([^\]]+)\]\]/g, '[$1]');
}

// Remove repeated markdown links (e.g., [url](url)(url)(url))
function removeRepeatedLinks(markdown) {
  return markdown.replace(/(\[([^\]]+)\]\([^)]+\))(\([^)]+\))+/, '$1');
}

function fixMarkdownSpacing(markdown) {
  // Ensure headings are on a single line and have blank lines before/after
  markdown = markdown.replace(/([^\n])(\n#+ )/g, '$1\n\n$2');
  markdown = markdown.replace(/(#+ .+)([^\n])/g, '$1\n\n$2');
  // Remove accidental line breaks in headings
  markdown = markdown.replace(/(#+ .+)\n([a-zA-Z0-9])/g, '$1 $2');
  // Ensure blank lines before/after lists
  markdown = markdown.replace(/([^\n])(\n[-*] )/g, '$1\n\n$2');
  return markdown;
}

function linkifyUrls(markdown) {
  // Convert bare URLs to markdown links
  return markdown.replace(
    /(?<!\]\()(?<!\]\()(?<!\]\()((https?:\/\/[^\s)]+))/g,
    '[$1]($1)'
  );
}

// === PARSE ARTICLE ===
function parseArticle(markdown) {
  // Extract title (look for "Title:", "# ", or fallback to first non-empty line)
  let title = '';
  const titleMatch = markdown.match(/^Title:\s*(.*?)(?:\n|$)/m);
  if (titleMatch && titleMatch[1].trim().length > 0) {
    title = titleMatch[1].trim();
  } else {
    const headingMatch = markdown.match(/^#\s+(.*?)(?:\n|$)/m);
    if (headingMatch && headingMatch[1].trim().length > 0) {
      title = headingMatch[1].trim();
    } else {
      // Fallback: first non-empty line
      const firstLine = markdown.split('\n').find(line => line.trim().length > 0);
      if (firstLine && firstLine.length < 120) title = firstLine.replace(/^#+\s*/, '').trim();
    }
  }
  // If still no title, try meta or first sentence
  if (!title || title.length < 5) {
    const metaMatch = markdown.match(/Meta Description:\s*(.*?)(?:\n|$)/m);
    if (metaMatch && metaMatch[1].trim().length > 0) {
      title = metaMatch[1].split(/[.!?]/)[0].trim();
    } else {
      // Try first sentence of content
      const firstSentence = markdown.split(/[.!?]/)[0];
      if (firstSentence && firstSentence.length > 5 && firstSentence.length < 120) {
        title = firstSentence.trim();
      }
    }
  }
  // Extract meta description
  const metaMatch = markdown.match(/Meta Description:\s*(.*?)(?:\n|$)/m);
  const meta = metaMatch ? metaMatch[1].trim() : '';
  // Remove title/meta from content
  let content = markdown
    .replace(/^Title:.*?(?:\n|$)/m, '')
    .replace(/Meta Description:.*?(?:\n|$)/m, '')
    .trim();
  // Clean up markdown
  content = cleanMarkdown(content);
  return { title, content, meta };
}

// === ARTICLE GENERATION PROMPT ===
function buildPrompt(category) {
  return `
Write a detailed, SEO-optimized travel article about a trending topic, destination, or travel tips related to ${category}.

- Use markdown for section headings and hyperlinks (e.g., ## Section Title, [keyword](https://example.com)).
- Start with a catchy, keyword-rich title as an H1 (# Title) and a compelling meta description.
- Keep paragraphs short (2–4 sentences each) and separate each paragraph with a single blank line.
- Use bullet points or numbered lists where appropriate.
- Do not use asterisks for formatting except for markdown.
- All links should be in markdown format and embedded in relevant keywords for SEO.
- Do not split sentences or headings across lines.
- Ensure the article is at least 850 words and covers the topic comprehensively.
- Use the latest SEO best practices for 2025, including semantic keywords, featured snippet formatting, and natural language.
- CRITICAL: Do not rush - take your time to create valuable, informative content. Include specific details, examples, and practical information.
`;
}

function countWords(text) {
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

// === LLM GENERATION FUNCTIONS ===
async function generateWithGemini(prompt) {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const body = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
        topP: 0.8,
        topK: 40
      }
    };
    
    console.log('Gemini request URL:', url);
    console.log('Gemini request body:', JSON.stringify(body, null, 2));
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    console.log('Gemini response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Gemini error response:', errorText);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Gemini response data:', JSON.stringify(data, null, 2));
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0].text) {
      return data.candidates[0].content.parts[0].text;
    }
    throw new Error('Gemini: No valid response in data structure');
  } catch (error) {
    console.log('Gemini detailed error:', error);
    throw error;
  }
}

async function generateWithDeepSeek(prompt) {
  try {
    const url = 'https://api.deepseek.com/v1/chat/completions';
    const body = {
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2048,
      temperature: 0.7
    };
    
    console.log('DeepSeek request URL:', url);
    console.log('DeepSeek API key (first 10 chars):', DEEPSEEK_API_KEY ? DEEPSEEK_API_KEY.substring(0, 10) + '...' : 'undefined');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify(body)
    });
    
    console.log('DeepSeek response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('DeepSeek error response:', errorText);
      throw new Error(`DeepSeek API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('DeepSeek response data:', JSON.stringify(data, null, 2));
    
    if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
      return data.choices[0].message.content;
    }
    throw new Error('DeepSeek: No valid response in data structure');
  } catch (error) {
    console.log('DeepSeek detailed error:', error);
    throw error;
  }
}

async function generateWithLlama(prompt) {
  try {
    console.log('Llama request URL:', OLLAMA_URL);
    console.log('Llama model:', LLAMA_MODEL);
    
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: LLAMA_MODEL,
        prompt,
        stream: false,
        options: { num_predict: 2048 }
      })
    });
    
    console.log('Llama response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Llama error response:', errorText);
      throw new Error(`Ollama API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Llama response data:', JSON.stringify(data, null, 2));
    
    if (data.response) {
      return data.response;
    }
    throw new Error('Llama: No valid response in data structure');
  } catch (error) {
    console.log('Llama detailed error:', error);
    throw error;
  }
}

// === IMAGE GENERATION ===
async function generateImage(title, category) {
  try {
    console.log(`Generating image for: "${title}" (${category})`);
    
    // Use Unsplash API to get a relevant travel photo
    const searchQuery = `${category} travel landscape`;
    const unsplashApiUrl = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(searchQuery)}&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`;
    
    const response = await fetch(unsplashApiUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Unsplash error response:', errorText);
      throw new Error(`Unsplash API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    const imageUrl = data.urls.full;
    const photographer = data.user.name;
    const photographerUrl = data.user.links.html;
    const unsplashUrl = data.links.html; // This is the image's Unsplash page

    const imageFileName = `travel-${category.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.jpg`;
    const imagePath = path.join(IMAGES_DIR, imageFileName);
    
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.buffer();
    
    fs.writeFileSync(imagePath, imageBuffer);
    
    console.log(`Image saved to: ${imagePath}`);
    // Return image path and attribution info
    return {
      imagePath: `/images/${imageFileName}`,
      attribution: `Photo by [${photographer}](${photographerUrl}) on [Unsplash](${unsplashUrl})`
    };
    
  } catch (error) {
    console.log('Image generation failed:', error.message);
    // Return a default image path if generation fails
    return {
      imagePath: '/images/default-travel.jpg',
      attribution: ''
    };
  }
}

function createTravelPlaceholder(title, category) {
  // Create a more sophisticated SVG placeholder with travel theme
  const svg = `
    <svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="800" height="400" fill="url(#grad1)"/>
      
      <!-- Travel icon -->
      <circle cx="400" cy="120" r="40" fill="rgba(255,255,255,0.2)"/>
      <path d="M380 120 L420 120 L400 100 Z" fill="white"/>
      <circle cx="400" cy="120" r="15" fill="white"/>
      
      <!-- Title -->
      <text x="400" y="200" font-family="Arial, sans-serif" font-size="20" font-weight="bold" text-anchor="middle" fill="white">
        ${title}
      </text>
      
      <!-- Category -->
      <text x="400" y="230" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="rgba(255,255,255,0.8)">
        ${category} Travel
      </text>
      
      <!-- Decorative elements -->
      <circle cx="100" cy="80" r="3" fill="rgba(255,255,255,0.6)"/>
      <circle cx="700" cy="120" r="2" fill="rgba(255,255,255,0.4)"/>
      <circle cx="150" cy="320" r="4" fill="rgba(255,255,255,0.5)"/>
      <circle cx="650" cy="280" r="3" fill="rgba(255,255,255,0.3)"/>
    </svg>
  `;
  
  return Buffer.from(svg, 'utf8');
}

// === SUPABASE POSTING ===
async function postToSupabase({ title, content, meta, category, imageUrl, imageAttribution }) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const { data, error } = await supabase
    .from('posts')
    .insert([
      {
        title,
        content,
        category,
        meta_description: meta,
        image: imageUrl, // Use existing 'image' column
        image_attribution: imageAttribution, // <-- new field
        created_at: new Date().toISOString()
      }
    ]);
  if (error) throw new Error(`Supabase insert error: ${error.message}`);
  return data;
}

// Advanced internal linking
async function addAdvancedInternalLinks(content, currentTitle, currentCategory, maxLinks = 6, currentId = null) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  // Fetch recent articles in the same category (excluding the current article)
  const { data: sameCategoryPosts } = await supabase
    .from('posts')
    .select('id, title')
    .neq('title', currentTitle)
    .neq('id', currentId) // <-- extra safety: never link to self by ID
    .eq('category', currentCategory)
    .order('created_at', { ascending: false })
    .limit(10);

  // Fetch recent articles from other categories if needed
  let otherPosts = [];
  if (!sameCategoryPosts || sameCategoryPosts.length < maxLinks) {
    const { data: morePosts } = await supabase
      .from('posts')
      .select('id, title, category')
      .neq('title', currentTitle)
      .neq('category', currentCategory)
      .neq('id', currentId) // <-- extra safety: never link to self by ID
      .order('created_at', { ascending: false })
      .limit(20);
    otherPosts = morePosts || [];
  }

  let allPosts = (sameCategoryPosts || []).concat(otherPosts);
  allPosts = allPosts.sort(() => Math.random() - 0.5);

  let linksAdded = 0;
  const linkedPostIds = new Set();

  for (const post of allPosts) {
    if (linksAdded >= maxLinks) break;
    if (linkedPostIds.has(post.id)) continue; // Never link to the same article twice

    // Escape special regex characters in the title
    const escapedTitle = post.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedTitle}\\b`);
    // Only replace if not already linked
    if (regex.test(content)) {
      // Check if this link already exists in the content
      const linkMarkdown = `[${post.title}](/post/${post.id})`;
      if (content.includes(linkMarkdown)) continue;

      // Replace only the first occurrence
      content = content.replace(regex, linkMarkdown);
      linkedPostIds.add(post.id);
      linksAdded++;
    }
  }

  return content;
}

// === MULTIMODAL ORCHESTRATOR ===
async function generateBestArticle(category) {
  const prompt = buildPrompt(category);
  const models = [
    { name: 'Gemini', fn: generateWithGemini },
    { name: 'DeepSeek', fn: generateWithDeepSeek },
    { name: 'Llama2', fn: generateWithLlama }
  ];
  let best = null;
  let bestWordCount = 0;
  let attempts = 0;
  while (attempts < 3) {
    for (const model of models) {
      try {
        console.log(`Trying model: ${model.name}`);
        const markdown = await model.fn(prompt);
        const { title, content, meta } = parseArticle(markdown);
        if (!title || title.length < 5) {
          console.log(`${model.name} failed to generate a valid title. Retrying...`);
          continue;
        }
        const wordCount = countWords(content);
        console.log(`${model.name} produced ${wordCount} words. Title: ${title}`);
        if (wordCount > bestWordCount && title && title.length > 4) {
          best = { title, content, meta, model: model.name, wordCount };
          bestWordCount = wordCount;
        }
        // If article is long enough and has a valid title, break early
        if (wordCount >= 850 && title && title.length > 4) return best;
      } catch (err) {
        console.log(`${model.name} failed: ${err.message}`);
      }
    }
    attempts++;
    if (best && best.title && best.title.length > 4) break;
    console.log(`Retrying article generation (attempt ${attempts + 1})...`);
  }
  if (!best || !best.title || best.title.length < 5) throw new Error('All models failed to generate an article with a valid title.');
  console.log(`Selected article from ${best.model} (${best.wordCount} words). Title: ${best.title}`);
  return best;
}

function toPlainTextArticle(markdown) {
  // Remove all markdown headings
  let text = markdown.replace(/^#+\s.*$/gm, '');
  // Remove markdown links, keep just the link text or URL
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)');
  // Remove any remaining asterisks or underscores used for formatting
  text = text.replace(/[*_`~]/g, '');
  // Remove extra blank lines
  text = text.replace(/\n{3,}/g, '\n\n');
  // Join lines that are split in the middle of a sentence/paragraph
  text = text.replace(/([^\n])\n([^\n])/g, '$1 $2');
  // Trim leading/trailing whitespace
  text = text.trim();
  // Remove multiple spaces
  text = text.replace(/ +/g, ' ');
  // Ensure paragraphs are separated by a single blank line
  text = text.replace(/\n\s*\n/g, '\n\n');
  return text;
}

// Post-processing function to normalize markdown spacing
function normalizeMarkdownSpacing(markdown) {
  // Ensure a single blank line between headings and paragraphs
  let text = markdown.replace(/(#+ .+?)\n(?!\n)/g, '$1\n\n');
  // Remove extra blank lines (more than two)
  text = text.replace(/\n{3,}/g, '\n\n');
  // Trim leading/trailing whitespace
  text = text.trim();
  return text;
}

function superAggressiveMarkdownCleanup(markdown) {
  // Join lines that are split mid-sentence (not after headings or lists)
  markdown = markdown.replace(/([^\n])\n([^\n#*-])/g, '$1 $2');
  // Ensure a single blank line after headings and lists
  markdown = markdown.replace(/(#+ .+)\n(?!\n)/g, '$1\n\n');
  markdown = markdown.replace(/(\n[-*] .+)\n(?!\n)/g, '$1\n\n');
  // Ensure a blank line before lists
  markdown = markdown.replace(/([^\n])\n([-*] )/g, '$1\n\n$2');
  // Remove extra blank lines (more than two)
  markdown = markdown.replace(/\n{3,}/g, '\n\n');
  // Trim leading/trailing whitespace
  markdown = markdown.trim();
  // Convert ALL bare URLs to markdown links (even if no anchor)
  markdown = markdown.replace(/(^|[\s(])((https?:\/\/[^\s)]+))/g, (match, p1, p2) => {
    if (/\[.*\]\([^\)]*$/.test(match)) return match;
    return `${p1}[${p2}](${p2})`;
  });
  // Force-link known keywords using DESTINATION_LINKS
  Object.entries(DESTINATION_LINKS).forEach(([keyword, url]) => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'g');
    markdown = markdown.replace(regex, `[${keyword}](${url})`);
  });
  // Remove any remaining double spaces
  markdown = markdown.replace(/  +/g, ' ');
  return markdown;
}

function enforceMarkdownSpacing(markdown) {
  // Ensure a blank line after headings
  markdown = markdown.replace(/(#+ .+)\n(?!\n)/g, '$1\n\n');
  // Ensure a blank line before lists
  markdown = markdown.replace(/([^\n])\n([-*] )/g, '$1\n\n$2');
  // Remove extra blank lines (more than two)
  markdown = markdown.replace(/\n{3,}/g, '\n\n');
  // Trim leading/trailing whitespace
  markdown = markdown.trim();
  return markdown;
}

function splitLongParagraphs(markdown) {
  // Split paragraphs longer than 3 sentences into multiple paragraphs
  return markdown.replace(/([^\n]+(\.|\!|\?))(?= [A-Z])/g, (match) => {
    // Count sentences
    const sentences = match.split(/(?<=[.!?])\s+/);
    if (sentences.length > 3) {
      return sentences.map(s => s.trim()).filter(Boolean).join('\n\n');
    }
    return match;
  });
}

function enforceUniqueExternalLinks(markdown) {
  // This regex matches [anchor](url)
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  const seenUrls = new Set();
  let match;
  let result = '';
  let lastIndex = 0;

  while ((match = linkRegex.exec(markdown)) !== null) {
    const [fullMatch, anchor, url] = match;
    // Append text before this match
    result += markdown.slice(lastIndex, match.index);

    if (seenUrls.has(url)) {
      // If we've already linked this URL, just use the anchor text (or url)
      result += anchor;
    } else {
      // First time linking this URL
      result += fullMatch;
      seenUrls.add(url);
    }
    lastIndex = match.index + fullMatch.length;
  }
  // Append the rest of the string
  result += markdown.slice(lastIndex);
  return result;
}

// === MAIN FUNCTION ===
async function main() {
  try {
    const category = getCurrentCategory();
    console.log(`Generating article for category: ${category}`);
    const { title, content, meta } = await generateBestArticle(category);
    
    // Generate image using the actual title
    console.log(`Generating image for article: "${title}"`);
    const { imagePath, attribution } = await generateImage(title, category);
    
    let cleanedContent = superAggressiveMarkdownCleanup(content);
    cleanedContent = splitLongParagraphs(cleanedContent);
    cleanedContent = enforceMarkdownSpacing(cleanedContent);

    // Dynamic internal link limit
    const wordCount = cleanedContent.split(/\s+/).length;
    let maxLinks = 6; // default

    if (wordCount < 800) maxLinks = 3;
    else if (wordCount > 2000) maxLinks = 10;

    // Get the ID of the newly inserted article
    const { data: newArticle } = await postToSupabase({
      title,
      content: cleanedContent,
      meta,
      category,
      imageUrl: imagePath,
      imageAttribution: attribution
    });
    const currentId = newArticle[0].id;

    cleanedContent = await addAdvancedInternalLinks(cleanedContent, title, category, maxLinks, currentId);

    // External links
    cleanedContent = enforceUniqueExternalLinks(cleanedContent);

    await postToSupabase({ title, content: cleanedContent, meta, category, imageUrl: imagePath, imageAttribution: attribution });
    console.log('Article posted to Supabase successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

if (require.main === module) {
  main();
}