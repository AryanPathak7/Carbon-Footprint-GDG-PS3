import { OpenAI } from 'openai';

let openai;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

// Local Persona-based responses for fallback (or when key isn't provided)
const LOCAL_RESPONSES = {
  child: {
    cyber_safety: "Hey little explorer! 🚀 The internet is like a massive playground, but just like in real parks, we shouldn't talk to strangers or share our secrets (like passwords or where we live). If you ever see something scary, immediately tell a big helper like a parent or teacher! 🛡️",
    environment: "Imagine our planet is a giant green castle! 🏰 Trees are the lungs, and rivers are its veins. When we recycle plastic or plant seeds, we are putting on our hero capes to protect the castle! Superheroes don't litter. 🦸",
    digital_wellbeing: "Toby the Turtle loves his tablet, but his eyes got super tired! 🐢 Remember to follow the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds. Run outside and play catch to give your brain a happy break! ☀️"
  },
  teen: {
    cyber_safety: "Listen up: Phishing scams are getting way too smart. 🎣 Never click links in random DMs, keep your 2FA turned on, and don't share passwords. Also, remember that whatever you post online leaves a digital footprint that never really goes away. Keep it clean! 🔒",
    environment: "Climate change isn't a future problem, it's happening right now. 🌍 Fast fashion and plastic waste are ruining ecosystems. You can start by shopping thrift, using reusable cups, and sharing petitions. Use your platform to amplify awareness! 📣",
    digital_wellbeing: "Doomscrolling at 2 AM is wrecking your sleep and dopamine receptors. 📱 Try setting app limits, turning off notifications, and doing a 'Digital Detox' Sunday. Your mental health will thank you for breaking the scroll cycle. 🧠"
  },
  adult: {
    cyber_safety: "Cyber security is essential for protecting your financial and personal data. Implement strong, unique passwords with a password manager, avoid public Wi-Fi for sensitive transactions, and verify all emails asking for urgent credentials. 🛡️",
    environment: "Sustainable living involves conscious consumer decisions. Reducing energy consumption at home, transitioning to public transit or electric vehicles, minimizing single-use plastics, and supporting eco-friendly businesses can lower your carbon footprint. 🌲",
    digital_wellbeing: "Prolonged screen usage increases cortisol levels and reduces productivity. Implement strict bounds on work communications, establish offline hours, and practice mindfulness. Strive for a balanced physical and digital lifestyle. 💼"
  },
  senior: {
    cyber_safety: "Hello! Cyber safety means keeping your virtual front door locked. 🔑 Be careful of phone calls or emails claiming you won a prize or asking for your bank details. Real banks will never ask you to send passwords. If something feels suspicious, ask a family member first. 👵👴",
    environment: "Caring for our neighborhood keeps it beautiful for our grandchildren. Simple habits like sorting kitchen waste, composting, turning off unused lights, and nurturing household plants help preserve the environment for future generations. 🌸",
    digital_wellbeing: "Technology is wonderful for staying connected, but too much screen time can strain your eyes and make you feel isolated. Balance your tablet use by taking short walks, doing eye exercises (rolling your eyes slowly), and meeting friends face-to-face. 🚶‍♂️"
  }
};

// Generic response generator helper
const generateMockResponse = (topic, ageGroup) => {
  const normalizedTopic = topic.toLowerCase();
  
  let key = 'cyber_safety';
  if (normalizedTopic.includes('environ') || normalizedTopic.includes('earth') || normalizedTopic.includes('tree') || normalizedTopic.includes('nature')) {
    key = 'environment';
  } else if (normalizedTopic.includes('screen') || normalizedTopic.includes('detox') || normalizedTopic.includes('addict') || normalizedTopic.includes('wellbeing') || normalizedTopic.includes('phone') || normalizedTopic.includes('digital')) {
    key = 'digital_wellbeing';
  }

  const responseGroup = LOCAL_RESPONSES[ageGroup] || LOCAL_RESPONSES['adult'];
  const baseResponse = responseGroup[key] || `Here is a custom insight on "${topic}" tailored for ${ageGroup}s: Focus on incremental changes, keep your data protected, and take active steps to help your local community thrive.`;
  return baseResponse;
};

// @desc    Get AI awareness response
// @route   POST /api/ai/chat
// @access  Private
export const getAIChatResponse = async (req, res) => {
  const { prompt, ageGroup } = req.body;
  const targetAgeGroup = ageGroup || req.user?.ageGroup || 'adult';

  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required' });
  }

  // If OpenAI API is configured
  if (openai) {
    try {
      let systemInstructions = `You are the AwareSphere AI assistant. Your goal is to explain social awareness topics (Digital Wellbeing, Cyber Safety, Mental Health, Environment, Financial Literacy, Road Safety, Social Responsibility) and recommend real-world actions.`;
      
      if (targetAgeGroup === 'child') {
        systemInstructions += ` Explain concepts using fun metaphors, emojis, simplified terms, and a friendly cartoon character voice. Keep responses short and engaging.`;
      } else if (targetAgeGroup === 'teen') {
        systemInstructions += ` Explain concepts using modern teen slang, social media terms, fast-paced examples, and direct digital wellbeing advice.`;
      } else if (targetAgeGroup === 'senior') {
        systemInstructions += ` Explain concepts using respectful, warm, slow-paced language. Avoid complicated tech jargon. Emphasize physical safety, scam awareness, and family connections.`;
      } else {
        systemInstructions += ` Explain concepts professionally, clearly, focusing on actionable steps, scientific facts, and social responsibility.`;
      }

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemInstructions },
          { role: 'user', content: prompt }
        ],
        max_tokens: 300,
        temperature: 0.7
      });

      return res.json({ response: response.choices[0].message.content });
    } catch (error) {
      console.warn("OpenAI API call failed, falling back to local NLP generator.", error.message);
    }
  }

  // Fallback / Mock responses
  const mockResp = generateMockResponse(prompt, targetAgeGroup);
  res.json({ response: mockResp });
};
