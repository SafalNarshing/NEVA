/**
 * Static first-aid guides used by the Instructions screen.
 * These render offline instantly and can later be enhanced per-user by Gemma.
 * `color` maps to a Tailwind gradient accent; `icon` is a lucide-react name.
 * `ne` holds the Nepali translation of the guide (title → warnings).
 */
export const firstAidGuides = [
  {
    id: 'bleeding',
    title: 'Severe Bleeding',
    tagline: 'Control blood loss fast',
    icon: 'Droplet',
    accent: 'danger',
    time: '2 min',
    severity: 'Critical',
    overview:
      'Uncontrolled bleeding is life-threatening. Apply firm, direct pressure and keep the person calm and still.',
    steps: [
      {
        title: 'Ensure safety & call for help',
        detail:
          'Make sure the scene is safe. Call 102 (ambulance) if bleeding is severe, spurting, or will not stop.',
      },
      {
        title: 'Apply direct pressure',
        detail:
          'Press firmly on the wound with a clean cloth or sterile dressing. Keep pressing continuously — do not peek.',
      },
      {
        title: 'Raise the injured area',
        detail:
          'If possible, raise the wound above the level of the heart to slow the bleeding.',
      },
      {
        title: 'Add layers, do not remove',
        detail:
          'If blood soaks through, add more cloth on top. Never remove the first layer — it helps clotting.',
      },
      {
        title: 'Secure & monitor',
        detail:
          'Bandage firmly to hold pressure. Watch for shock (pale, cold, faint). Keep the person warm until help arrives.',
      },
    ],
    warnings: [
      'Do not remove large embedded objects — pad around them instead.',
      'Seek emergency care if bleeding will not stop after 10 minutes of pressure.',
    ],
    ne: {
      title: 'गम्भीर रक्तस्राव',
      tagline: 'रगत छिटो रोक्नुहोस्',
      overview:
        'अनियन्त्रित रक्तस्राव ज्यानको जोखिम हुन्छ। सफा कपडाले घाउमा कडा दबाब दिनुहोस् र व्यक्तिलाई शान्त र स्थिर राख्नुहोस्।',
      steps: [
        {
          title: 'सुरक्षा सुनिश्चित गर्नुहोस् र मद्दतका लागि कल गर्नुहोस्',
          detail:
            'स्थान सुरक्षित छ भनी पक्का गर्नुहोस्। रक्तस्राव गम्भीर, छ्यापिएर आउने वा नरोकिने भए १०२ (एम्बुलेन्स) मा कल गर्नुहोस्।',
        },
        {
          title: 'सिधा दबाब दिनुहोस्',
          detail:
            'सफा कपडा वा बाँझो पट्टीले घाउमा कडा दबाब दिनुहोस्। निरन्तर थिचिराख्नुहोस् — नपछ्याउनुहोस्।',
        },
        {
          title: 'चोट लागेको ठाउँ माथि उठाउनुहोस्',
          detail:
            'सम्भव भए घाउ भएको अंगलाई मुटुभन्दा माथि उठाउनुहोस् ताकि रक्तस्राव सुस्त होस्।',
        },
        {
          title: 'थप तह थप्नुहोस्, नहटाउनुहोस्',
          detail:
            'रगत भिजेर आएमा माथि थप कपडा राख्नुहोस्। पहिलो तह कहिल्यै नहटाउनुहोस् — यसले रगत जमाउन मद्दत गर्छ।',
        },
        {
          title: 'सुरक्षित गरी निगरानी गर्नुहोस्',
          detail:
            'दबाब कायम राख्न पट्टीले कस्नुहोस्। झड्का (सेतो, चिसो, बेहोस) का लक्षण हेर्नुहोस्। मद्दत नआउँदासम्म व्यक्तिलाई न्यानो राख्नुहोस्।',
        },
      ],
      warnings: [
        'ठूला गाडिएका वस्तुहरू नहटाउनुहोस् — वरपर पट्टी बेरेर सुरक्षित गर्नुहोस्।',
        '१० मिनेट दबाब दिँदा पनि रगत नरोकिए आपतकालीन उपचार खोज्नुहोस्।',
      ],
    },
  },
  {
    id: 'burns',
    title: 'Burns & Scalds',
    tagline: 'Cool, cover, protect',
    icon: 'Flame',
    accent: 'brand',
    time: '3 min',
    severity: 'Moderate',
    overview:
      'Cool a burn quickly to limit damage. Never use ice, butter, or toothpaste on a burn.',
    steps: [
      {
        title: 'Stop the burning',
        detail:
          'Remove the person from the heat source. Take off jewellery or tight clothing near the burn before it swells.',
      },
      {
        title: 'Cool with running water',
        detail:
          'Hold the burn under cool (not ice-cold) running water for at least 20 minutes.',
      },
      {
        title: 'Cover loosely',
        detail:
          'Cover with cling film or a clean, non-fluffy cloth. Do not wrap tightly.',
      },
      {
        title: 'Do not pop blisters',
        detail:
          'Leave blisters intact to prevent infection. Do not apply creams, oils, or ice.',
      },
      {
        title: 'Seek help for serious burns',
        detail:
          'Get medical care for burns larger than a palm, on the face/hands/genitals, or that look white/charred.',
      },
    ],
    warnings: [
      'Never use ice, butter, or toothpaste — they worsen tissue damage.',
      'Chemical or electrical burns always need medical attention.',
    ],
    ne: {
      title: 'जलेको घाउ र पोलेको',
      tagline: 'चिसो पार्नुहोस्, छोप्नुहोस्, जोगाउनुहोस्',
      overview:
        'जलेको भाग छिटो चिसो पार्नुहोस् ताकि थप क्षति नहोस्। बरफ, बटर वा दाँतमा लगाउने मञ्जन कहिल्यै नलगाउनुहोस्।',
      steps: [
        {
          title: 'जलाउने स्रोत रोक्नुहोस्',
          detail:
            'व्यक्तिलाई आगो वा गर्मीको स्रोतबाट टाढा लैजानुहोस्। घाउ सुन्निनुअघि नजिकका गहना वा कसिलो लुगा फुकाउनुहोस्।',
        },
        {
          title: 'बगिरहेको पानीले चिसो पार्नुहोस्',
          detail:
            'जलेको भागलाई कम्तीमा २० मिनेट चिसो (बरफ-चिसो नभएको) बगिरहेको पानीमुनि राख्नुहोस्।',
        },
        {
          title: 'खुकुलो पारी छोप्नुहोस्',
          detail:
            'क्लिङ फिल्म वा सफा, रौं नझर्ने कपडाले छोप्नुहोस्। कसिलो पारी बेर्नुहुँदैन।',
        },
        {
          title: 'फोका नफुटाउनुहोस्',
          detail:
            'संक्रमण रोक्न फोकाहरू यथावत् राख्नुहोस्। क्रिम, तेल वा बरफ नलगाउनुहोस्।',
        },
        {
          title: 'गम्भीर जलेकोमा मद्दत खोज्नुहोस्',
          detail:
            'हत्केलाभन्दा ठूलो, अनुहार/हात/गोप्य अंगमा भएको, वा सेतो/डढेको देखिने जलेको घाउको लागि चिकित्सकीय उपचार लिनुहोस्।',
        },
      ],
      warnings: [
        'बरफ, बटर वा दाँत मञ्जन कहिल्यै नलगाउनुहोस् — यसले तन्तुको क्षति बढाउँछ।',
        'रासायनिक वा बिजुलीबाट जलेकोमा सधैं चिकित्सकीय ध्यान आवश्यक हुन्छ।',
      ],
    },
  },
  {
    id: 'choking',
    title: 'Choking',
    tagline: 'Clear the airway',
    icon: 'Wind',
    accent: 'teal',
    time: '1 min',
    severity: 'Critical',
    overview:
      'If someone cannot breathe, cough, or speak, act immediately with back blows and abdominal thrusts.',
    steps: [
      {
        title: 'Encourage coughing',
        detail:
          'If they can still cough, let them — coughing is the most effective way to clear the blockage.',
      },
      {
        title: 'Give 5 back blows',
        detail:
          'Lean them forward. Strike firmly between the shoulder blades with the heel of your hand up to 5 times.',
      },
      {
        title: 'Give 5 abdominal thrusts',
        detail:
          'Stand behind, place a fist above the navel, grasp with the other hand and pull sharply inward and upward.',
      },
      {
        title: 'Alternate until clear',
        detail:
          'Repeat 5 back blows and 5 thrusts. Call 102 if the blockage does not clear.',
      },
      {
        title: 'If they collapse',
        detail:
          'Begin CPR immediately and keep going until emergency services arrive.',
      },
    ],
    warnings: [
      'For infants under 1 year use gentle back blows and chest thrusts — never abdominal thrusts.',
      'Always seek medical review after abdominal thrusts.',
    ],
    ne: {
      title: 'घाँटीमा अड्किएको (चोकिङ)',
      tagline: 'स्वासनली खाली गर्नुहोस्',
      overview:
        'यदि कसैले सास फेर्न, खोक्न वा बोल्न सक्दैन भने तुरुन्तै ढाडमा हिर्काएर र पेट थिचेर मद्दत गर्नुहोस्।',
      steps: [
        {
          title: 'खोकी लगाउन प्रोत्साहित गर्नुहोस्',
          detail:
            'यदि उनी खोक्न सक्छन् भने खोक्न दिनुहोस् — अड्किएको वस्तु निकाल्न खोकी नै सबैभन्दा प्रभावकारी हुन्छ।',
        },
        {
          title: '५ पटक ढाडमा हिर्काउनुहोस्',
          detail:
            'उनलाई अगाडि झुकाउनुहोस्। हत्केलाको बीच भागले काँधका फिलामुनि ५ पटकसम्म कडा हिर्काउनुहोस्।',
        },
        {
          title: '५ पटक पेट थिच्नुहोस्',
          detail:
            'पछाडि उभिएर, नाइटोभन्दा माथि मुठी राख्नुहोस्, अर्को हातले समाती भित्र र माथितिर जोडले तान्नुहोस्।',
        },
        {
          title: 'खुलेसम्म विकल्पमा गर्नुहोस्',
          detail:
            '५ पटक ढाडमा हिर्काउने र ५ पटक पेट थिच्ने काम दोहोर्‍याउनुहोस्। नखुले १०२ मा कल गर्नुहोस्।',
        },
        {
          title: 'यदि उनी ढले',
          detail:
            'तुरुन्तै सीपीआर सुरु गर्नुहोस् र आपतकालीन सेवा नआउँदासम्म जारी राख्नुहोस्।',
        },
      ],
      warnings: [
        '१ वर्षमुनिका बच्चाका लागि हल्का ढाड थिच्ने र छाती थिच्ने मात्र गर्नुहोस् — पेट थिच्नुहुँदैन।',
        'पेट थिचेपछि सधैं चिकित्सकीय जाँच गराउनुहोस्।',
      ],
    },
  },
  {
    id: 'unconscious',
    title: 'Unconscious',
    tagline: 'Check, position, monitor',
    icon: 'UserRound',
    accent: 'brand',
    time: '2 min',
    severity: 'Critical',
    overview:
      'An unconscious person who is breathing should be placed in the recovery position and monitored closely.',
    steps: [
      {
        title: 'Check responsiveness',
        detail:
          'Gently shake the shoulders and ask loudly "Are you okay?" Look for any response.',
      },
      {
        title: 'Open the airway',
        detail:
          'Tilt the head back gently and lift the chin. Look, listen, and feel for normal breathing for 10 seconds.',
      },
      {
        title: 'Call 102',
        detail:
          'If unresponsive, call an ambulance immediately or ask someone nearby to call.',
      },
      {
        title: 'Recovery position',
        detail:
          'If breathing, roll them onto their side, tilt the head back, and keep the airway open.',
      },
      {
        title: 'Start CPR if not breathing',
        detail:
          'If not breathing normally, begin chest compressions right away — 30 compressions, then 2 rescue breaths.',
      },
    ],
    warnings: [
      'Do not give food or water to an unconscious person.',
      'Stay with them and monitor breathing until help arrives.',
    ],
    ne: {
      title: 'बेहोस भएको',
      tagline: 'जाँच्नुहोस्, राख्नुहोस्, निगरानी गर्नुहोस्',
      overview:
        'बेहोस तर सास फेरिरहेको व्यक्तिलाई रिकभरी पोजिसनमा राख्नुपर्छ र नजिकबाट निगरानी गर्नुपर्छ।',
      steps: [
        {
          title: 'प्रतिक्रिया जाँच्नुहोस्',
          detail:
            'हल्का काँध हल्लाएर ठूलो स्वरमा “ठिकै हुनुहुन्छ?” भनी सोध्नुहोस्। कुनै प्रतिक्रिया हेर्नुहोस्।',
        },
        {
          title: 'स्वासनली खोल्नुहोस्',
          detail:
            'टाउको हल्का पछाडि झुकाएर चिउँडो माथि उठाउनुहोस्। १० सेकेन्डसम्म सामान्य सास फेरिरहेको छ कि छैन हेर्नुहोस्, सुन्नुहोस् र महसुस गर्नुहोस्।',
        },
        {
          title: '१०२ मा कल गर्नुहोस्',
          detail:
            'प्रतिक्रिया नआए तुरुन्तै एम्बुलेन्स बोलाउनुहोस् वा नजिकैका कसैलाई कल गर्न भन्नुहोस्।',
        },
        {
          title: 'रिकभरी पोजिसन',
          detail:
            'सास फेरिरहेका छन् भने उनलाई छेउतिर पल्टाएर टाउको पछाडि झुकाउनुहोस् र स्वासनली खुला राख्नुहोस्।',
        },
        {
          title: 'सास नचले सीपीआर सुरु गर्नुहोस्',
          detail:
            'सामान्य सास नचले तुरुन्तै छाती थिच्न सुरु गर्नुहोस् — ३० थिचाइ, त्यसपछि २ सास।',
        },
      ],
      warnings: [
        'बेहोस व्यक्तिलाई खाना वा पानी नदिनुहोस्।',
        'मद्दत नआउँदासम्म उनीसँगै बसेर सास निगरानी गर्नुहोस्।',
      ],
    },
  },
  {
    id: 'snakebite',
    title: 'Snakebite',
    tagline: 'Stay still, get help',
    icon: 'Activity',
    accent: 'teal',
    time: '3 min',
    severity: 'Critical',
    overview:
      'Keep the person calm and as still as possible. Do not cut, suck, or apply a tourniquet.',
    steps: [
      {
        title: 'Move away & keep calm',
        detail:
          'Move beyond the snake’s striking distance. Keep the person still — movement spreads venom faster.',
      },
      {
        title: 'Immobilise the limb',
        detail:
          'Keep the bitten limb still and below heart level. Remove rings, watches, and tight clothing.',
      },
      {
        title: 'Call for help now',
        detail:
          'Call 102 and get to a hospital with antivenom as quickly and calmly as possible.',
      },
      {
        title: 'Note the time & appearance',
        detail:
          'Remember when the bite happened and what the snake looked like — but do not chase or catch it.',
      },
      {
        title: 'Do not do these',
        detail:
          'Do not cut the wound, suck the venom, apply ice, or use a tight tourniquet.',
      },
    ],
    warnings: [
      'Never apply a tourniquet or cut the bite — it causes more harm.',
      'All snakebites should be treated as potentially venomous until cleared by a doctor.',
    ],
    ne: {
      title: 'सर्पले टोकेको',
      tagline: 'स्थिर रहनुहोस्, मद्दत लिनुहोस्',
      overview:
        'व्यक्तिलाई शान्त र सकेसम्म स्थिर राख्नुहोस्। घाउ नकाट्नुहोस्, नचुस्नुहोस्, न त टर्निकेट लगाउनुहोस्।',
      steps: [
        {
          title: 'टाढा जानुहोस् र शान्त रहनुहोस्',
          detail:
            'सर्पको प्रहार दायराभन्दा टाढा जानुहोस्। व्यक्तिलाई स्थिर राख्नुहोस् — हिँडडुलले विष छिटो फैलाउँछ।',
        },
        {
          title: 'अंग स्थिर राख्नुहोस्',
          detail:
            'टोकेको अंग स्थिर र मुटुभन्दा तल राख्नुहोस्। औंठी, घडी र कसिलो लुगा फुकाउनुहोस्।',
        },
        {
          title: 'अहिले नै मद्दतका लागि कल गर्नुहोस्',
          detail:
            '१०२ मा कल गर्नुहोस् र एन्टिभेनम भएको अस्पतालमा सकेसम्म छिटो र शान्त भई पुर्‍याउनुहोस्।',
        },
        {
          title: 'समय र रूप नोट गर्नुहोस्',
          detail:
            'कहिले टोकेको र सर्प कस्तो देखिएको थियो सम्झनुहोस् — तर सर्पलाई पछ्याउनु वा समात्नु हुँदैन।',
        },
        {
          title: 'यी काम नगर्नुहोस्',
          detail:
            'घाउ नकाट्नुहोस्, विष नचुस्नुहोस्, बरफ नलगाउनुहोस्, र कसिलो टर्निकेट प्रयोग नगर्नुहोस्।',
        },
      ],
      warnings: [
        'टर्निकेट लगाउनु वा घाउ काट्नु कहिल्यै नगर्नुहोस् — यसले झन् हानि गर्छ।',
        'डाक्टरले जाँच नगरेसम्म सबै सर्पको टोकाइलाई विषालु हुनसक्ने मान्नुहोस्।',
      ],
    },
  },
  {
    id: 'cpr',
    title: 'CPR',
    tagline: 'Restart circulation',
    icon: 'HeartPulse',
    accent: 'danger',
    time: 'Ongoing',
    severity: 'Critical',
    overview:
      'CPR keeps blood and oxygen moving when the heart has stopped. Push hard, push fast, and do not stop.',
    steps: [
      {
        title: 'Check & call',
        detail:
          'Confirm they are unresponsive and not breathing normally. Call 102 and get an AED if available.',
      },
      {
        title: 'Position your hands',
        detail:
          'Place the heel of one hand in the centre of the chest, the other hand on top, fingers interlocked.',
      },
      {
        title: '30 chest compressions',
        detail:
          'Push down 5–6 cm at a rate of about 100–120 per minute. Let the chest rise fully between pushes.',
      },
      {
        title: '2 rescue breaths',
        detail:
          'Tilt the head, pinch the nose, and give 2 breaths — each making the chest rise. Then continue.',
      },
      {
        title: 'Keep going',
        detail:
          'Repeat cycles of 30 compressions and 2 breaths until help arrives or the person recovers.',
      },
    ],
    warnings: [
      'If untrained or unwilling to give breaths, do hands-only CPR — compressions alone still save lives.',
      'Use an AED as soon as one is available and follow its voice prompts.',
    ],
    ne: {
      title: 'सीपीआर',
      tagline: 'रगत सञ्चार पुनः सुरु गर्नुहोस्',
      overview:
        'हृदय रोकिएको बेला सीपीआरले रगत र अक्सिजन बगिरहन मद्दत गर्छ। कडा थिच्नुहोस्, छिटो थिच्नुहोस्, र नरोक्नुहोस्।',
      steps: [
        {
          title: 'जाँच्नुहोस् र कल गर्नुहोस्',
          detail:
            'उनी बेहोस र सामान्य रूपमा सास नफेरिरहेको पक्का गर्नुहोस्। १०२ मा कल गर्नुहोस् र एईडी भए ल्याउनुहोस्।',
        },
        {
          title: 'हात राख्ने ठाउँ',
          detail:
            'एक हातको हत्केलाको बीच भाग छातीको बीचमा राख्नुहोस्, अर्को हात माथि राखी औंलाहरू जोड्नुहोस्।',
        },
        {
          title: '३० पटक छाती थिच्नुहोस्',
          detail:
            '५–६ सेमी गहिरो, प्रति मिनेट करिब १००–१२० पटकको दरमा थिच्नुहोस्। बीचमा छाती पूरै उठ्न दिनुहोस्।',
        },
        {
          title: '२ पटक सास दिनुहोस्',
          detail:
            'टाउको पछाडि झुकाएर नाक थिच्नुहोस्, २ पटक सास दिनुहोस् — प्रत्येक पटक छाती उठ्नुपर्छ। त्यसपछि जारी राख्नुहोस्।',
        },
        {
          title: 'जारी राख्नुहोस्',
          detail:
            'मद्दत नआउँदासम्म वा व्यक्ति नफर्किँदासम्म ३० थिचाइ र २ सासको चक्र दोहोर्‍याउनुहोस्।',
        },
      ],
      warnings: [
        'तालिम नभए वा सास दिन नचाहेमा मात्र छाती थिच्ने सीपीआर गर्नुहोस् — थिचाइ मात्रले पनि ज्यान बचाउँछ।',
        'एईडी उपलब्ध भए तुरुन्तै प्रयोग गर्नुहोस् र यसको आवाज निर्देशन पालना गर्नुहोस्।',
      ],
    },
  },
  {
    id: 'fracture',
    title: 'Fractures & Sprains',
    tagline: 'Support and immobilise',
    icon: 'Bone',
    accent: 'brand',
    time: '4 min',
    severity: 'Moderate',
    overview:
      'Keep the injured part still and supported. Do not try to straighten a suspected broken bone.',
    steps: [
      {
        title: 'Keep it still',
        detail:
          'Support the injured limb in the position found. Encourage the person not to move it.',
      },
      {
        title: 'Apply cold',
        detail:
          'Wrap ice or a cold pack in cloth and apply for up to 20 minutes to reduce swelling and pain.',
      },
      {
        title: 'Immobilise & support',
        detail:
          'Use padding, a sling, or a splint to support the injury without cutting off circulation.',
      },
      {
        title: 'Do not straighten',
        detail:
          'Never try to push a bone back or straighten a deformed limb — support it as it lies.',
      },
      {
        title: 'Get medical care',
        detail:
          'Go to a hospital. Call 102 for open fractures, spine/neck injury, or severe pain.',
      },
    ],
    warnings: [
      'Do not move someone with a suspected spinal injury unless they are in danger.',
      'Check fingers/toes stay warm and pink — loosen bindings if they turn pale or cold.',
    ],
    ne: {
      title: 'भाँचिएको हड्डी र चोट',
      tagline: 'सहारा दिनुहोस् र स्थिर राख्नुहोस्',
      overview:
        'चोट लागेको भाग स्थिर र सहारासहित राख्नुहोस्। भाँचिएको हुनसक्ने हड्डी सिधा पार्ने प्रयास नगर्नुहोस्।',
      steps: [
        {
          title: 'स्थिर राख्नुहोस्',
          detail:
            'चोट लागेको अंगलाई उही अवस्थामा सहारा दिनुहोस्। व्यक्तिलाई नहल्लाउन प्रोत्साहित गर्नुहोस्।',
        },
        {
          title: 'चिसो लगाउनुहोस्',
          detail:
            'बरफ वा चिसो प्याक कपडाले बेरेर २० मिनेटसम्म लगाउनुहोस् ताकि सुन्निन र दुखाइ कम होस्।',
        },
        {
          title: 'सहारा दिनुहोस् र स्थिर पार्नुहोस्',
          detail:
            'रगत प्रवाह नरोकिने गरी गद्दी, स्लिङ वा स्प्लिन्टले चोटलाई सहारा दिनुहोस्।',
        },
        {
          title: 'सिधा नगर्नुहोस्',
          detail:
            'हड्डी भित्र धकेल्ने वा बाङ्गिएको अंग सिधा पार्ने कहिल्यै प्रयास नगर्नुहोस् — जसरी छ त्यसरी नै सहारा दिनुहोस्।',
        },
        {
          title: 'चिकित्सकीय उपचार लिनुहोस्',
          detail:
            'अस्पताल जानुहोस्। खुला भाँचिएको, मेरुदण्ड/घाँटीमा चोट वा साह्रै दुखेको अवस्थामा १०२ मा कल गर्नुहोस्।',
        },
      ],
      warnings: [
        'मेरुदण्डमा चोट लागेको आशंका भए र अति आवश्यक नभए व्यक्तिलाई नसार्नुहोस्।',
        'औंला/खुट्टा न्यानो र गुलाबी छ कि छैन जाँच्नुहोस् — सेतो वा चिसो भए बाँधिएको फुकाउनुहोस्।',
      ],
    },
  },
  {
    id: 'shock',
    title: 'Shock',
    tagline: 'Warm, calm, elevate',
    icon: 'Zap',
    accent: 'teal',
    time: '3 min',
    severity: 'Critical',
    overview:
      'Shock is a life-threatening drop in circulation. Lay the person down and keep them warm while waiting for help.',
    steps: [
      {
        title: 'Lay them down',
        detail:
          'Help the person lie down on their back on a blanket if possible.',
      },
      {
        title: 'Raise the legs',
        detail:
          'Raise and support their legs above heart level to improve blood flow to vital organs.',
      },
      {
        title: 'Keep warm',
        detail:
          'Cover them with a coat or blanket. Loosen tight clothing at the neck, chest, and waist.',
      },
      {
        title: 'Reassure & monitor',
        detail:
          'Stay calm and keep talking to them. Monitor breathing and responsiveness continuously.',
      },
      {
        title: 'Do not give food or drink',
        detail:
          'Even if they are thirsty, do not give anything by mouth. Call 102 immediately.',
      },
    ],
    warnings: [
      'Do not let the person eat, drink, or smoke.',
      'If they become unconscious, open the airway and be ready to start CPR.',
    ],
    ne: {
      title: 'झड्का (शक)',
      tagline: 'न्यानो, शान्त, माथि उठाउनुहोस्',
      overview:
        'शक रगत सञ्चारको ज्यान जोखिममा पार्ने कमी हो। मद्दत कुर्दा व्यक्तिलाई सुताएर न्यानो राख्नुहोस्।',
      steps: [
        {
          title: 'सुताउनुहोस्',
          detail:
            'सम्भव भए कम्बल वा गुन्द्रीमा व्यक्तिलाई पिठ्युँमा सुताउनुहोस्।',
        },
        {
          title: 'खुट्टा माथि उठाउनुहोस्',
          detail:
            'मुख्य अंगहरूमा रगत प्रवाह सुधार्न खुट्टा माथि उठाएर सहारा दिनुहोस्।',
        },
        {
          title: 'न्यानो राख्नुहोस्',
          detail:
            'कोट वा कम्बलले छोप्नुहोस्। घाँटी, छाती र कम्मरका कसिला लुगा फुकाउनुहोस्।',
        },
        {
          title: 'ढाडस दिनुहोस् र निगरानी गर्नुहोस्',
          detail:
            'शान्त रहनुहोस् र उनीसँग बोलिराख्नुहोस्। सास र प्रतिक्रिया निरन्तर निगरानी गर्नुहोस्।',
        },
        {
          title: 'खाना-पानी नदिनुहोस्',
          detail:
            'प्यास लागे पनि केही खान वा पिउन नदिनुहोस्। तुरुन्तै १०२ मा कल गर्नुहोस्।',
        },
      ],
      warnings: [
        'व्यक्तिलाई खान, पिउन वा धुम्रपान गर्न नदिनुहोस्।',
        'बेहोस भए स्वासनली खोल्नुहोस् र सीपीआर गर्न तयार रहनुहोस्।',
      ],
    },
  },
]

/** Returns the guide with its content merged into the requested language. */
export function getGuide(id, lang = 'en') {
  const g = firstAidGuides.find((guide) => guide.id === id)
  if (!g) return null
  if (lang !== 'ne' || !g.ne) return g
  return { ...g, ...g.ne }
}

/** Localizes a single guide object (returns a new object when translated). */
export function localizeGuide(g, lang = 'en') {
  if (lang !== 'ne' || !g.ne) return g
  return { ...g, ...g.ne }
}

/** Returns every guide in the requested language (for list pages). */
export function getGuides(lang = 'en') {
  return firstAidGuides.map((g) => localizeGuide(g, lang))
}
