import { CognitiveDomain, LanguageCode } from '../types';

export interface LanguageMetadata {
  code: LanguageCode;
  nativeName: string;
  scriptName: string;
  region: string;
}

export const LANGUAGE_METADATA: Record<LanguageCode, LanguageMetadata> = {
  as: {
    code: 'as',
    nativeName: 'অসমীয়া',
    scriptName: 'অসমীয়া লিপি',
    region: 'অসম (Assam)',
  },
  mni: {
    code: 'mni',
    nativeName: 'মৈতৈলোন্ (ꯃꯤꯇꯩꯂꯣꯟ)',
    scriptName: 'মৈতৈ মায়েক / বেঙ্গলী লিপি',
    region: 'মণিপুৰ (Manipur)',
  },
  kha: {
    code: 'kha',
    nativeName: 'Ka Ktien Khasi',
    scriptName: 'Dak Khasi',
    region: 'Meghalaya',
  },
  lus: {
    code: 'lus',
    nativeName: 'Mizo ṭawng',
    scriptName: 'Mizo Hawrawp',
    region: 'Mizoram',
  },
  hi: {
    code: 'hi',
    nativeName: 'हिन्दी',
    scriptName: 'देवनागरी',
    region: 'भारत (India)',
  },
  en: {
    code: 'en',
    nativeName: 'English',
    scriptName: 'Latin',
    region: 'Global / Standard',
  },
};

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  mDonerHeader: string;
  teamTag: string;
  medicalDisclaimer: string;
  disclaimerAcknowledge: string;
  greetingMorning: string;
  greetingAfternoon: string;
  greetingEvening: string;
  todaysActivities: string;
  todaysReminders: string;
  moodCheckinTitle: string;
  moodCheckinSubtitle: string;
  sosEmergency: string;
  playGame: string;
  wellDone: string;
  tapToContinue: string;
  listenPrompt: string;
  speakingPrompt: string;
  voiceCommandHint: string;
  takeMedicinePrompt: string;
  iTookThis: string;
  confirmTaken: string;
  photoProofRequired: string;
  snapPhoto: string;
  photoConfirmed: string;
  sessionCapNotice: string;
  restWarmWater: string;
  returnHome: string;
  caregiverSignIn: string;
  signedInAs: string;
  caringFor: string;
  updateProfile: string;
  caregiverNameLabel: string;
  patientNameLabel: string;
  preferredNameLabel: string;
  relationLabel: string;
  phoneLabel: string;
  saveProfileSuccess: string;
  domainNames: Record<CognitiveDomain, string>;
  domainDescriptions: Record<CognitiveDomain, string>;
  moods: {
    level5: string;
    level5Sub: string;
    level4: string;
    level4Sub: string;
    level3: string;
    level3Sub: string;
    level2: string;
    level2Sub: string;
    level1: string;
    level1Sub: string;
  };
  games: {
    memoryTitle: string;
    memoryInstruction: string;
    memoryCardFlipped: string;
    memoryMatchFound: string;
    attentionTitle: string;
    attentionInstruction: string;
    attentionFound: string;
    routineTitle: string;
    routineInstruction: string;
    routineCorrectOrder: string;
    patternTitle: string;
    patternInstruction: string;
    patternMatched: string;
  };
}

