/**
 * Static first-aid guides used by the Instructions screen.
 * These render offline instantly and can later be enhanced per-user by Gemma.
 * `color` maps to a Tailwind gradient accent; `icon` is a lucide-react name.
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
  },
]

export function getGuide(id) {
  return firstAidGuides.find((g) => g.id === id) || null
}
