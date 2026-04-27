/**
 * Survey questions, reporter intake config, and shared constants.
 *
 * Question types:
 *   - text   : free-form short/long text
 *   - single : pick exactly one option
 *   - multi  : pick one or more options
 */

export const AGE_GROUPS = [
  { id: '13-17', label: '13–17' },
  { id: '18-24', label: '18–24' },
  { id: '25-34', label: '25–34' },
  { id: '35+', label: '35+' },
];

// Egyptian mobile: optional +20 / 0020 / 0 prefix, then 1[0|1|2|5] + 8 digits.
export const EGY_PHONE_REGEX = /^(?:\+?20|0020|0)?1[0125]\d{8}$/;

export const normalizeEgPhone = (raw) => (raw || '').replace(/[\s-]/g, '');

export const SURVEY_QUESTIONS = [
  {
    id: 'q1',
    text: 'لو هتوصف بنها بكلمة واحدة… هتقول إيه؟',
    type: 'text',
    required: true,
    placeholder: 'كلمة واحدة بس…',
  },
  {
    id: 'q2',
    text: 'الفئة العمرية بتاعتك؟',
    type: 'single',
    required: true,
    options: [
      { id: '13-17', label: '13–17' },
      { id: '18-24', label: '18–24' },
      { id: '25-34', label: '25–34' },
      { id: '35+', label: '35+' },
    ],
  },
  {
    id: 'q3',
    text: 'بتخرج في بنها قد إيه؟',
    type: 'single',
    required: true,
    options: [
      { id: 'daily', label: 'تقريبًا كل يوم' },
      { id: 'weekly-multi', label: 'كذا مرة في الأسبوع' },
      { id: 'weekly', label: 'مرة في الأسبوع' },
      { id: 'rare', label: 'نادر' },
    ],
  },
  {
    id: 'q4',
    text: 'غالبًا بتخرج عشان إيه؟ اختار اللي ينطبق',
    type: 'multi',
    required: true,
    options: [
      { id: 'cafes', label: 'كافيهات' },
      { id: 'restaurants', label: 'مطاعم' },
      { id: 'friends', label: 'قعدة مع صحاب' },
      { id: 'shopping', label: 'شوبينج' },
      { id: 'walk', label: 'تمشية' },
      { id: 'other', label: 'حاجة تانية' },
    ],
  },
  {
    id: 'q5',
    text: 'بصراحة… شايف بنها ممتعة قد إيه مقارنة بأماكن تانية؟',
    type: 'single',
    required: true,
    options: [
      { id: 'very-fun', label: 'ممتعة جدًا' },
      { id: 'kinda-fun', label: 'حلوة شوية' },
      { id: 'normal', label: 'عادية' },
      { id: 'kinda-boring', label: 'مملة شوية' },
      { id: 'very-boring', label: 'مملة جدًا' },
    ],
  },
  {
    id: 'q6',
    text: 'أكتر حاجة شايف بنها ناقصاها؟',
    type: 'text',
    required: true,
    placeholder: 'قول رأيك بصراحة…',
  },
  {
    id: 'q7',
    text: 'إيه أكتر حاجة بتحبها فعلًا في بنها؟',
    type: 'text',
    required: true,
    placeholder: 'الحاجة اللي بتفرّق معاك…',
  },
  {
    id: 'q8',
    text: 'لو بنها كانت شخص… شخصيتها تبقى عاملة إزاي؟ 😄',
    type: 'text',
    required: true,
    placeholder: 'وصفها زي ما هي بنت/ابن البلد…',
  },
  {
    id: 'q9',
    text: 'الناس بتخرج فين أكتر حاجة في بنها؟',
    type: 'text',
    required: false,
    placeholder: 'أماكن، شوارع، كافيهات، مولات…',
  },
  {
    id: 'q10',
    text: 'قد إيه سهل تكتشف أماكن جديدة في بنها؟',
    type: 'single',
    required: true,
    options: [
      { id: 'very-easy', label: 'سهل جدًا' },
      { id: 'kinda-easy', label: 'سهل شوية' },
      { id: 'hard', label: 'مش سهل' },
      { id: 'same-places', label: 'بروح نفس الأماكن دايمًا' },
    ],
  },
  {
    id: 'q11',
    text: 'لو فيه منصة تساعدك تكتشف أماكن في بنها… هتستخدمها؟',
    type: 'single',
    required: true,
    options: [
      { id: 'yes', label: 'آه طبعًا' },
      { id: 'maybe', label: 'ممكن' },
      { id: 'no', label: 'لا' },
    ],
  },
  {
    id: 'q12',
    text: 'إيه اللي يخليك تستخدمها فعلًا؟',
    type: 'multi',
    required: true,
    options: [
      { id: 'reviews', label: 'Reviews صادقة' },
      { id: 'media', label: 'صور وفيديوهات' },
      { id: 'trending', label: 'أماكن تريند' },
      { id: 'recos', label: 'ترشيحات ناس' },
      { id: 'fun-content', label: 'محتوى ممتع' },
      { id: 'all', label: 'كل اللي فوق' },
    ],
  },
  {
    id: 'q13',
    text: 'ممكن أنت بنفسك تنزل review أو صورة أو فيديو؟',
    type: 'single',
    required: true,
    options: [
      { id: 'yes', label: 'آه' },
      { id: 'maybe', label: 'ممكن' },
      { id: 'no', label: 'لا' },
    ],
  },
  {
    id: 'q14',
    text: 'إيه نوع المحتوى اللي تحب تشوفه؟',
    type: 'multi',
    required: true,
    options: [
      { id: 'food-reviews', label: 'مراجعات أكل' },
      { id: 'hidden-gems', label: 'أماكن hidden gems' },
      { id: 'events', label: 'Events' },
      { id: 'funny', label: 'محتوى مضحك' },
      { id: 'stories', label: 'قصص وتجارب' },
    ],
  },
  {
    id: 'q15',
    text: 'لو بإيدك تغيّر حاجة واحدة فورًا في بنها… هتغيّر إيه؟',
    type: 'text',
    required: true,
    placeholder: 'حاجة واحدة بس…',
  },
  {
    id: 'q16',
    text: 'بتعرف الأماكن الجديدة منين غالبًا؟',
    type: 'multi',
    required: true,
    options: [
      { id: 'instagram', label: 'Instagram' },
      { id: 'facebook', label: 'Facebook' },
      { id: 'tiktok', label: 'TikTok' },
      { id: 'friends', label: 'أصحاب' },
      { id: 'chance', label: 'صدفة' },
    ],
  },
  {
    id: 'q17',
    text: 'إيه نوع الأماكن اللي نفسك تشوفها أكتر في بنها؟',
    type: 'multi',
    required: true,
    options: [
      { id: 'rooftop', label: 'Rooftop' },
      { id: 'youth', label: 'Youth spaces' },
      { id: 'quiet-cafes', label: 'Quiet cafés' },
      { id: 'family', label: 'Family spots' },
      { id: 'events', label: 'Event spaces' },
    ],
  },
  {
    id: 'q18',
    text: 'لو فيه مكان جديد نازل… إيه اللي يخليك تروح تجربه؟',
    type: 'multi',
    required: true,
    options: [
      { id: 'looks', label: 'شكله' },
      { id: 'reviews', label: 'تقييم الناس' },
      { id: 'price', label: 'السعر' },
      { id: 'trend', label: 'الترند' },
      { id: 'near', label: 'قربه مني' },
    ],
  },
  {
    id: 'q19',
    text: 'هل شايف إن بنها عندها potential تبقى أقوى من كده؟',
    type: 'single',
    required: true,
    options: [
      { id: 'yes', label: 'آه جدًا' },
      { id: 'maybe', label: 'ممكن' },
      { id: 'needs-work', label: 'محتاجة شغل كبير' },
    ],
  },
  {
    id: 'q20',
    text: 'لو عندك اقتراح حر… اكتبه براحتك',
    type: 'text',
    required: false,
    placeholder: 'اكتب اقتراحك…',
  },
];

export const TOTAL_STEPS = SURVEY_QUESTIONS.length + 2; // reporter + 20 + review

export const PENDING_STORAGE_KEY = 'benha_pending_submissions';
