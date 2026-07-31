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
    },
    {
        "keys": ("burn", "scald", "hot", "पोल", "डढ"),
        "reply": (
            "Let’s cool it right away. Hold the burn under cool running water for "
            "20 minutes. Do not apply ice, butter, or cream."
        ),
        "follow": "Are there any blisters, or is the skin broken?",
    },
    {
        "keys": ("chok", "breath", "swallow", "सास", "अठ्याइयो"),
        "reply": (
            "Stay calm. If they cannot cough or speak, lean them forward and give "
            "5 firm blows between the shoulder blades with the heel of your hand."
        ),
        "follow": "Did the object come out, or are they still struggling to breathe?",
    },
    {
        "keys": ("faint", "unconscious", "collapse", "बेहोस"),
        "reply": (
            "Check if they respond to their name and a gentle shoulder shake. Tilt "
            "their head back and check for breathing for 10 seconds. Call 102 now."
        ),
        "follow": "Are they breathing normally right now?",
    },
    {
        "keys": ("snake", "bite", "सर्प", "टोक"),
        "reply": (
            "Keep them as still and calm as possible — movement spreads venom. Keep "
            "the bitten limb still and below the heart, and remove rings or watches."
        ),
        "follow": "Can you tell me which limb was bitten and when it happened?",
    },
    {
        "keys": ("chest", "heart", "cpr", "मुटु"),
        "reply": (
            "If they are unresponsive and not breathing normally, we need CPR. Place "
            "the heel of your hand in the centre of the chest and push hard and "
            "fast, about twice per second. Call 102."
        ),
        "follow": "Is anyone nearby who can call 102 while you start compressions?",
    },
]


def mock_reply(messages: list[Message], image: str | None, mode: str) -> tuple[str, str | None]:
    last_user = next(
        (m.content for m in reversed(messages) if m.role == "user"), ""
    ).lower()

    for entry in _KNOWLEDGE:
        if any(k in last_user for k in entry["keys"]):
            return entry["reply"], entry["follow"]

    if image:
        return (
            "Thanks for the photo — I can see the affected area. Keep it clean and "
            "still. Let’s take this one step at a time.",
            "How is the person feeling right now — any dizziness or severe pain?",
        )

    return (
        "I’m here to help. Take a breath — tell me what happened and where the "
        "person is hurt, and we’ll go through it one step at a time.",
        "Can you describe the injury for me?",
    )
