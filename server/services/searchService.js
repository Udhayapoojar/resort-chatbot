const FAQ = require('../models/FAQ');
const TouristPlace = require('../models/TouristPlace');
const ResortInfo = require('../models/ResortInfo');
const ChatLog = require('../models/ChatLog');

/**
 * Calculate keyword match score
 * Returns score between 0-100 based on keyword overlap
 */
const calculateMatchScore = (inputKeywords, sourceKeywords, inputText) => {
  let score = 0;
  const input = inputText.toLowerCase();

  // Check exact keyword matches
  const matchedKeywords = sourceKeywords.filter(
    (keyword) => input.includes(keyword.toLowerCase())
  );
  score += matchedKeywords.length * 30;

  // Check for partial matches
  const partialMatches = sourceKeywords.filter((keyword) => {
    const lowerKeyword = keyword.toLowerCase();
    return (
      input.includes(lowerKeyword.substring(0, Math.max(3, lowerKeyword.length / 2)))
    );
  });
  score += partialMatches.length * 10;

  return Math.min(score, 100); // Cap at 100
};

/**
 * Search FAQ collection based on keywords
 */
const searchFAQ = async (query) => {
  try {
    const queryLower = query.toLowerCase();
    const keywords = query
      .split(/\s+/)
      .filter((k) => k.length > 2);

    const faqs = await FAQ.find({
      $or: [
        { question: { $regex: queryLower, $options: 'i' } },
        { answer: { $regex: queryLower, $options: 'i' } },
        { keywords: { $in: keywords } },
      ],
    }).limit(5);

    // Score and sort
    const scored = faqs.map((faq) => ({
      ...faq.toObject(),
      matchScore: calculateMatchScore(
        keywords,
        faq.keywords,
        `${faq.question} ${faq.answer}`
      ),
      type: 'faq',
    }));

    return scored.sort((a, b) => b.matchScore - a.matchScore);
  } catch (error) {
    console.error('[v0] FAQ search error:', error);
    return [];
  }
};

/**
 * Search TouristPlace collection based on keywords
 */
const searchTouristPlaces = async (query) => {
  try {
    const queryLower = query.toLowerCase();
    const keywords = query
      .split(/\s+/)
      .filter((k) => k.length > 2);

    const places = await TouristPlace.find({
      $or: [
        { name: { $regex: queryLower, $options: 'i' } },
        { description: { $regex: queryLower, $options: 'i' } },
        { keywords: { $in: keywords } },
        { attractions: { $in: [new RegExp(queryLower, 'i')] } },
      ],
    }).limit(5);

    // Score and sort
    const scored = places.map((place) => ({
      ...place.toObject(),
      matchScore: calculateMatchScore(
        keywords,
        place.keywords,
        `${place.name} ${place.description} ${place.attractions.join(' ')}`
      ),
      type: 'tourist_place',
    }));

    return scored.sort((a, b) => b.matchScore - a.matchScore);
  } catch (error) {
    console.error('[v0] Tourist place search error:', error);
    return [];
  }
};

/**
 * Search ResortInfo collection based on keywords
 */
const searchResortInfo = async (query) => {
  try {
    const queryLower = query.toLowerCase();
    const keywords = query
      .split(/\s+/)
      .filter((k) => k.length > 2);

    const infos = await ResortInfo.find({
      $or: [
        { title: { $regex: queryLower, $options: 'i' } },
        { content: { $regex: queryLower, $options: 'i' } },
        { keywords: { $in: keywords } },
      ],
    }).limit(5);

    // Score and sort
    const scored = infos.map((info) => ({
      ...info.toObject(),
      matchScore: calculateMatchScore(
        keywords,
        info.keywords,
        `${info.title} ${info.content}`
      ),
      type: 'resort_info',
    }));

    return scored.sort((a, b) => b.matchScore - a.matchScore);
  } catch (error) {
    console.error('[v0] Resort info search error:', error);
    return [];
  }
};

/**
 * Main search function - searches all sources and returns best match
 */
const search = async (query) => {
  try {
    const [faqs, places, infos] = await Promise.all([
      searchFAQ(query),
      searchTouristPlaces(query),
      searchResortInfo(query),
    ]);

    const allResults = [...faqs, ...places, ...infos];

    // Sort by match score and return top result
    allResults.sort((a, b) => b.matchScore - a.matchScore);

    if (allResults.length > 0 && allResults[0].matchScore >= 20) {
      return {
        success: true,
        result: allResults[0],
        confidence: allResults[0].matchScore,
        alternatives: allResults.slice(1, 3), // Return top 2 alternatives
      };
    }

    return {
      success: false,
      result: null,
      confidence: 0,
      alternatives: [],
      message: 'No relevant information found. Please try a different question.',
    };
  } catch (error) {
    console.error('[v0] Search error:', error);
    return {
      success: false,
      result: null,
      confidence: 0,
      error: error.message,
    };
  }
};

/**
 * Format search result into a chat response
 */
const formatResponse = (searchResult) => {
  if (!searchResult.success) {
    return {
      text: searchResult.message || 'I couldn\'t find an answer to your question. Please try another query or contact us directly for more information.',
      type: 'no_match',
      sourceId: null,
    };
  }

  const result = searchResult.result;
  let responseText = '';

  switch (result.type) {
    case 'faq':
      responseText = `${result.answer}`;
      break;
    case 'tourist_place':
      responseText = `${result.name}\n\n${result.description}\n\n📍 Distance: ${result.distance || 'N/A'} km\n⏱️ Travel Time: ${result.travelTime || 'N/A'}\n⭐ Rating: ${result.rating || 'N/A'}/5${
        result.entryFee ? `\n💰 Entry Fee: ${result.entryFee}` : ''
      }${result.bestTimeToVisit ? `\n🕐 Best Time: ${result.bestTimeToVisit}` : ''}`;
      break;
    case 'resort_info':
      responseText = `${result.content}`;
      break;
    default:
      responseText = 'Information not available';
  }

  return {
    text: responseText,
    type: result.type,
    sourceId: result._id,
    confidence: searchResult.confidence,
  };
};

/**
 * Log chat interaction for analytics
 */
const logChat = async (sessionId, userMessage, botResponse, responseType, sourceId, confidence) => {
  try {
    const chatLog = new ChatLog({
      sessionId,
      userMessage,
      botResponse: botResponse.text,
      responseType: responseType,
      sourceId: sourceType !== 'no_match' ? sourceId : null,
      confidence,
      metadata: {
        timestamp: new Date(),
      },
    });

    await chatLog.save();
    return chatLog;
  } catch (error) {
    console.error('[v0] Chat log error:', error);
    // Don't throw - logging failure shouldn't break chat
    return null;
  }
};

module.exports = {
  search,
  formatResponse,
  logChat,
  searchFAQ,
  searchTouristPlaces,
  searchResortInfo,
};
