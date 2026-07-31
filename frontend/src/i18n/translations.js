/**
 * UI string dictionary for NEVA (English + Nepali).
 * `t(key, vars)` looks up `lang` first and falls back to English.
 * Placeholders are written as {name} and replaced via `vars`.
 */

export const translations = {
  en: {
    /* Shared */
    'common.goBack': 'Go back',

    /* Language toggle */
    'lang.toggleLabel': 'Language',
    'lang.en': 'English',
    'lang.ne': 'Nepali',

    /* Bottom navigation */
    'nav.primary': 'Primary',
    'nav.home': 'Home',
    'nav.guides': 'Guides',
    'nav.chat': 'Chat',
    'nav.nearby': 'Nearby',

    /* Home */
    'home.greeting': 'Hi there 👋',
    'home.heroLine1': 'How can I help you',
    'home.heroLine2': 'in this emergency?',
    'home.aiGuided': 'AI Guided',
    'home.liveMode': 'Live Mode',
    'home.liveModeSub': 'Calm, real-time voice guidance — one step at a time.',
    'home.chatMode': 'Chat Mode',
    'home.chatModeSub': 'Type, talk, or share a photo',
    'home.instructions': 'Instructions',
    'home.instructionsSub': 'Step-by-step first-aid',
    'home.nearby': 'Nearby Help',
    'home.nearbySub': 'Hospitals & pharmacies',
    'home.emergencyLine': 'Emergency line',
    'home.callNow': 'Call now',
    'home.quickGuides': 'Quick guides',
    'home.seeAll': 'See all',

    /* Instructions list */
    'guides.title': 'First-Aid Guides',
    'guides.subtitle': 'Step-by-step, works offline',
    'guides.search': 'Search emergencies…',
    'guides.noMatch': 'No guides match “{q}”. Try Chat Mode for anything not listed.',
    'severity.Critical': 'Critical',
    'severity.Moderate': 'Moderate',
    'units.steps': 'steps',

    /* Instruction detail */
    'detail.readAloud': 'Read aloud',
    'detail.stop': 'Stop',
    'detail.goLive': 'Go Live',
    'detail.important': 'Important',
    'detail.notFound': 'That guide doesn’t exist.',
    'detail.backToGuides': 'Back to guides',
    'detail.notFoundTitle': 'Not found',

    /* Chat */
    'chat.title': 'Chat Mode',
    'chat.subtitle': 'Text, voice & photos',
    'chat.live': 'Live',
    'chat.play': 'Play',
    'chat.stop': 'Stop',
    'chat.call': 'Call',
    'chat.contactingAmbulance': 'Contacting Ambulance…',
    'chat.contactingHospital': 'Contacting Hospital…',
    'chat.inputPlaceholder': 'Describe what happened…',
    'chat.transcribing': 'Transcribing…',
    'chat.listening': 'Listening…',
    'chat.sharedByYou': 'Shared by you',
    'chat.attachmentPreview': 'Attachment preview',
    'chat.removeImage': 'Remove image',
    'chat.addPhoto': 'Add a photo',
    'chat.stopRecording': 'Stop recording',
    'chat.recordVoice': 'Record voice',
    'chat.sendMessage': 'Send message',
    'chat.message': 'Message',
    'chat.flow.stayCalm':
      'Do not worry — I’ll contact help for you right now. Stay with the patient and keep them calm.',
    'chat.flow.callingAmbulance':
      'Calling the ambulance on {number}. Were you able to reach them?',
    'chat.flow.tryingHospital':
      'Now trying {label} ({number}). Did they respond?',
    'chat.flow.yesReached': 'Yes, reached',
    'chat.flow.noAnswer': 'No answer',
    'chat.flow.helpOnWay':
      'Good — help is on the way. Keep the patient still and stay with them. Tell me right away if anything changes.',
    'chat.flow.tryingNearest':
      'No problem — let me try the nearest hospital, {label}.',
    'chat.flow.exhausted':
      'We’ve tried the ambulance and the nearest hospitals. Please keep redialling 102 and, if you can, take the patient to the nearest hospital directly. I’m staying right here with you.',
    'chat.greeting':
      'Hi, I’m NEVA. Tell me what happened — you can type, tap the mic to talk, or share a photo. We’ll go through it calmly, one step at a time.',

    /* Live mode */
    'live.header': 'Live · NEVA',
    'live.statusTranscribing': 'Transcribing…',
    'live.statusListening': 'Listening…',
    'live.statusThinking': 'Thinking…',
    'live.statusSpeaking': 'Speaking…',
    'live.statusIdle': 'Tap the mic to talk',
    'live.opener': 'I am here with you. Stay calm, we will do this together.',
    'live.openerPrompt': 'Tap the mic and tell me what’s happening.',
    'live.photoShare': 'I’m sharing a photo of the injury.',

    /* Map */
    'map.title': 'Nearby Help',
    'map.subtitle': 'Kathmandu Valley & Dhulikhel',
    'map.locating': 'Locating…',
    'map.located': 'Located',
    'map.useLocation': 'Use my location',
    'map.away': 'away',
    'map.call': 'Call',
    'map.drive': 'Drive',
    'filter.All': 'All',
    'filter.Hospital': 'Hospital',
    'filter.Clinic': 'Clinic',
    'filter.Pharmacy': 'Pharmacy',
    'number.Ambulance': 'Ambulance',
    'number.Police': 'Police',
    'number.Fire': 'Fire',
    'number.Traffic Police': 'Traffic Police',

    /* Emergency button */
    'emergency.callAmbulance': 'Call Ambulance · {number}',
    'emergency.callNumber': 'Call emergency number {number}',
  },

  ne: {
    /* Shared */
    'common.goBack': 'फर्कनुहोस्',

    /* Language toggle */
    'lang.toggleLabel': 'भाषा',
    'lang.en': 'अंग्रेजी',
    'lang.ne': 'नेपाली',

    /* Bottom navigation */
    'nav.primary': 'मुख्य',
    'nav.home': 'गृह',
    'nav.guides': 'गाइडहरू',
    'nav.chat': 'च्याट',
    'nav.nearby': 'नजिक',

    /* Home */
    'home.greeting': 'नमस्ते 👋',
    'home.heroLine1': 'यो आपतकालमा म',
    'home.heroLine2': 'कसरी मद्दत गर्न सक्छु?',
    'home.aiGuided': 'एआई मार्गदर्शन',
    'home.liveMode': 'लाइभ मोड',
    'home.liveModeSub': 'शान्त, वास्तविक समयको आवाज मार्गदर्शन — एक पाइला एक गर्दै।',
    'home.chatMode': 'च्याट मोड',
    'home.chatModeSub': 'टाइप गर्नुहोस्, बोल्नुहोस्, वा फोटो साझा गर्नुहोस्',
    'home.instructions': 'निर्देशनहरू',
    'home.instructionsSub': 'चरण-दर-चरण प्राथमिक उपचार',
    'home.nearby': 'नजिकको सहायता',
    'home.nearbySub': 'अस्पताल र औषधि पसलहरू',
    'home.emergencyLine': 'आपतकालीन लाइन',
    'home.callNow': 'अहिले कल गर्नुहोस्',
    'home.quickGuides': 'छिटो गाइडहरू',
    'home.seeAll': 'सबै हेर्नुहोस्',

    /* Instructions list */
    'guides.title': 'प्राथमिक उपचार गाइडहरू',
    'guides.subtitle': 'चरण-दर-चरण, अफलाइन पनि चल्छ',
    'guides.search': 'आपतकाल खोज्नुहोस्…',
    'guides.noMatch': '“{q}” सँग मिल्ने कुनै गाइड छैन। सूचीमा नभएका कुराका लागि च्याट मोड प्रयास गर्नुहोस्।',
    'severity.Critical': 'गम्भीर',
    'severity.Moderate': 'मध्यम',
    'units.steps': 'चरणहरू',

    /* Instruction detail */
    'detail.readAloud': 'पढेर सुनाउनुहोस्',
    'detail.stop': 'रोक्नुहोस्',
    'detail.goLive': 'लाइभ जानुहोस्',
    'detail.important': 'महत्त्वपूर्ण',
    'detail.notFound': 'त्यो गाइड अवस्थित छैन।',
    'detail.backToGuides': 'गाइडहरूमा फर्कनुहोस्',
    'detail.notFoundTitle': 'फेला परेन',

    /* Chat */
    'chat.title': 'च्याट मोड',
    'chat.subtitle': 'पाठ, आवाज र फोटो',
    'chat.live': 'लाइभ',
    'chat.play': 'बजाउनुहोस्',
    'chat.stop': 'रोक्नुहोस्',
    'chat.call': 'कल',
    'chat.contactingAmbulance': 'एम्बुलेन्सलाई सम्पर्क गर्दै…',
    'chat.contactingHospital': 'अस्पताललाई सम्पर्क गर्दै…',
    'chat.inputPlaceholder': 'के भयो वर्णन गर्नुहोस्…',
    'chat.transcribing': 'ट्रान्सक्रिप्ट गर्दैँ…',
    'chat.listening': 'सुन्दैँ…',
    'chat.sharedByYou': 'तपाईंले साझा गर्नुभएको',
    'chat.attachmentPreview': 'संलग्न पूर्वावलोकन',
    'chat.removeImage': 'फोटो हटाउनुहोस्',
    'chat.addPhoto': 'फोटो थप्नुहोस्',
    'chat.stopRecording': 'रेकर्डिङ रोक्नुहोस्',
    'chat.recordVoice': 'आवाज रेकर्ड गर्नुहोस्',
    'chat.sendMessage': 'सन्देश पठाउनुहोस्',
    'chat.message': 'सन्देश',
    'chat.flow.stayCalm':
      'चिन्ता नगर्नुहोस् — म अहिले नै तपाईंका लागि मद्दतलाई सम्पर्क गर्छु। बिरामीसँगै रहनुहोस् र उहाँलाई शान्त राख्नुहोस्।',
    'chat.flow.callingAmbulance':
      'एम्बुलेन्सलाई {number} मा फोन गर्दैछु। के तपाईं उनीहरूसम्म पुग्न सक्नुभयो?',
    'chat.flow.tryingHospital':
      'अहिले {label} ({number}) लाई प्रयास गर्दैछु। के उनीहरूले जवाफ दिनुभयो?',
    'chat.flow.yesReached': 'हो, पुग्यो',
    'chat.flow.noAnswer': 'जवाफ छैन',
    'chat.flow.helpOnWay':
      'राम्रो — मद्दत बाटोमा छ। बिरामीलाई स्थिर राख्नुहोस् र उहाँसँगै रहनुहोस्। केही परिवर्तन भए तुरुन्तै भन्नुहोस्।',
    'chat.flow.tryingNearest':
      'चिन्ता नगर्नुहोस् — नजिकको अस्पताल {label} लाई प्रयास गरौं।',
    'chat.flow.exhausted':
      'हामीले एम्बुलेन्स र नजिकका अस्पतालहरूमा प्रयास गर्यौं। कृपया १०२ लाई पटक-पटक फोन गरिराख्नुहोस् र सम्भव भए बिरामीलाई सिधै नजिकको अस्पताल पुर्याउनुहोस्। म तपाईंसँगै यहीं छु।',
    'chat.greeting':
      'नमस्ते, म नेभा हुँ। के भयो बताउनुहोस् — टाइप गर्नुहोस्, माइक थिचेर बोल्नुहोस्, वा फोटो साझा गर्नुहोस्। हामी शान्त भई एक-एक पाइला गर्दै अगाडि बढ्नेछौं।',

    /* Live mode */
    'live.header': 'लाइभ · नेभा',
    'live.statusTranscribing': 'ट्रान्सक्रिप्ट गर्दैँ…',
    'live.statusListening': 'सुन्दैँ…',
    'live.statusThinking': 'सोच्दैँ…',
    'live.statusSpeaking': 'बोल्दैँ…',
    'live.statusIdle': 'बोल्न माइक थिच्नुहोस्',
    'live.opener': 'म तपाईंसँग छु। शान्त रहनुहोस्, हामी सँगै गर्नेछौं।',
    'live.openerPrompt': 'माइक थिच्नुहोस् र के भइरहेको छ बताउनुहोस्।',
    'live.photoShare': 'म चोटको फोटो साझा गर्दैछु।',

    /* Map */
    'map.title': 'नजिकको सहायता',
    'map.subtitle': 'काठमाडौं उपत्यका र धुलिखेल',
    'map.locating': 'पत्ता लगाउँदैँ…',
    'map.located': 'पत्ता लाग्यो',
    'map.useLocation': 'मेरो स्थान प्रयोग गर्नुहोस्',
    'map.away': 'टाढा',
    'map.call': 'कल',
    'map.drive': 'ड्राइभ',
    'filter.All': 'सबै',
    'filter.Hospital': 'अस्पताल',
    'filter.Clinic': 'क्लिनिक',
    'filter.Pharmacy': 'औषधि पसल',
    'number.Ambulance': 'एम्बुलेन्स',
    'number.Police': 'प्रहरी',
    'number.Fire': 'दमकल',
    'number.Traffic Police': 'ट्राफिक प्रहरी',

    /* Emergency button */
    'emergency.callAmbulance': 'एम्बुलेन्स कल गर्नुहोस् · {number}',
    'emergency.callNumber': 'आपतकालीन नम्बर {number} मा कल गर्नुहोस्',
  },
}
