"""
NEVA RAG — Hand-verified seed protocol chunks (English).
Source: WHO Basic Emergency Care (2016) + Nepal MoHP Standard Treatment Protocol (2078 BS).
These are the safety baseline. PDF pipeline augments these; never replaces them.
"""

from app.rag.models import ProtocolChunk, ChunkMetadata

SEED_CHUNKS: list[ProtocolChunk] = [

    # ══════════════════════════════════════════════════════════════════════
    # 1. CHOKING
    # ══════════════════════════════════════════════════════════════════════

    ProtocolChunk(
        metadata=ChunkMetadata(
            chunk_id       = "WHO_BEC_choking_adult_assessment_01",
            condition      = "choking",
            condition_tags = ["airway obstruction", "foreign body", "unable to breathe",
                              "gagging", "silent cough", "turning blue", "cannot speak"],
            urgency_level  = 5,
            age_group      = "adult",
            language       = "en",
            source         = "WHO_BEC_2016",
            step_type      = "assessment",
            section        = "Choking — Recognition",
            keywords       = ["choking", "airway", "obstruction", "cough", "silent", "speak"],
        ),
        text=(
            "CHOKING — RECOGNITION (Adult):\n"
            "MILD obstruction: person CAN cough forcefully, speak, or breathe. "
            "Encourage them to keep coughing. Do NOT intervene physically.\n\n"
            "SEVERE obstruction: person CANNOT cough effectively, cannot speak, cannot breathe, "
            "or makes a high-pitched noise while trying to inhale. "
            "They may clutch their throat with both hands (universal choking sign). "
            "Skin or lips may turn blue (cyanosis). "
            "This is an IMMEDIATE LIFE THREAT. Act within seconds."
        ),
    ),

    ProtocolChunk(
        metadata=ChunkMetadata(
            chunk_id       = "WHO_BEC_choking_adult_action_01",
            condition      = "choking",
            condition_tags = ["airway obstruction", "heimlich", "abdominal thrusts", "back blows"],
            urgency_level  = 5,
            age_group      = "adult",
            language       = "en",
            source         = "WHO_BEC_2016",
            step_type      = "action",
            section        = "Choking — Treatment (Conscious Adult)",
            keywords       = ["back blows", "abdominal thrusts", "heimlich", "choking"],
        ),
        text=(
            "CHOKING — TREATMENT (Conscious Adult):\n"
            "Step 1 — Give 5 firm BACK BLOWS: stand to their side, "
            "lean them forward, support the chest with one hand, "
            "strike firmly between the shoulder blades with the heel of your other hand.\n"
            "Step 2 — Check mouth after each blow. Remove object only if clearly visible.\n"
            "Step 3 — If object not cleared: give 5 ABDOMINAL THRUSTS (Heimlich): "
            "stand behind them, make a fist just above the navel, "
            "grasp with your other hand, thrust sharply INWARD and UPWARD.\n"
            "Step 4 — Alternate 5 back blows + 5 abdominal thrusts continuously.\n"
            "Step 5 — If person becomes UNCONSCIOUS: lower them to ground carefully. "
            "Begin CPR. Before each rescue breath, look in mouth — "
            "remove object ONLY if you can clearly see it. Never do blind finger sweeps."
        ),
    ),

    ProtocolChunk(
        metadata=ChunkMetadata(
            chunk_id       = "WHO_BEC_choking_paediatric_action_01",
            condition      = "choking",
            condition_tags = ["choking infant", "choking child", "baby choking", "back blows infant"],
            urgency_level  = 5,
            age_group      = "paediatric",
            language       = "en",
            source         = "WHO_BEC_2016",
            step_type      = "action",
            section        = "Choking — Treatment (Infant under 1 year)",
            keywords       = ["choking", "infant", "baby", "child", "back blows", "chest thrusts"],
        ),
        text=(
            "CHOKING — INFANT UNDER 1 YEAR:\n"
            "DO NOT use abdominal thrusts on infants — risk of organ injury.\n"
            "Step 1 — Hold infant face-DOWN along your forearm, head lower than chest. "
            "Support head. Give 5 firm BACK BLOWS between shoulder blades with heel of hand.\n"
            "Step 2 — Turn infant face-UP on your other forearm. "
            "Give 5 CHEST THRUSTS: two fingers on centre of chest, just below nipple line. "
            "Push down about 1.5 cm.\n"
            "Step 3 — Check mouth after each sequence. Remove object only if clearly visible.\n"
            "Step 4 — Alternate 5 back blows + 5 chest thrusts until object clears or infant loses consciousness.\n"
            "Step 5 — If unconscious: begin infant CPR. Call emergency services immediately."
        ),
    ),

    ProtocolChunk(
        metadata=ChunkMetadata(
            chunk_id       = "WHO_BEC_choking_both_warning_01",
            condition      = "choking",
            condition_tags = ["choking warning", "blind sweep", "do not"],
            urgency_level  = 5,
            age_group      = "both",
            language       = "en",
            source         = "WHO_BEC_2016",
            step_type      = "warning",
            section        = "Choking — Critical Warnings",
            keywords       = ["blind sweep", "choking warning", "pregnant", "infant"],
        ),
        text=(
            "CHOKING — CRITICAL WARNINGS:\n"
            "DO NOT perform blind finger sweeps in the mouth — pushes object deeper.\n"
            "DO NOT use abdominal thrusts on infants under 1 year.\n"
            "DO NOT use abdominal thrusts on pregnant women — use CHEST THRUSTS instead: "
            "hands on centre of chest, same technique as CPR compressions.\n"
            "DO NOT hold person upside down and shake them.\n"
            "DO NOT slap on the back while they are upright — lean them forward first."
        ),
    ),

    # ══════════════════════════════════════════════════════════════════════
    # 2. SEVERE BLEEDING
    # ══════════════════════════════════════════════════════════════════════

    ProtocolChunk(
        metadata=ChunkMetadata(
            chunk_id       = "WHO_BEC_bleeding_both_action_01",
            condition      = "severe_bleeding",
            condition_tags = ["haemorrhage", "hemorrhage", "blood loss", "wound",
                              "cut", "laceration", "stabbing", "gash", "injury bleeding"],
            urgency_level  = 5,
            age_group      = "both",
            language       = "en",
            source         = "WHO_BEC_2016",
            step_type      = "action",
            section        = "Bleeding — External Haemorrhage Control",
            keywords       = ["bleeding", "blood", "pressure", "tourniquet", "wound"],
        ),
        text=(
            "SEVERE EXTERNAL BLEEDING — IMMEDIATE CONTROL:\n"
            "Step 1 — DIRECT PRESSURE: press a clean cloth or clothing firmly over the wound. "
            "Do NOT lift to check — keep pressing continuously for at least 10 minutes.\n"
            "Step 2 — If blood soaks through: ADD more cloth on top. Do NOT remove the first cloth.\n"
            "Step 3 — TOURNIQUET (limb wounds only, if direct pressure fails): "
            "apply a band 5–7 cm above the wound. Tighten until bleeding STOPS. "
            "Write the time of application on the person\'s skin. "
            "Do NOT remove — hospital staff must remove it.\n"
            "Step 4 — Lay person flat. Raise the bleeding limb above heart level "
            "IF no bone injury is suspected.\n"
            "Step 5 — Keep warm. Monitor breathing. Do NOT give food or water.\n"
            "Step 6 — Call emergency services. State \'severe bleeding.\'"
        ),
    ),

    ProtocolChunk(
        metadata=ChunkMetadata(
            chunk_id       = "WHO_BEC_bleeding_both_warning_01",
            condition      = "severe_bleeding",
            condition_tags = ["bleeding warning", "embedded object", "internal bleeding", "tourniquet warning"],
            urgency_level  = 5,
            age_group      = "both",
            language       = "en",
            source         = "WHO_BEC_2016",
            step_type      = "warning",
            section        = "Bleeding — Warnings",
            keywords       = ["tourniquet warning", "embedded object", "internal bleeding"],
        ),
        text=(
            "BLEEDING — CRITICAL WARNINGS:\n"
            "DO NOT remove an embedded object from a wound — "
            "stabilise it in place and apply pressure AROUND it.\n"
            "DO NOT remove a tourniquet once applied — "
            "removal can cause fatal sudden blood pressure drop.\n"
            "DO NOT apply tourniquet over a joint (knee or elbow).\n"
            "INTERNAL BLEEDING — suspect if: abdomen is hard or painful, "
            "blood from ears or nose without head injury, "
            "large bruising on abdomen or chest after trauma, "
            "person in shock (pale, cold, clammy, rapid weak pulse) with no visible wound. "
            "Action: lay flat, do NOT give food or water, immediate hospital, keep warm."
        ),
    ),

    # ══════════════════════════════════════════════════════════════════════
    # 3. UNCONSCIOUS / CARDIAC ARREST
    # ══════════════════════════════════════════════════════════════════════

    ProtocolChunk(
        metadata=ChunkMetadata(
            chunk_id       = "WHO_BEC_unconscious_adult_action_01",
            condition      = "unconscious",
            condition_tags = ["unresponsive", "collapsed", "not breathing", "no pulse",
                              "cardiac arrest", "CPR needed", "fainted", "coma"],
            urgency_level  = 5,
            age_group      = "adult",
            language       = "en",
            source         = "WHO_BEC_2016",
            step_type      = "action",
            section        = "Unresponsive Adult — Initial Management and CPR",
            keywords       = ["unconscious", "unresponsive", "CPR", "airway", "recovery position"],
        ),
        text=(
            "UNCONSCIOUS ADULT — STEP-BY-STEP:\n"
            "Step 1 — CHECK RESPONSE: tap shoulders firmly, shout \'Are you okay?\'\n"
            "Step 2 — If no response: SHOUT FOR HELP. Call 102 immediately.\n"
            "Step 3 — OPEN AIRWAY: tilt head back gently, lift chin up.\n"
            "Step 4 — CHECK BREATHING: look, listen, feel for up to 10 seconds.\n\n"
            "IF NOT BREATHING (or only gasping):\n"
            "Begin CPR immediately:\n"
            "• Place heel of hand on centre of chest (lower half of breastbone).\n"
            "• Place second hand on top. Keep arms straight.\n"
            "• Push down 5–6 cm. Release fully. 30 compressions at 100–120 per minute.\n"
            "• Give 2 rescue breaths: seal mouth, one breath until chest rises. "
            "If untrained or unwilling — do COMPRESSIONS ONLY at 100–120 per minute.\n"
            "• Continue 30:2 cycle until help arrives, person wakes, or you are too exhausted.\n\n"
            "IF BREATHING but unconscious:\n"
            "RECOVERY POSITION: roll onto side, top knee bent forward, "
            "head tilted back to keep airway open. Monitor breathing continuously."
        ),
    ),

    ProtocolChunk(
        metadata=ChunkMetadata(
            chunk_id       = "WHO_BEC_unconscious_paediatric_action_01",
            condition      = "unconscious",
            condition_tags = ["child CPR", "infant CPR", "paediatric cardiac arrest", "child not breathing"],
            urgency_level  = 5,
            age_group      = "paediatric",
            language       = "en",
            source         = "WHO_BEC_2016",
            step_type      = "action",
            section        = "Unresponsive Child / Infant — CPR",
            keywords       = ["child CPR", "infant CPR", "paediatric", "not breathing", "two fingers"],
        ),
        text=(
            "CPR — CHILD (1 year to puberty):\n"
            "• 5 initial rescue breaths before starting compressions.\n"
            "• 30 compressions: one or two hands, push down one-third of chest depth.\n"
            "• 2 rescue breaths. Continue 30:2.\n"
            "• Rate: 100–120 per minute.\n\n"
            "CPR — INFANT (under 1 year):\n"
            "• 5 initial rescue breaths.\n"
            "• 30 compressions: two fingers on centre of chest, just below nipple line. "
            "Push down one-third of chest depth (~4 cm).\n"
            "• 2 gentle rescue breaths covering both mouth AND nose.\n"
            "• Rate: 100–120 per minute.\n\n"
            "KEY DIFFERENCE from adult CPR: children are more likely to have a breathing cause "
            "for arrest — give the 5 initial breaths before compressions."
        ),
    ),

    # ══════════════════════════════════════════════════════════════════════
    # 4. SNAKEBITE (Nepal-specific)
    # ══════════════════════════════════════════════════════════════════════

    ProtocolChunk(
        metadata=ChunkMetadata(
            chunk_id       = "MoHP_snakebite_both_action_01",
            condition      = "snakebite",
            condition_tags = ["snake bite", "venomous", "krait", "cobra", "viper",
                              "Russell viper", "saanp", "saap tokeko", "snake venom"],
            urgency_level  = 5,
            age_group      = "both",
            language       = "en",
            source         = "Nepal_MoHP_2078",
            step_type      = "action",
            section        = "Snakebite — Immediate First Aid",
            keywords       = ["snakebite", "snake", "venom", "antivenom", "immobilise"],
        ),
        text=(
            "SNAKEBITE — IMMEDIATE FIRST AID (Nepal MoHP):\n"
            "Step 1 — Move person away from snake. Do NOT attempt to catch or kill the snake.\n"
            "Step 2 — Keep person CALM and as STILL as possible. "
            "Movement increases blood flow and spreads venom faster.\n"
            "Step 3 — Immobilise the bitten limb as if it were a fracture. "
            "Splint if available. Keep limb BELOW the level of the heart.\n"
            "Step 4 — Remove rings, watches, bracelets, and tight clothing from the bitten limb "
            "BEFORE swelling starts.\n"
            "Step 5 — Mark the leading edge of any swelling with a pen. Write the time. "
            "Repeat every 15 minutes — this helps doctors track progression.\n"
            "Step 6 — Note the EXACT TIME of the bite — critical for antivenom dosing.\n"
            "Step 7 — TRANSPORT IMMEDIATELY to hospital with antivenom capability. "
            "In Nepal: Bir Hospital (Kathmandu), BP Koirala Institute (Dharan), "
            "Bheri Hospital (Nepalgunj), provincial hospitals.\n"
            "ANTIVENOM is the ONLY definitive treatment. First aid ONLY buys time."
        ),
    ),

    ProtocolChunk(
        metadata=ChunkMetadata(
            chunk_id       = "MoHP_snakebite_both_warning_01",
            condition      = "snakebite",
            condition_tags = ["snakebite do not", "tourniquet snake", "cut wound", "suck venom"],
            urgency_level  = 5,
            age_group      = "both",
            language       = "en",
            source         = "Nepal_MoHP_2078",
            step_type      = "warning",
            section        = "Snakebite — Critical Don'ts",
            keywords       = ["snakebite warning", "do not cut", "do not suck", "no tourniquet"],
        ),
        text=(
            "SNAKEBITE — CRITICAL WARNINGS (traditional remedies that KILL):\n"
            "DO NOT cut or incise the bite wound.\n"
            "DO NOT suck out venom — by mouth or any device.\n"
            "DO NOT apply a tourniquet or tight bandage — causes tissue death and limb loss.\n"
            "DO NOT apply ice, cold water, or heat to the wound.\n"
            "DO NOT apply electric shock.\n"
            "DO NOT apply herbs, traditional medicine, or any substance to the wound.\n"
            "DO NOT give alcohol in any form.\n"
            "DO NOT give Aspirin or Ibuprofen — "
            "these increase bleeding in haemotoxic envenomation (Russell\'s viper, common in Nepal).\n"
            "Paracetamol for pain is acceptable IF person is fully conscious and can swallow safely."
        ),
    ),

    ProtocolChunk(
        metadata=ChunkMetadata(
            chunk_id       = "MoHP_snakebite_both_assessment_01",
            condition      = "snakebite",
            condition_tags = ["snakebite symptoms", "venom signs", "neurotoxic", "haemotoxic", "local swelling"],
            urgency_level  = 5,
            age_group      = "both",
            language       = "en",
            source         = "Nepal_MoHP_2078",
            step_type      = "assessment",
            section        = "Snakebite — Envenomation Signs",
            keywords       = ["snakebite symptoms", "neurotoxic", "haemotoxic", "ptosis", "swelling"],
        ),
        text=(
            "SNAKEBITE — SIGNS OF SERIOUS ENVENOMATION (seek hospital URGENTLY):\n\n"
            "LOCAL SIGNS (any snake):\n"
            "• Rapid and spreading swelling beyond the bite site\n"
            "• Intense pain and redness spreading up the limb\n"
            "• Blistering or tissue breakdown at bite site\n\n"
            "SYSTEMIC SIGNS — NEUROTOXIC (krait, cobra):\n"
            "• Drooping eyelids (ptosis) — earliest sign\n"
            "• Double vision, difficulty swallowing, slurred speech\n"
            "• Weakness spreading to arms and legs\n"
            "• Difficulty breathing — LIFE-THREATENING\n\n"
            "SYSTEMIC SIGNS — HAEMOTOXIC (Russell\'s viper — most common fatal snake in Nepal):\n"
            "• Bleeding from gums, injection sites, or old wounds\n"
            "• Blood in urine (dark/brown urine)\n"
            "• Swollen and tender lymph nodes\n"
            "• Low blood pressure, rapid weak pulse\n\n"
            "ANY of the above = EMERGENCY. Hospital within 1 hour if possible."
        ),
    ),

    # ══════════════════════════════════════════════════════════════════════
    # 5. CHEST PAIN / SUSPECTED HEART ATTACK
    # ══════════════════════════════════════════════════════════════════════

    ProtocolChunk(
        metadata=ChunkMetadata(
            chunk_id       = "WHO_BEC_chest_pain_adult_assessment_01",
            condition      = "chest_pain",
            condition_tags = ["heart attack", "cardiac", "myocardial infarction",
                              "crushing chest", "jaw pain", "arm pain", "angina"],
            urgency_level  = 5,
            age_group      = "adult",
            language       = "en",
            source         = "WHO_BEC_2016",
            step_type      = "assessment",
            section        = "Chest Pain — Recognition of Cardiac Emergency",
            keywords       = ["chest pain", "heart attack", "cardiac", "crushing", "radiating"],
        ),
        text=(
            "CHEST PAIN — RECOGNISING A HEART ATTACK:\n"
            "Classic signs:\n"
            "• Crushing, squeezing, heavy pressure, or tightness in the chest\n"
            "• Pain SPREADING to left arm, jaw, neck, back, or stomach\n"
            "• Sweating (cold, clammy sweat) without exertion\n"
            "• Nausea or vomiting\n"
            "• Shortness of breath\n"
            "• Pale or grey skin\n"
            "• Sense of doom or extreme anxiety\n\n"
            "ATYPICAL SIGNS (more common in women, elderly, diabetics):\n"
            "• Indigestion-like discomfort or stomach pain\n"
            "• Unusual fatigue\n"
            "• No chest pain — only breathlessness and sweating\n\n"
            "If ANY combination of the above: treat as heart attack. Do not wait to see if it improves."
        ),
    ),

    ProtocolChunk(
        metadata=ChunkMetadata(
            chunk_id       = "WHO_BEC_chest_pain_adult_action_01",
            condition      = "chest_pain",
            condition_tags = ["heart attack treatment", "aspirin cardiac", "nitrate", "cardiac first aid"],
            urgency_level  = 5,
            age_group      = "adult",
            language       = "en",
            source         = "WHO_BEC_2016",
            step_type      = "action",
            section        = "Chest Pain — First Aid Treatment",
            keywords       = ["chest pain", "aspirin", "cardiac first aid", "heart attack treatment"],
        ),
        text=(
            "CHEST PAIN — SUSPECTED HEART ATTACK FIRST AID:\n"
            "Step 1 — STOP activity. Sit person down in the most comfortable position "
            "(usually half-sitting, knees bent). Do NOT allow them to walk.\n"
            "Step 2 — Loosen tight clothing around neck and chest.\n"
            "Step 3 — CALL 102 IMMEDIATELY. Say \'I think this person is having a heart attack.\' "
            "State your location clearly.\n"
            "Step 4 — ASPIRIN: if the person is conscious, NOT allergic to aspirin, "
            "and can swallow — give 300 mg Aspirin. "
            "Ask them to CHEW it slowly, not swallow whole.\n"
            "Step 5 — If person has doctor-prescribed nitrate spray (Sorbitrate/GTN): "
            "help them use it as prescribed.\n"
            "Step 6 — Stay with them. Reassure them calmly. Keep monitoring.\n"
            "Step 7 — If they lose consciousness and stop normal breathing: begin CPR immediately."
        ),
    ),

    # ══════════════════════════════════════════════════════════════════════
    # 6. BURNS
    # ══════════════════════════════════════════════════════════════════════

    ProtocolChunk(
        metadata=ChunkMetadata(
            chunk_id       = "WHO_BEC_burns_both_action_01",
            condition      = "burns",
            condition_tags = ["burn", "scald", "fire", "hot water", "boiling", "chemical burn", "electrical burn"],
            urgency_level  = 4,
            age_group      = "both",
            language       = "en",
            source         = "WHO_BEC_2016",
            step_type      = "action",
            section        = "Burns — First Aid",
            keywords       = ["burn", "scald", "cool water", "blister", "burn dressing"],
        ),
        text=(
            "BURNS — FIRST AID (4 Cs):\n\n"
            "1. COOL:\n"
            "• Run COOL (not ice cold) running water over the burn for 20 MINUTES.\n"
            "• Start within 3 hours of injury — still effective.\n"
            "• Do NOT use ice or ice water — causes additional cold injury.\n"
            "• For chemical burns: brush off any dry chemical FIRST, then irrigate with water for 20+ minutes.\n"
            "• For electrical burns: DO NOT TOUCH person — disconnect power first, or use non-conducting object.\n\n"
            "2. CALL (when to get emergency help):\n"
            "Call emergency or go to hospital immediately if:\n"
            "• Burn larger than the person\'s palm\n"
            "• Burn on face, hands, feet, genitals, or over a joint\n"
            "• Any burn in a child or elderly person\n"
            "• Full-thickness burn: white, brown, or black skin; dry, leathery, painless at site\n"
            "• Electrical or chemical burn (always hospital)\n"
            "• Any burn with breathing difficulty (inhalation injury)\n\n"
            "3. COVER:\n"
            "• Use clean cling film (best), clean plastic bag, or non-fluffy cloth.\n"
            "• Do NOT use cotton wool, towels, or fluffy material — fibres stick to wound.\n\n"
            "4. COMFORT:\n"
            "• Paracetamol for pain. Keep person warm (burns cause heat loss)."
        ),
    ),

    ProtocolChunk(
        metadata=ChunkMetadata(
            chunk_id       = "WHO_BEC_burns_both_warning_01",
            condition      = "burns",
            condition_tags = ["burn warning", "butter burn", "toothpaste burn", "blister pop"],
            urgency_level  = 4,
            age_group      = "both",
            language       = "en",
            source         = "WHO_BEC_2016",
            step_type      = "warning",
            section        = "Burns — Critical Warnings",
            keywords       = ["burn warning", "butter", "toothpaste", "ice burn", "blister"],
        ),
        text=(
            "BURNS — CRITICAL WARNINGS:\n"
            "DO NOT apply butter, ghee, mustard oil, coconut oil, or any oil — "
            "traps heat and causes severe infection.\n"
            "DO NOT apply toothpaste — causes infection and pain.\n"
            "DO NOT apply egg white, raw potato, or any traditional remedy.\n"
            "DO NOT pop or break blisters — blisters are the body\'s sterile protective barrier.\n"
            "DO NOT remove clothing stuck to burned skin — cut clothing around the stuck area.\n"
            "DO NOT use ice or ice water — causes ice burns on top of heat burns.\n"
            "DO NOT cover with cotton wool, towels, or fluffy bandages — fibres stick to raw wound."
        ),
    ),

    # ══════════════════════════════════════════════════════════════════════
    # 7. STROKE
    # ══════════════════════════════════════════════════════════════════════

    ProtocolChunk(
        metadata=ChunkMetadata(
            chunk_id       = "WHO_BEC_stroke_adult_assessment_01",
            condition      = "stroke",
            condition_tags = ["stroke FAST", "facial droop", "arm weakness", "speech slurred",
                              "brain attack", "sudden confusion", "sudden headache", "paralysis"],
            urgency_level  = 5,
            age_group      = "adult",
            language       = "en",
            source         = "WHO_BEC_2016",
            step_type      = "assessment",
            section        = "Stroke — FAST Recognition",
            keywords       = ["stroke", "FAST", "facial droop", "arm weakness", "speech"],
        ),
        text=(
            "STROKE — RECOGNITION (FAST Test):\n\n"
            "F — FACE: Ask person to SMILE. "
            "Does one side of the face droop? Is the smile uneven?\n\n"
            "A — ARMS: Ask person to RAISE BOTH ARMS. "
            "Does one arm drift downward or feel weak?\n\n"
            "S — SPEECH: Ask person to repeat a simple sentence. "
            "Is speech slurred, jumbled, or impossible?\n\n"
            "T — TIME: If ANY of the above is present — "
            "this is a STROKE. TIME IS BRAIN. Call emergency immediately.\n\n"
            "Additional warning signs:\n"
            "• Sudden severe headache with no known cause (\'worst headache of my life\')\n"
            "• Sudden vision loss in one or both eyes\n"
            "• Sudden loss of balance or coordination\n"
            "• Sudden numbness on one side of face, arm, or leg\n\n"
            "IMPORTANT: Symptoms that come and go (TIA / mini-stroke) are also emergencies — "
            "they often precede a major stroke within hours."
        ),
    ),

    ProtocolChunk(
        metadata=ChunkMetadata(
            chunk_id       = "WHO_BEC_stroke_adult_action_01",
            condition      = "stroke",
            condition_tags = ["stroke first aid", "brain attack treatment", "stroke management"],
            urgency_level  = 5,
            age_group      = "adult",
            language       = "en",
            source         = "WHO_BEC_2016",
            step_type      = "action",
            section        = "Stroke — First Aid",
            keywords       = ["stroke", "time is brain", "recovery position stroke", "no food stroke"],
        ),
        text=(
            "STROKE — FIRST AID:\n"
            "Step 1 — CALL 102 IMMEDIATELY. "
            "State the time symptoms started — this is critical for hospital thrombolysis decision.\n"
            "Step 2 — Note the EXACT time symptoms began and tell the hospital.\n"
            "Step 3 — If conscious: sit or lay person in comfortable position. "
            "Support head and shoulders slightly raised.\n"
            "Step 4 — If unconscious but breathing: RECOVERY POSITION (on their side).\n"
            "Step 5 — DO NOT give food, water, or any medication — "
            "stroke affects swallowing and they may choke.\n"
            "Step 6 — Do NOT leave person alone under any circumstances.\n"
            "Step 7 — Keep them calm and reassured. Loosen tight clothing.\n"
            "Step 8 — If they stop breathing: begin CPR.\n\n"
            "TIME IS BRAIN: Every 1 minute without treatment = 1.9 million brain cells lost. "
            "The clot-busting drug (tPA) must be given within 4.5 hours of symptom onset."
        ),
    ),

    # ══════════════════════════════════════════════════════════════════════
    # 8. ALTITUDE SICKNESS (Nepal-specific)
    # ══════════════════════════════════════════════════════════════════════

    ProtocolChunk(
        metadata=ChunkMetadata(
            chunk_id       = "MoHP_altitude_both_assessment_01",
            condition      = "altitude_sickness",
            condition_tags = ["AMS", "acute mountain sickness", "HACE", "HAPE",
                              "high altitude", "trekking", "Everest", "headache altitude", "Lake Louise"],
            urgency_level  = 4,
            age_group      = "both",
            language       = "en",
            source         = "Nepal_MoHP_2078",
            step_type      = "assessment",
            section        = "Altitude Sickness — Grading and Recognition",
            keywords       = ["altitude", "AMS", "HACE", "HAPE", "headache altitude", "ataxia"],
        ),
        text=(
            "ALTITUDE SICKNESS — RECOGNITION AND GRADING:\n\n"
            "MILD AMS (Lake Louise Score ≥3):\n"
            "• Headache (the defining symptom)\n"
            "• Fatigue, weakness\n"
            "• Dizziness\n"
            "• Nausea, loss of appetite\n"
            "• Poor sleep\n"
            "Onset: typically 6–12 hours after arriving at new altitude.\n\n"
            "SEVERE AMS / HACE (High Altitude Cerebral Oedema):\n"
            "• Severe headache not relieved by paracetamol\n"
            "• Confusion, disorientation, irrational behaviour\n"
            "• Ataxia (cannot walk in a straight line — \'walk the line test\')\n"
            "• Extreme fatigue\n"
            "• Drowsiness progressing to unconsciousness — LIFE-THREATENING\n\n"
            "HAPE (High Altitude Pulmonary Oedema):\n"
            "• Breathlessness at rest (not just on exertion)\n"
            "• Dry cough progressing to cough with pink frothy sputum\n"
            "• Cannot complete sentences without gasping\n"
            "• Blue lips or fingernails (cyanosis) — IMMEDIATELY LIFE-THREATENING\n\n"
            "Ataxia test: ask person to walk heel-to-toe in a straight line. "
            "Failure = HACE until proven otherwise. Descend NOW."
        ),
    ),

    ProtocolChunk(
        metadata=ChunkMetadata(
            chunk_id       = "MoHP_altitude_both_action_01",
            condition      = "altitude_sickness",
            condition_tags = ["AMS treatment", "HACE treatment", "HAPE treatment",
                              "descend altitude", "Diamox", "Gamow bag", "Dexamethasone altitude"],
            urgency_level  = 4,
            age_group      = "both",
            language       = "en",
            source         = "Nepal_MoHP_2078",
            step_type      = "action",
            section        = "Altitude Sickness — Treatment by Severity",
            keywords       = ["altitude", "descend", "Dexamethasone", "Nifedipine", "Gamow", "Diamox"],
        ),
        text=(
            "ALTITUDE SICKNESS — TREATMENT:\n\n"
            "MILD AMS:\n"
            "• STOP ascent. Rest at the SAME altitude for 24 hours.\n"
            "• Hydrate well (3–4 litres water per day).\n"
            "• Paracetamol 1g or Ibuprofen 400mg for headache.\n"
            "• Acetazolamide (Diamox) 250mg twice daily if available — speeds acclimatisation.\n"
            "• Do NOT ascend until COMPLETELY symptom-free.\n\n"
            "SEVERE AMS / HACE:\n"
            "• DESCEND IMMEDIATELY — minimum 500–1000 m. Do not wait for morning.\n"
            "• Dexamethasone 8 mg immediately (IM or oral), then 4 mg every 6 hours during descent.\n"
            "• Supplemental oxygen if available (2–4 L/min).\n"
            "• Gamow bag (portable hyperbaric chamber) if available — simulates descent.\n\n"
            "HAPE:\n"
            "• IMMEDIATE DESCENT — highest priority.\n"
            "• Oxygen 4–6 L/min.\n"
            "• Nifedipine 30 mg slow-release if available.\n"
            "• Gamow bag if descent not immediately possible.\n\n"
            "GOLDEN RULE: \'If in doubt, descend.\' Descent is the only definitive treatment."
        ),
    ),

    # ══════════════════════════════════════════════════════════════════════
    # 9. DROWNING
    # ══════════════════════════════════════════════════════════════════════

    ProtocolChunk(
        metadata=ChunkMetadata(
            chunk_id       = "WHO_BEC_drowning_both_action_01",
            condition      = "drowning",
            condition_tags = ["drowning", "near drowning", "water rescue", "submerged",
                              "pulled from water", "river", "swimming pool"],
            urgency_level  = 5,
            age_group      = "both",
            language       = "en",
            source         = "WHO_BEC_2016",
            step_type      = "action",
            section        = "Drowning — Rescue and Resuscitation",
            keywords       = ["drowning", "water", "rescue", "CPR", "secondary drowning"],
        ),
        text=(
            "DROWNING — RESCUE AND FIRST AID:\n"
            "Step 1 — SAFE RESCUE: Do NOT enter fast or deep water unless trained.\n"
            "• Throw: rope, clothing tied together, ring buoy, empty container.\n"
            "• Reach: extend arm, stick, towel, or belt from the bank.\n"
            "• Row: use a boat if available.\n"
            "• Go in water ONLY as last resort, and only in shallow/calm water.\n\n"
            "Step 2 — Once out of water: CHECK RESPONSE (tap and shout).\n"
            "Step 3 — If not breathing normally:\n"
            "• Give 5 INITIAL RESCUE BREATHS immediately (before compressions).\n"
            "• Drowning is a breathing emergency first — oxygen is the priority.\n"
            "• Then begin 30:2 CPR. Continue until help arrives.\n"
            "Step 4 — Do NOT waste time trying to drain water from lungs — it does not work.\n"
            "Step 5 — Even if person REVIVES: mandatory hospital assessment.\n"
            "• Secondary drowning: fluid in lungs can cause death 1–24 hours later.\n"
            "• Watch for: persistent cough, breathing difficulty, unusual tiredness after rescue.\n"
            "Step 6 — HYPOTHERMIA: remove wet clothing. Wrap in dry blanket. Keep warm."
        ),
    ),

    # ══════════════════════════════════════════════════════════════════════
    # 10. SHOCK
    # ══════════════════════════════════════════════════════════════════════

    ProtocolChunk(
        metadata=ChunkMetadata(
            chunk_id       = "WHO_BEC_shock_both_action_01",
            condition      = "shock",
            condition_tags = ["shock", "hypovolemic shock", "pale clammy", "rapid pulse",
                              "low blood pressure", "faint", "collapse after bleeding"],
            urgency_level  = 5,
            age_group      = "both",
            language       = "en",
            source         = "WHO_BEC_2016",
            step_type      = "action",
            section        = "Shock — Recognition and First Aid",
            keywords       = ["shock", "pale", "clammy", "rapid pulse", "lay flat", "legs raised"],
        ),
        text=(
            "SHOCK — RECOGNITION AND FIRST AID:\n\n"
            "RECOGNISE SHOCK:\n"
            "• Pale, cold, clammy skin\n"
            "• Rapid, weak pulse\n"
            "• Rapid shallow breathing\n"
            "• Confusion, restlessness, or unusual drowsiness\n"
            "• Nausea\n"
            "• Feeling faint or collapsing\n\n"
            "IMMEDIATE FIRST AID:\n"
            "Step 1 — Lay person FLAT on their back.\n"
            "Step 2 — Raise LEGS 30 cm above heart level (unless head, neck, spine, leg fracture, "
            "or breathing difficulty — then keep flat).\n"
            "Step 3 — Treat the CAUSE if visible (control bleeding with direct pressure).\n"
            "Step 4 — Keep WARM — cover with blanket.\n"
            "Step 5 — DO NOT give food or water.\n"
            "Step 6 — DO NOT leave person alone.\n"
            "Step 7 — Call 102 immediately. State \'person is in shock.\' Monitor breathing constantly."
        ),
    ),

    # ══════════════════════════════════════════════════════════════════════
    # 11. SEIZURE
    # ══════════════════════════════════════════════════════════════════════

    ProtocolChunk(
        metadata=ChunkMetadata(
            chunk_id       = "WHO_BEC_seizure_both_action_01",
            condition      = "seizure",
            condition_tags = ["seizure", "epilepsy", "convulsion", "fit", "shaking", "tonic clonic"],
            urgency_level  = 4,
            age_group      = "both",
            language       = "en",
            source         = "WHO_BEC_2016",
            step_type      = "action",
            section        = "Seizure — First Aid",
            keywords       = ["seizure", "convulsion", "epilepsy", "fit", "protect head"],
        ),
        text=(
            "SEIZURE — FIRST AID:\n"
            "Step 1 — PROTECT from injury: clear hard or sharp objects away. "
            "Cushion the head with something soft.\n"
            "Step 2 — TIME the seizure from when it starts.\n"
            "Step 3 — Do NOT restrain the person — you cannot stop a seizure by holding them.\n"
            "Step 4 — Do NOT put ANYTHING in their mouth — "
            "people cannot swallow their tongue. Objects cause broken teeth and injury.\n"
            "Step 5 — After convulsions stop: RECOVERY POSITION — roll onto side to protect airway.\n"
            "Step 6 — Stay and monitor. Most seizures stop within 2–3 minutes. Person will be confused.\n\n"
            "CALL EMERGENCY if:\n"
            "• Seizure lasts MORE than 5 minutes\n"
            "• Another seizure follows without regaining consciousness\n"
            "• Person does not wake up after seizure stops\n"
            "• Person is injured during seizure\n"
            "• Person is pregnant\n"
            "• First-ever seizure\n"
            "• Seizure in water"
        ),
    ),

]