export const TRANSLATIONS: Record<LanguageCode, TranslationDictionary> = {
  as: {
    appName: "স্মৃতিসঙ্গম",
    tagline: "স্মৃতিৰ মাজেৰে আত্মীয়তাৰ পুনৰ মিলন",
    mDonerHeader: "MDoNER উত্তৰ-পূব প্ৰকল্প SIH26003",
    teamTag: "দল: Runtime Terrors",
    medicalDisclaimer: "স্মৃতিসঙ্গম এটা দৈনন্দিন মানসিক উদ্দীপনা আৰু নিৰীক্ষণ সহায়ক এপ্লিকেচন। ই কোনো চিকিৎসা বা নিদান নহয়। গুৰুতৰ ডিমেনচিয়াৰ বাবে চিকিৎসকৰ পৰামৰ্শ লওক।",
    disclaimerAcknowledge: "মই বুজি পালোঁ, আগবাঢ়ক",
    greetingMorning: "সুপ্ৰভাত",
    greetingAfternoon: "শুভ অপৰাহ্ন",
    greetingEvening: "শুভ সন্ধ্যা",
    todaysActivities: "আজিৰ মানসিক খেল আৰু কাৰ্যসূচী",
    todaysReminders: "আজিৰ ঔষধ আৰু যত্নৰ সোঁৱৰণী",
    moodCheckinTitle: "আজি আপোনাৰ মনটো কেনে লাগিছে?",
    moodCheckinSubtitle: "তলত থকা মুখবোৰৰ পৰা এটা বাচি লওক।",
    sosEmergency: "জৰুৰী সহায় (SOS)",
    playGame: "খেলিবলৈ টিপক",
    wellDone: "বৰ সুন্দৰ! আপুনি বৰ ভাল কৰিলে!",
    tapToContinue: "আগলৈ যাবলৈ টিপক",
    listenPrompt: "মন দি শুনক",
    speakingPrompt: "কৈ থকা হৈছে...",
    voiceCommandHint: "আপুনি মাত মাতি ক’ব পাৰে যেনে 'খেলিম', 'ঔষধ খালোঁ'",
    takeMedicinePrompt: "এই ঔষধ খোৱাৰ সময় হ’ল",
    iTookThis: "মই ঔষধ খালোঁ",
    confirmTaken: "খোৱা নিশ্চিত কৰক",
    photoProofRequired: "ঔষধৰ পেকেটৰ ছবি তোলক",
    snapPhoto: "ছবি তোলক",
    photoConfirmed: "ছবি সংৰক্ষিত হ’ল",
    sessionCapNotice: "আজিৰ বাবে খেল সমাপ্ত হ’ল!",
    restWarmWater: "আপোনাৰ মনটো শান্ত কৰক। অলপ জিৰণি লওক আৰু এগিলাচ কুহুমীয়া পানী খাওক।",
    returnHome: "মূল পৃষ্ঠালৈ যাওক",
    caregiverSignIn: "অভিভাৱক / আশা কৰ্মী প্ৰৱেশ",
    signedInAs: "প্ৰৱেশ কৰা হৈছে:",
    caringFor: "যত্ন লোৱা ব্যক্তি:",
    updateProfile: "পৰিচয় আৰু নাম সলনি কৰক",
    caregiverNameLabel: "আপোনাৰ নিজৰ নাম (অভিভাৱক)",
    patientNameLabel: "বয়োজ্যেষ্ঠ ব্যক্তিৰ নাম",
    preferredNameLabel: "মতা নাম (যেনে আইতা, দেউতা, মা)",
    relationLabel: "সম্পৰ্ক (যেনে পুত্ৰ, জীয়ৰী, আশা কৰ্মী)",
    phoneLabel: "ফোন নম্বৰ",
    saveProfileSuccess: "নাম আৰু পৰিচয় সফলভাৱে সংৰক্ষিত হ’ল!",
    domainNames: {
      memory: "স্মৃতি শক্তি",
      attention: "মনোযোগ আৰু লক্ষ্য",
      routine: "দৈনন্দিন কামৰ ক্ৰম",
      pattern: "ঐতিহ্য চিনাক্তকৰণ"
    },
    domainDescriptions: {
      memory: "অসমীয়া পৰম্পৰাগত সামগ্ৰীৰ মিল বিচাৰক",
      attention: "চাহ বাগিচাত সুকীয়া পাত বিচাৰক",
      routine: "চাহ বনোৱাৰ সঠিক নিয়মবোৰ সজাওক",
      pattern: "কাজিৰঙা আৰু অসমৰ গৌৰৱ চিনাক্ত কৰক"
    },
    moods: {
      level5: "অতি আনন্দিত আৰু শান্ত",
      level5Sub: "মনটো বৰ ভাল লাগিছে",
      level4: "ভালে আছোঁ",
      level4Sub: "মনটো স্থিৰ আৰু শান্ত",
      level3: "সাধাৰণ",
      level3Sub: "স্বাভাৱিক অৱস্থা",
      level2: "অলপ ভাগৰুৱা",
      level2Sub: "জিৰণিৰ প্ৰয়োজন",
      level1: "মন বেয়া আৰু অশান্ত",
      level1Sub: "সহায় আৰু মৰমৰ প্ৰয়োজন"
    },
    games: {
      memoryTitle: "স্মৃতিৰ যোৰ মিলোৱা খেল",
      memoryInstruction: "দুটাকৈ একে ছবি বিচাৰি উলিয়াওক। কাৰ্ডখনত টিপক।",
      memoryCardFlipped: "ছবিখন চোৱা হ’ল",
      memoryMatchFound: "যোৰ মিলি গ’ল! সুন্দৰ!",
      attentionTitle: "মনোযোগ: সুকীয়াটো বাচক",
      attentionInstruction: "দলৰ ভিতৰত যিটো সুকীয়া বা উজ্জ্বল, সেইটোত টিপক।",
      attentionFound: "সঠিক উত্তৰ! আপুনি বিচাৰি পালে!",
      routineTitle: "দৈনন্দিন কামৰ ক্ৰম",
      routineInstruction: "প্ৰথম কি কৰিব, তাৰ পিছত কি কৰিব - ক্ৰমত লগাওক।",
      routineCorrectOrder: "সকলো কাম সঠিক ক্ৰমত সম্পন্ন হ’ল!",
      patternTitle: "আমাৰ উত্তৰ-পূবৰ চিন",
      patternInstruction: "ছাঁটোৰ লগত সঠিক ছবিখন মিলাওক।",
      patternMatched: "বাঃ! ঐতিহ্যৰ সঠিক চিনাক্তকৰণ!"
    }
  },
  mni: {
    appName: "স্মৃতিসঙ্গম",
    tagline: "নিংশিংবগী খোঙচৎতা অমত্তা ওইনা",
    mDonerHeader: "MDoNER অৱাং-নোংপোক প্ৰজেক্ট SIH26003",
    teamTag: "Team: Runtime Terrors",
    medicalDisclaimer: "স্মৃতিসঙ্গম অসিনা মীয়ামগী ৱাখল হকশেল নিংশিংনবগী তেংবাং পাম্বৈনি। মসিনা লাইয়েং নত্তে। হকশেলগীদমক দাক্তরদা তন্নবিয়ু।",
    disclaimerAcknowledge: "ঐহাক্না খঙলে, মাংদা চৎসি",
    greetingMorning: "খুরুমজরি",
    greetingAfternoon: "নুমিদাংৱায়েলগী খুরুমজরি",
    greetingEvening: "নুমিদাংগী খুরুমজরি",
    todaysActivities: "ঙসিগী ৱাখলগী শান্ন-খোৎনবশিং",
    todaysReminders: "হিদাক-লাংথক নিংশিংহল্লকপা",
    moodCheckinTitle: "ঙসি অদোমগী পুন্সিদা কমদৌরি?",
    moodCheckinSubtitle: "মখাগী শক্তমশিংসিদা অমুক্তা নাম্বিয়ু।",
    sosEmergency: "অকিপা / মদৎ (SOS)",
    playGame: "শান্নবা হৌসি",
    wellDone: "য়াম্না ফরে! থোইদোক্না ফরে!",
    tapToContinue: "মাংলোয়দা চৎনবা নাম্বিয়ু",
    listenPrompt: "মপুং ফানা তাবিয়ু",
    speakingPrompt: "ঙাংলি...",
    voiceCommandHint: "'শান্নসি', 'হিদাক চারে' হায়না ঙাংবিয়ু",
    takeMedicinePrompt: "হিদাক চাবগী মতম ওইরে",
    iTookThis: "ঐহাক হিদাক চারে",
    confirmTaken: "চারে হায়না লেপ্নবা",
    photoProofRequired: "হিদাক্কী ফোতো লৌবিয়ু",
    snapPhoto: "ফোতো লৌবা",
    photoConfirmed: "ফোতো পুখৎলে",
    sessionCapNotice: "ঙসিগী শান্নবা লোইরে!",
    restWarmWater: "ঈশিং পুংফম অমা থক্লগা পোথারবিয়ু।",
    returnHome: "অহানবা মায়মাইদা হল্লসি",
    caregiverSignIn: "কেয়রগিভর / আশা মিয়মগী প্ৰৱেশ",
    signedInAs: "চঙশিনখ্রবা মীওই:",
    caringFor: "য়েনশিল্লিবা অহল:",
    updateProfile: "প্ৰোফাইল অমসুং মিং শেমদোকপা",
    caregiverNameLabel: "অদোমগী মশাগী মিং (অভিভাবক)",
    patientNameLabel: "অহলগী মিং",
    preferredNameLabel: "কৌনবা মিং (ইমা, ইবুধৌ, পাজৌ)",
    relationLabel: "মরীয়োল (মচানুপা, মচানুপী, আশা কৰ্মী)",
    phoneLabel: "ফোন নম্বৰ",
    saveProfileSuccess: "মিং অমসুং শক্তম মপুং ফানা থম্লে!",
    domainNames: {
      memory: "নিংশিংবা শক্তি",
      attention: "মিৎয়েং চিংশিনবা",
      routine: "নোংমগী থবকশিংগী পরিং",
      pattern: "পোৎলম অমসুং মশক খঙদোকপা"
    },
    domainDescriptions: {
      memory: "মণিপুরী নাৎকী পোৎলমশিংগী য়োর চাংয়েং",
      attention: "তোঙানবা পোৎলম খঙদোকপা",
      routine: "চা শাবা অমসুং লৈকোই চৎপগী পরিং",
      pattern: "লোকতাক অমসুং নাৎকী শক্তমশিং"
    },
    moods: {
      level5: "য়াম্না হরাওবা অমসুং তন্থাবা",
      level5Sub: "নুংঙাইবা ফাওরি",
      level4: "ফবা",
      level4Sub: "তন্থাবা অমসুং শান্তি",
      level3: "চাপ চাবা",
      level3Sub: "পুকচেল শান্তিব্বা",
      level2: "থোইদোক্না ৱাবা",
      level2Sub: "পোথাবগী মতম ওইরে",
      level1: "নুংঙাইতবা",
      level1Sub: "তেংবাং অমসুং মীনুংশি মথৌ তাই"
    },
    games: {
      memoryTitle: "য়োর চাংয়েং শান্নবা",
      memoryInstruction: "মান্নবা ফোতো অনি খল্লু।",
      memoryCardFlipped: "ফোতো য়েংলে",
      memoryMatchFound: "মান্নরে! য়াম্না ফরে!",
      attentionTitle: "তোঙানবা পোৎলম থিবগী শান্নবা",
      attentionInstruction: "অতোইবা কাংলূপতগী তোঙানবা অদু নাম্বিয়ু।",
      attentionFound: "চুম্লে! অদোম্না ফংলে!",
      routineTitle: "নোংমগী থবকশিংগী পরিং",
      routineInstruction: "অহানবা অমসুং কোন্না তৌগদবা পরিং শেম্মু।",
      routineCorrectOrder: "থবক পুম্নমক চপ চানা শেম্লে!",
      patternTitle: "ঐখোয়গী ইনাৎকী শক্তম",
      patternInstruction: "মমীগা মান্নবা অচুম্বা শক্তম খল্লু।",
      patternMatched: "য়াম্না চুম্লে!"
    }
  },
  kha: {
    appName: "SmrithiSangam",
    tagline: "Ka jingiasoh lyngba ki jingkynmaw",
    mDonerHeader: "MDoNER North East Project SIH26003",
    teamTag: "Team: Runtime Terrors",
    medicalDisclaimer: "Ka SmrithiSangam ka dei tang ka lad jingïarap ban pyrkhat bad bishar. Kam dei ka dawai ne jingsumar doctor. Lada don jingshitom palat, khot ia u doctor.",
    disclaimerAcknowledge: "Nga sngewthuh, bteng",
    greetingMorning: "Khublei Shibun",
    greetingAfternoon: "Khublei Kynthei/Shngi",
    greetingEvening: "Khublei Janmiet",
    todaysActivities: "Ki Jingialehkai Jingmut Mynta Ka Sngi",
    todaysReminders: "Ki Jingkynmaw Dawai & Jingbam",
    moodCheckinTitle: "Kumno phi sngew mynta ka sngi?",
    moodCheckinSubtitle: "Khyllie ia ka dur khmat kaba iasyriem bad ka jingmut jong phi.",
    sosEmergency: "Jingïarap Kyrkieh (SOS)",
    playGame: "Khyllie ban ïalehkai",
    wellDone: "Shibun ki jingiaroh! Phi la leh bha!",
    tapToContinue: "Khyllie ban bteng",
    listenPrompt: "Sngap bha",
    speakingPrompt: "Dang kren...",
    voiceCommandHint: "Kren 'Ialehkai' lane 'Nga la bam dawai'",
    takeMedicinePrompt: "Ka por ban dih dawai ka la poi",
    iTookThis: "Nga la dih ia kane",
    confirmTaken: "Pynskhem ba la dih",
    photoProofRequired: "Shon dur ia ka kot dawai",
    snapPhoto: "Shon dur",
    photoConfirmed: "La pynskhem ka dur",
    sessionCapNotice: "Ka jingialehkai mynta ka sngi la kut!",
    restWarmWater: "Shongthait shwa bad dih da ka um ba shit.",
    returnHome: "Phai sha khmat",
    caregiverSignIn: "Ka Jingrung Caregiver / ASHA",
    signedInAs: "La rung kum:",
    caringFor: "Sumar ia:",
    updateProfile: "Pynkylla Kyrteng & Jingbatai",
    caregiverNameLabel: "Kyrteng jong phi (Caregiver)",
    patientNameLabel: "Kyrteng u/ka tymmen",
    preferredNameLabel: "Kyrteng khot ieit (Mei, Pa, I Mei)",
    relationLabel: "Jingiasyriem (Khun, Kmie, ASHA)",
    phoneLabel: "Nombar Phone",
    saveProfileSuccess: "La pynskhem ia ki kyrteng bad jingtip!",
    domainNames: {
      memory: "Ka Bor Kynmaw",
      attention: "Ka Jingpynleit Jingmut",
      routine: "Ki Rukom Leh Sngi",
      pattern: "Jingshai Dur & Mar Khasi"
    },
    domainDescriptions: {
      memory: "Pynïasoh ia ki dur ba iasyriem",
      attention: "Shem ia ka dur ba pher",
      routine: "Buh ryntih ia ka rukom shet sha",
      pattern: "Ki jingkieng dieng bad ki mar riewlum"
    },
    moods: {
      level5: "Kmen Shibun bad Suk",
      level5Sub: "Sngewkmen ka mynsiem",
      level4: "Bha ka met bad jingmut",
      level4Sub: "Shngain bad suk",
      level3: "Kumjuh beit",
      level3Sub: "Jai jai ka mynsiem",
      level2: "Thait bad Tlot",
      level2Sub: "Donkam ban shongthait",
      level1: "Sngewsih bad Khuslai",
      level1Sub: "Donkam jingïarap"
    },
    games: {
      memoryTitle: "Pyniasyriem Dur",
      memoryInstruction: "Shem ar tylli ki dur ba iasyriem.",
      memoryCardFlipped: "La plie ka dur",
      memoryMatchFound: "La ïasnoh bha!",
      attentionTitle: "Shem ia Kaba Pher",
      attentionInstruction: "Khyllie ia ka dur kaba pher na kiwei.",
      attentionFound: "Dei eh! Phi la shem!",
      routineTitle: "Buh Ryntih Jingtrei",
      routineInstruction: "Kaei kaba nyngkong, kaei kaba bud.",
      routineCorrectOrder: "Ryntih bha baroh!",
      patternTitle: "Dur Tynrai Ri Hynñiewtrep",
      patternInstruction: "Pynïasoh ia ka syrngiew bad ka dur bashisha.",
      patternMatched: "Bha palat!"
    }
  },
  lus: {
    appName: "SmrithiSangam",
    tagline: "Hriatrengna hmanga inzawmkhawmna",
    mDonerHeader: "MDoNER North East Project SIH26003",
    teamTag: "Team: Runtime Terrors",
    medicalDisclaimer: "SmrithiSangam hi thluak tiharh leh vilna atana puihna hmanraw pakhat a ni a, damdawi inenkawlna a ni lo. Doctor biak rawn fo tur a ni.",
    disclaimerAcknowledge: "Ka hrethiam e, kal zel rawh",
    greetingMorning: "Chibai zing chawhma",
    greetingAfternoon: "Chibai chhun",
    greetingEvening: "Chibai zanriah hma",
    todaysActivities: "Vawiin Thluak Sawizawina Game-te",
    todaysReminders: "Damdawi leh Ei In Hriatnawntirna",
    moodCheckinTitle: "Vawiin i rilru a nuam em?",
    moodCheckinSubtitle: "I rilru awm dan nena inmil ber hmet rawh le.",
    sosEmergency: "Ṭanpuina Rang (SOS)",
    playGame: "Khel turin hmet rawh",
    wellDone: "I ti ṭha lutuk e!",
    tapToContinue: "Kal zel nan hmet rawh",
    listenPrompt: "Ngaihthlak uluk tur",
    speakingPrompt: "Ṭawng mek a ni...",
    voiceCommandHint: "'Khel ang' emaw 'Damdawi ka ei tawh' tiin sawi rawh",
    takeMedicinePrompt: "Damdawi ei a hun ta",
    iTookThis: "Ka ei tawh e",
    confirmTaken: "Ei tawh nemngheh nan",
    photoProofRequired: "Damdawi kawr thla la rawh",
    snapPhoto: "Thla la rawh",
    photoConfirmed: "Thla lak a chiang e",
    sessionCapNotice: "Vawiin atan game khelh a tawk rih e!",
    restWarmWater: "Chawl hahdam la, tui lum in rawh le.",
    returnHome: "In lamah kir leh rawh",
    caregiverSignIn: "Enkawltu / ASHA Luhna",
    signedInAs: "Lut mek:",
    caringFor: "Enkawl mek:",
    updateProfile: "Hming leh Nihna Thlakna",
    caregiverNameLabel: "I hming ngei (Enkawltu)",
    patientNameLabel: "Pitar / Putar Hming",
    preferredNameLabel: "Khauna Hming (Ka Pi, Ka Pu, Nu)",
    relationLabel: "Inlaichinna (Fapa, Fanau, ASHA)",
    phoneLabel: "Phone Nombar",
    saveProfileSuccess: "I hming leh hriattirnate dah ṭhat a ni e!",
    domainNames: {
      memory: "Hriatrengna Chakna",
      attention: "Rilru Pekna",
      routine: "Ni tin Khawsak Indawt",
      pattern: "Thil Lem Hriat Hrangna"
    },
    domainDescriptions: {
      memory: "Mizo puan leh hmanraw inang zawn khawm",
      attention: "Thil danglam bik zawn chhuah",
      routine: "Thingpui lum leh zing kar hna indawt",
      pattern: "Zoram hmun pawimawh thla hriat chhuah"
    },
    moods: {
      level5: "Hlim em em leh Thlamuang",
      level5Sub: "Rilru a hahdam hle",
      level4: "Nuam tawk",
      level4Sub: "Thlamuang leh zangkhai",
      level3: "Pangngai",
      level3Sub: "Rilru a ngai reng e",
      level2: "Chauh deuh",
      level2Sub: "Chawlh hahdam a ngai",
      level1: "Lungngai leh Hah",
      level1Sub: "Puihna leh ngaihsak mamawh"
    },
    games: {
      memoryTitle: "Thil Inang Zawn Game",
      memoryInstruction: "Thil lem inang pahnih zawng chhuak rawh.",
      memoryCardFlipped: "Lem hawng tawh",
      memoryMatchFound: "A inmil chiah e! A va ṭha em!",
      attentionTitle: "A Danglam Bik Zawng Rawh",
      attentionInstruction: "A rual zing a danglam bik kha hmet rawh.",
      attentionFound: "I hmu fuh e!",
      routineTitle: "Ni Tin Hna Indawt Dan",
      routineInstruction: "A hmasa ber aṭanga a dawt zela thil tih dan rem rawh.",
      routineCorrectOrder: "A indawt dan a dik vek e!",
      patternTitle: "Kan Zoram Hriatpuina",
      patternInstruction: "Thil hlimthla leh a tak chiah zawm rawh.",
      patternMatched: "A dik thlap e!"
    }
  },
  hi: {
    appName: "स्मृतिसंगम",
    tagline: "स्मृतियों के माध्यम से आत्मीयता का संगम",
    mDonerHeader: "MDoNER पूर्वोत्तर परियोजना SIH26003",
    teamTag: "टीम: Runtime Terrors",
    medicalDisclaimer: "स्मृतिसंगम बुजुर्गों के लिए एक संज्ञानात्मक जुड़ाव और निगरानी सहायक उपकरण है। यह कोई चिकित्सीय निदान या उपचार नहीं है। हमेशा योग्य डॉक्टर से परामर्श लें।",
    disclaimerAcknowledge: "मैंने समझ लिया, आगे बढ़ें",
    greetingMorning: "सुप्रभात",
    greetingAfternoon: "शुभ दोपहर",
    greetingEvening: "शुभ संध्या",
    todaysActivities: "आज के मस्तिष्क खेल व अभ्यास",
    todaysReminders: "दवा और दिनचर्या अनुस्मारक",
    moodCheckinTitle: "आज आपका मन कैसा लग रहा है?",
    moodCheckinSubtitle: "अपनी मनोदशा के अनुसार उपयुक्त चेहरे पर स्पर्श करें।",
    sosEmergency: "आपातकालीन सहायता (SOS)",
    playGame: "खेलने के लिए दबाएं",
    wellDone: "बहुत खूब! आपने बहुत अच्छा किया!",
    tapToContinue: "आगे बढ़ने के लिए दबाएं",
    listenPrompt: "ध्यान से सुनें",
    speakingPrompt: "आवाज़ सुनाई दे रही है...",
    voiceCommandHint: "आप बोल सकते हैं: 'खेलें', 'दवा खा ली', 'मदद'",
    takeMedicinePrompt: "यह दवा लेने का सही समय है",
    iTookThis: "मैंने दवा ले ली है",
    confirmTaken: "पुष्टि करें",
    photoProofRequired: "दवा के पैकेट की तस्वीर लें",
    snapPhoto: "तस्वीर लें",
    photoConfirmed: "तस्वीर सुरक्षित हो गई",
    sessionCapNotice: "आज का अभ्यास पूरा हुआ!",
    restWarmWater: "अब थोड़ा विश्राम करें और एक गिलास गुनगुना पानी पिएं।",
    returnHome: "मुख्य पृष्ठ पर जाएं",
    caregiverSignIn: "देखभालकर्ता / आशा कार्यकर्ता प्रवेश",
    signedInAs: "लॉगिन किया गया:",
    caringFor: "बुजुर्ग:",
    updateProfile: "नाम व प्रोफ़ाइल संपादित करें",
    caregiverNameLabel: "आपका अपना वास्तविक नाम (देखभालकर्ता)",
    patientNameLabel: "बुजुर्ग प्रियजन का नाम",
    preferredNameLabel: "पुकारने का आत्मीय नाम (जैसे दादी, नानी, बाबूजी)",
    relationLabel: "रिश्ता (पुत्र, पुत्री, पोता, आशा दीदी)",
    phoneLabel: "फ़ोन नंबर",
    saveProfileSuccess: "प्रोफ़ाइल व नाम सफलतापूर्वक सहेजे गए!",
    domainNames: {
      memory: "स्मृति शक्ति",
      attention: "सजगता और ध्यान",
      routine: "दैनिक कार्य क्रम",
      pattern: "धरोहर व आकृति पहचान"
    },
    domainDescriptions: {
      memory: "पारंपरिक वस्तुओं के जोड़े पहचानें",
      attention: "समूह में से अलग वस्तु चुनें",
      routine: "पारंपरिक चाय और दैनिक कार्य का क्रम",
      pattern: "पूर्वोत्तर की धरोहर और आकृतियां"
    },
    moods: {
      level5: "अत्यंत प्रसन्न व शांत",
      level5Sub: "मन में शांति व उल्लास",
      level4: "अच्छा व सहज",
      level4Sub: "स्वस्थ व स्थिर मन",
      level3: "सामान्य",
      level3Sub: "शांत स्वभाव",
      level2: "थकान व असमंजस",
      level2Sub: "थोड़े विश्राम की जरूरत",
      level1: "बेचैन व उदास",
      level1Sub: "स्नेह व संबल की आवश्यकता"
    },
    games: {
      memoryTitle: "स्मृति जोड़ी मिलाओ",
      memoryInstruction: "दो एक जैसी तस्वीरें ढूंढें। कार्ड पर टैप करें।",
      memoryCardFlipped: "कार्ड खुला",
      memoryMatchFound: "जोड़ी मिल गई! बहुत बढ़िया!",
      attentionTitle: "सजगता: अलग वस्तु पहचानें",
      attentionInstruction: "जो तस्वीर बाकी सबसे अलग या चमकीली है, उसे चुनें।",
      attentionFound: "सही जवाब! आपने पहचान लिया!",
      routineTitle: "दैनिक कार्य क्रम",
      routineInstruction: "पहले क्या करेंगे, उसके बाद क्या करेंगे - क्रम में लगाएं।",
      routineCorrectOrder: "सभी कार्य सही क्रम में सज गए!",
      patternTitle: "धरोहर व आकृति मिलान",
      patternInstruction: "छाया के साथ सही असली तस्वीर का मिलान करें।",
      patternMatched: "बधाई! सही पहचान!"
    }
  },
  en: {
    appName: "SmrithiSangam",
    tagline: "Coming together through memories",
    mDonerHeader: "MDoNER North East Project SIH26003",
    teamTag: "Team: Runtime Terrors",
    medicalDisclaimer: "SmrithiSangam is a cognitive stimulation, engagement, and longitudinal monitoring support companion for elderly care. It is NOT a medical diagnostic or treatment device. Always consult a qualified physician for dementia diagnosis and therapy.",
    disclaimerAcknowledge: "I Understand & Agree",
    greetingMorning: "Good Morning",
    greetingAfternoon: "Good Afternoon",
    greetingEvening: "Good Evening",
    todaysActivities: "Today's Cognitive Routine",
    todaysReminders: "Scheduled Medication & Care",
    moodCheckinTitle: "How are you feeling today?",
    moodCheckinSubtitle: "Tap the face that best reflects your feelings right now.",
    sosEmergency: "Emergency Assistance (SOS)",
    playGame: "Tap to Start Exercise",
    wellDone: "Wonderful job! You did wonderfully!",
    tapToContinue: "Tap to Continue",
    listenPrompt: "Listen carefully",
    speakingPrompt: "Speaking prompt...",
    voiceCommandHint: "You can speak aloud: 'Start game', 'I took medicine', 'Help'",
    takeMedicinePrompt: "Time to take your scheduled dose",
    iTookThis: "I Have Taken This",
    confirmTaken: "Confirm Intake",
    photoProofRequired: "Capture photo of medicine strip",
    snapPhoto: "Take Verification Photo",
    photoConfirmed: "Verification Photo Stored",
    sessionCapNotice: "Great work! Session capped for comfort.",
    restWarmWater: "To prevent mental fatigue, take a peaceful rest and enjoy a cup of warm water.",
    returnHome: "Back to Home",
    caregiverSignIn: "Caregiver & ASHA Sign In",
    signedInAs: "Signed In:",
    caringFor: "Caring For:",
    updateProfile: "Edit Real Names & Profile",
    caregiverNameLabel: "Your Real Name (Caregiver)",
    patientNameLabel: "Elder Patient Full Name",
    preferredNameLabel: "Affectionate Name (e.g. Grandma, Aita, Maa, Papa)",
    relationLabel: "Relationship (Son, Daughter, Grandchild, ASHA)",
    phoneLabel: "Phone Number",
    saveProfileSuccess: "Profile & Real Names Saved Successfully!",
    domainNames: {
      memory: "Memory Recall",
      attention: "Sustained Attention",
      routine: "Daily Routine Sequencing",
      pattern: "Pattern & Heritage Recognition"
    },
    domainDescriptions: {
      memory: "Match pairs of traditional NER cultural artifacts",
      attention: "Focus and spot the distinctive element in tea foliage",
      routine: "Sequence the steps of traditional Assam CTC tea preparation",
      pattern: "Recognize iconic North Eastern silhouettes and landmarks"
    },
    moods: {
      level5: "Very Joyful & Peaceful",
      level5Sub: "High comfort & contentment",
      level4: "Content & Well",
      level4Sub: "Steady and settled",
      level3: "Calm & Neutral",
      level3Sub: "Everyday baseline",
      level2: "Tired & Unsure",
      level2Sub: "Gentle rest needed",
      level1: "Restless & Down",
      level1Sub: "Extra support & presence needed"
    },
    games: {
      memoryTitle: "Heritage Memory Match",
      memoryInstruction: "Find matching pairs of traditional North East items. Tap any card.",
      memoryCardFlipped: "Card revealed",
      memoryMatchFound: "Pair matched! Excellent!",
      attentionTitle: "Selective Tea Garden Focus",
      attentionInstruction: "Spot and tap the distinct or vibrant item among the distractors.",
      attentionFound: "Target located! Sharp focus!",
      routineTitle: "Daily Sequence Ordering",
      routineInstruction: "Tap the steps in the correct order: from preparation to finish.",
      routineCorrectOrder: "Perfect sequence restored!",
      patternTitle: "Heritage Silhouette Match",
      patternInstruction: "Match the shadow shape with the authentic regional landmark.",
      patternMatched: "Heritage identified accurately!"
    }
  }
};
