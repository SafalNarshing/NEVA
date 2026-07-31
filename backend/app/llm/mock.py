"""
Offline mock guidance engine.

Used when no model credentials are configured (or USE_MOCK=true) so the whole
frontend -> backend pipeline works end-to-end for the demo without any external
provider. Keyword-matched, calm first-aid replies that mirror the frontend
fallback.
"""

from ..schemas import Message

_KNOWLEDGE = [
    {
        "keys": ("cut", "bleed", "blood", "wound", "रगत", "काट"),
        "reply": (
            "Okay, stay calm — I’m here with you. Press a clean cloth firmly on "
            "the cut and keep pressing without lifting it. Raise the hand above "
            "chest level if you can."
        ),
        "follow": "Is the bleeding soaking through the cloth, or slowing down?",
        "ne": {
            "reply": (
                "ठीक छ, शान्त रहनुहोस् — म तपाईंसँग छु। सफा कपडाले घाउमा कडा "
                "दबाब दिनुहोस् र उठाउन नदिई थिचिराख्नुहोस्। सम्भव भए हात मुटुभन्दा "
                "माथि उठाउनुहोस्।"
            ),
            "follow": "के रगत कपडा भिजेर आइरहेको छ, वा सुस्त हुँदैछ?",
        },
    },
    {
        "keys": ("burn", "scald", "hot", "पोल", "डढ"),
        "reply": (
            "Let’s cool it right away. Hold the burn under cool running water for "
            "20 minutes. Do not apply ice, butter, or cream."
        ),
        "follow": "Are there any blisters, or is the skin broken?",
        "ne": {
            "reply": (
                "अहिले नै चिसो पारौं। डढेको ठाउँलाई चिसो बग्ने पानीमुनि २० मिनेट "
                "राख्नुहोस्। बरफ, घिउ वा क्रिम नलगाउनुहोस्।"
            ),
            "follow": "के फोका परेको छ, वा छाला च्यातिएको छ?",
        },
    },
    {
        "keys": ("chok", "breath", "swallow", "सास", "अठ्याइयो"),
        "reply": (
            "Stay calm. If they cannot cough or speak, lean them forward and give "
            "5 firm blows between the shoulder blades with the heel of your hand."
        ),
        "follow": "Did the object come out, or are they still struggling to breathe?",
        "ne": {
            "reply": (
                "शान्त रहनुहोस्। खोक्न वा बोल्न नसके उहाँलाई अगाडि झुकाउनुहोस् र "
                "हातको पुड्कोले काँधका बीचमा ५ पटक कडा हान्नुहोस्।"
            ),
            "follow": "के वस्तु निस्कियो, वा अझै सास फेर्न गाह्रो भइरहेको छ?",
        },
    },
    {
        "keys": ("faint", "unconscious", "collapse", "बेहोस"),
        "reply": (
            "Check if they respond to their name and a gentle shoulder shake. Tilt "
            "their head back and check for breathing for 10 seconds. Call 102 now."
        ),
        "follow": "Are they breathing normally right now?",
        "ne": {
            "reply": (
                "नाम बोलाएर र काँध हल्लाएर प्रतिक्रिया छ कि हेर्नुहोस्। टाउको पछाडि "
                "फर्काएर १० सेकेन्डसम्म सास जाँच्नुहोस्। अहिले नै १०२ मा कल गर्नुहोस्।"
            ),
            "follow": "के उहाँ अहिले सामान्य रूपमा सास फेर्दै हुनुहुन्छ?",
        },
    },
    {
        "keys": ("snake", "bite", "सर्प", "टोक"),
        "reply": (
            "Keep them as still and calm as possible — movement spreads venom. Keep "
            "the bitten limb still and below the heart, and remove rings or watches."
        ),
        "follow": "Can you tell me which limb was bitten and when it happened?",
        "ne": {
            "reply": (
                "उहाँलाई सकेसम्म स्थिर र शान्त राख्नुहोस् — चल्दा विष फैलिन्छ। टोकेको "
                "अंगलाई स्थिर राखी मुटुभन्दा तल राख्नुहोस्, र औंठी वा घडी फुकाल्नुहोस्।"
            ),
            "follow": "कुन अंगमा टोकेको र कहिले भएको हो बताउन सक्नुहुन्छ?",
        },
    },
    {
        "keys": ("chest", "heart", "cpr", "मुटु"),
        "reply": (
            "If they are unresponsive and not breathing normally, we need CPR. Place "
            "the heel of your hand in the centre of the chest and push hard and "
            "fast, about twice per second. Call 102."
        ),
        "follow": "Is anyone nearby who can call 102 while you start compressions?",
        "ne": {
            "reply": (
                "यदि उहाँ बेहोस हुनुहुन्छ र सामान्य रूपमा सास फेरिरहनुभएको छैन भने "
                "सीपीआर गर्नुपर्छ। हातको पुड्को छातीको बीचमा राखेर कडा र छिटो, प्रति "
                "सेकेन्ड लगभग २ पटक थिच्नुहोस्। १०२ मा कल गर्नुहोस्।"
            ),
            "follow": "तपाईंले छाती थिच्न थाल्दा नजिकै १०२ मा कल गर्न सक्ने कोही छ?",
        },
    },
]


def mock_reply(
    messages: list[Message],
    image: str | None,
    mode: str,
    language: str = "en",
) -> tuple[str, str | None]:
    last_user = next(
        (m.content for m in reversed(messages) if m.role == "user"), ""
    ).lower()

    for entry in _KNOWLEDGE:
        if any(k in last_user for k in entry["keys"]):
            if language == "ne" and entry.get("ne"):
                return entry["ne"]["reply"], entry["ne"]["follow"]
            return entry["reply"], entry["follow"]

    if image:
        if language == "ne":
            return (
                "फोटोका लागि धन्यवाद — म प्रभावित क्षेत्र देख्न सक्छु। यसलाई सफा र "
                "स्थिर राख्नुहोस्। हामी एक-एक पाइला गर्दै अगाडि बढौं।",
                "उहाँलाई अहिले कस्तो छ? चक्कर आइरहेको वा कडा दुखाइ छ?",
            )
        return (
            "Thanks for the photo — I can see the affected area. Keep it clean and "
            "still. Let’s take this one step at a time.",
            "How is the person feeling right now — any dizziness or severe pain?",
        )

    if language == "ne":
        return (
            "म मद्दत गर्न यहीं छु। सास फेर्नुहोस् — के भयो र कहाँ चोट लाग्यो "
            "बताउनुहोस्, हामी एक-एक पाइला गर्दै अगाडि बढ्नेछौं।",
            "चोटको बारेमा वर्णन गर्न सक्नुहुन्छ?",
        )

    return (
        "I’m here to help. Take a breath — tell me what happened and where the "
        "person is hurt, and we’ll go through it one step at a time.",
        "Can you describe the injury for me?",
    )
