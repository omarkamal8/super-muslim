export type Zikr = {
  id: number;
  arabic: string;
  translation: string;
  transliteration: string;
  repetitions: number;
  virtue: string;
};

export type AzkarCategory = {
  title: string;
  arabicTitle: string;
  description: string;
  image: string;
  items: Zikr[];
};

export const azkarData: Record<string, AzkarCategory> = {
  morning: {
    title: 'Morning Azkar',
    arabicTitle: 'أذكار الصباح',
    description: 'Remembrance after Fajr prayer until sunrise',
    image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800',
    items: [
      {
        id: 1,
        arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرٌ',
        translation: 'We have reached the morning and at this very time unto Allah belongs all sovereignty, and all praise is for Allah. None has the right to be worshipped except Allah, alone, without any partner, to Him belongs all sovereignty and praise and He is over all things omnipotent',
        transliteration: "Asbahna wa asbahal mulku lillah, walhamdu lillah, la ilaha illallah wahdahu la shareeka lah, lahul mulku wa lahul hamd, wa huwa 'ala kulli shay'in qadeer",
        repetitions: 1,
        virtue: 'Whoever recites this in the morning has thanked Allah for the day'
      },
      {
        id: 2,
        arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ، وَقَهْرِ الرِّجَالِ',
        translation: 'O Allah, I seek refuge in You from anxiety and sorrow, weakness and laziness, miserliness and cowardice, the burden of debts and from being overpowered by men',
        transliteration: "Allahumma inni a'udhu bika minal hammi wal hazan, wa a'udhu bika minal 'ajzi wal kasal, wa a'udhu bika minal jubni wal bukhl, wa a'udhu bika min ghalabatid-dayni, wa qahrir-rijal",
        repetitions: 3,
        virtue: 'Protection from anxiety and sorrow throughout the day'
      },
      {
        id: 3,
        arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ',
        translation: 'O Allah, by Your leave we have reached the morning and by Your leave we have reached the evening, by Your leave we live and die and unto You is our resurrection',
        transliteration: "Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namut, wa ilaykan-nushur",
        repetitions: 1,
        virtue: "Acknowledging that all affairs are in Allah's Hands"
      }
    ]
  },
  evening: {
    title: 'Evening Azkar',
    arabicTitle: 'أذكار المساء',
    description: 'Remembrance after Asr prayer until Maghrib',
    image: 'https://images.unsplash.com/photo-1472120435266-53107fd0c44a?w=800',
    items: [
      {
        id: 1,
        arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرٌ',
        translation: 'We have reached the evening and at this very time unto Allah belongs all sovereignty, and all praise is for Allah. None has the right to be worshipped except Allah, alone, without any partner, to Him belongs all sovereignty and praise and He is over all things omnipotent',
        transliteration: "Amsayna wa amsal mulku lillah, walhamdu lillah, la ilaha illallah wahdahu la shareeka lah, lahul mulku wa lahul hamd, wa huwa 'ala kulli shay'in qadeer",
        repetitions: 1,
        virtue: 'Whoever recites this in the evening has thanked Allah for the night'
      },
      {
        id: 2,
        arabic: 'اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ',
        translation: 'O Allah, what blessing I or any of Your creation have received in this evening is from You alone, without partner, so for You is all praise and unto You all thanks',
        transliteration: "Allahumma ma amsa bi min ni'matin aw bi'ahadin min khalqika faminka wahdaka la shareeka lak, falakal hamdu wa lakash-shukr",
        repetitions: 1,
        virtue: 'Whoever recites this has fulfilled his obligation to thank Allah for that day'
      },
      {
        id: 3,
        arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
        translation: 'I seek refuge in the perfect words of Allah from the evil of what He has created',
        transliteration: "A'udhu bikalimatil-lahit-tammati min sharri ma khalaq",
        repetitions: 3,
        virtue: 'Whoever recites this three times in the evening will not be harmed by a poisonous sting that night'
      }
    ]
  },
  sleep: {
    title: 'Sleep Azkar',
    arabicTitle: 'أذكار النوم',
    description: 'Remembrance before sleeping',
    image: 'https://images.unsplash.com/photo-1455642305367-68834a1da7ab?w=800',
    items: [
      {
        id: 1,
        arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
        translation: 'In Your name, O Allah, I die and I live',
        transliteration: "Bismika Allahumma amutu wa ahya",
        repetitions: 1,
        virtue: 'Remembering Allah before sleep'
      },
      {
        id: 2,
        arabic: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ',
        translation: 'O Allah, protect me from Your punishment on the Day You resurrect Your servants',
        transliteration: "Allahumma qini 'adhabaka yawma tab'athu 'ibadak",
        repetitions: 3,
        virtue: 'Protection from punishment on the Day of Resurrection'
      },
      {
        id: 3,
        arabic: 'اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَوَجَّهْتُ وَجْهِي إِلَيْكَ، وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ، رَغْبَةً وَرَهْبَةً إِلَيْكَ، لَا مَلْجَأَ وَلَا مَنْجَا مِنْكَ إِلَّا إِلَيْكَ، آمَنْتُ بِكِتَابِكَ الَّذِي أَنْزَلْتَ، وَبِنَبِيِّكَ الَّذِي أَرْسَلْتَ',
        translation: 'O Allah, I submit myself to You, entrust my affairs to You, turn my face to You, and lay myself down depending upon You, hoping in You and fearing You. There is no refuge or escape from You except to You. I believe in Your Book which You revealed and Your Prophet whom You sent',
        transliteration: "Allahumma aslamtu nafsi ilayk, wa fawwadtu amri ilayk, wa wajjahtu wajhi ilayk, wa alja'tu dhahri ilayk, raghbatan wa rahbatan ilayk, la malja'a wa la manja minka illa ilayk, amantu bikitabikal-ladhi anzalt, wa binabiyyikal-ladhi arsalt",
        repetitions: 1,
        virtue: 'If one dies during that night, they die upon the natural religion (Islam)'
      }
    ]
  },
  wake: {
    title: 'Wake Up Azkar',
    arabicTitle: 'أذكار الاستيقاظ',
    description: 'Remembrance upon waking',
    image: 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=800',
    items: [
      {
        id: 1,
        arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
        translation: 'All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection',
        transliteration: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur",
        repetitions: 1,
        virtue: 'Gratitude to Allah for the blessing of life'
      },
      {
        id: 2,
        arabic: 'الْحَمْدُ لِلَّهِ الَّذِي عَافَانِي فِي جَسَدِي، وَرَدَّ عَلَيَّ رُوحِي، وَأَذِنَ لِي بِذِكْرِهِ',
        translation: 'All praise is for Allah who restored to me my health and returned my soul and has allowed me to remember Him',
        transliteration: "Alhamdu lillahil-ladhi 'afani fi jasadi, wa radda 'alayya ruhi, wa adhina li bidhikrih",
        repetitions: 1,
        virtue: 'Gratitude for health and the ability to remember Allah'
      },
      {
        id: 3,
        arabic: '﴿إِنَّ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ وَاخْتِلَافِ اللَّيْلِ وَالنَّهَارِ لَآيَاتٍ لِأُولِي الْأَلْبَابِ﴾',
        translation: 'Indeed, in the creation of the heavens and the earth and the alternation of the night and the day are signs for those of understanding',
        transliteration: "Inna fi khalqis-samawati wal-ardi wakhtilafil-layli wan-nahari la'ayatin li'ulil-albab",
        repetitions: 1,
        virtue: 'Reflection on Allah\'s creation'
      }
    ]
  },
  prayer: {
    title: 'Prayer Azkar',
    arabicTitle: 'أذكار الصلاة',
    description: 'Remembrance after prayers',
    image: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=800',
    items: [
      {
        id: 1,
        arabic: 'أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ',
        translation: 'I seek forgiveness from Allah, I seek forgiveness from Allah, I seek forgiveness from Allah',
        transliteration: "Astaghfirullah, Astaghfirullah, Astaghfirullah",
        repetitions: 3,
        virtue: 'Seeking forgiveness after prayer'
      },
      {
        id: 2,
        arabic: 'اللَّهُمَّ أَنْتَ السَّلَامُ، وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
        translation: 'O Allah, You are As-Salam (The One Free from all defects) and from You is all peace, blessed are You, O Possessor of majesty and honor',
        transliteration: "Allahumma antas-salam, wa minkas-salam, tabarakta ya dhal-jalali wal-ikram",
        repetitions: 1,
        virtue: 'Acknowledging Allah\'s attributes after prayer'
      },
      {
        id: 3,
        arabic: 'سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَاللَّهُ أَكْبَرُ',
        translation: 'Glory is to Allah, and praise is to Allah, and Allah is the Most Great',
        transliteration: "Subhanallah, walhamdu lillah, wallahu akbar",
        repetitions: 33,
        virtue: 'Glorifying Allah after prayer'
      }
    ]
  },
  mosque: {
    title: 'Mosque Azkar',
    arabicTitle: 'أذكار المسجد',
    description: 'Entering and leaving mosque',
    image: 'https://images.unsplash.com/photo-1519075428252-b9d13dd74b57?w=800',
    items: [
      {
        id: 1,
        arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
        translation: 'O Allah, open the gates of Your mercy for me',
        transliteration: "Allahumma-ftah li abwaba rahmatik",
        repetitions: 1,
        virtue: 'Supplication when entering the mosque'
      },
      {
        id: 2,
        arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
        translation: 'O Allah, I ask You from Your favor',
        transliteration: "Allahumma inni as'aluka min fadlik",
        repetitions: 1,
        virtue: 'Supplication when leaving the mosque'
      },
      {
        id: 3,
        arabic: 'أَعُوذُ بِاللَّهِ الْعَظِيمِ، وَبِوَجْهِهِ الْكَرِيمِ، وَسُلْطَانِهِ الْقَدِيمِ، مِنَ الشَّيْطَانِ الرَّجِيمِ',
        translation: 'I seek refuge in Allah, The Supreme and with His Noble Face, and His eternal authority from the accursed devil',
        transliteration: "A'udhu billahil-'adheem, wa bi-wajhihil-kareem, wa sultanihil-qadeem, minash-shaytanir-rajeem",
        repetitions: 1,
        virtue: 'Protection from Shaitan when entering the mosque'
      }
    ]
  },
  food: {
    title: 'Food Azkar',
    arabicTitle: 'أذكار الطعام',
    description: 'Before and after eating',
    image: 'https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=800',
    items: [
      {
        id: 1,
        arabic: 'بِسْمِ اللَّهِ',
        translation: 'In the name of Allah',
        transliteration: "Bismillah",
        repetitions: 1,
        virtue: 'Mentioning Allah\'s name before eating'
      },
      {
        id: 2,
        arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا، وَرَزَقَنِيهِ، مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
        translation: 'All praise is for Allah who fed me this and provided it for me without any might nor power from myself',
        transliteration: "Alhamdu lillahil-ladhi at'amani hadha, wa razaqanihi, min ghayri hawlin minni wa la quwwah",
        repetitions: 1,
        virtue: 'Supplication after finishing a meal'
      },
      {
        id: 3,
        arabic: 'الْحَمْدُ لِلَّهِ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ، غَيْرَ مَكْفِيٍّ وَلَا مُوَدَّعٍ، وَلَا مُسْتَغْنًى عَنْهُ رَبَّنَا',
        translation: 'All praise is for Allah, many good and blessed praises. Our Lord is not in need of anyone, cannot be abandoned, and is indispensable',
        transliteration: "Alhamdu lillahi hamdan katheeran tayyiban mubarakan feeh, ghayra makfiyyin wa la muwadda'in, wa la mustaghnan 'anhu rabbana",
        repetitions: 1,
        virtue: 'Supplication after a meal that will fill the scales of reward'
      }
    ]
  },
  travel: {
    title: 'Travel Azkar',
    arabicTitle: 'أذكار السفر',
    description: 'Remembrance during travel',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
    items: [
      {
        id: 1,
        arabic: 'اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، ﴿سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ﴾',
        translation: 'Allah is the Most Great, Allah is the Most Great, Allah is the Most Great. Glory is to Him Who has provided this for us though we could never have had it by our efforts. Surely, unto our Lord we are returning.',
        transliteration: "Allahu akbar, Allahu akbar, Allahu akbar, subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin, wa inna ila rabbina lamunqalibun",
        repetitions: 1,
        virtue: 'Supplication for travel'
      },
      {
        id: 2,
        arabic: 'اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى، اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ',
        translation: 'O Allah, we ask You on this our journey for goodness and piety, and for works that are pleasing to You. O Allah, lighten this journey for us and make its distance easy for us.',
        transliteration: "Allahumma inna nas'aluka fi safarina hadhal-birra wat-taqwa, wa minal-'amali ma tarda. Allahumma hawwin 'alayna safarana hadha watwi 'anna bu'dah",
        repetitions: 1,
        virtue: 'Seeking Allah\'s help during travel'
      },
      {
        id: 3,
        arabic: 'آيِبُونَ، تَائِبُونَ، عَابِدُونَ، لِرَبِّنَا حَامِدُونَ',
        translation: 'We return, repent, worship and praise our Lord',
        transliteration: "Ayibuna, ta'ibuna, 'abiduna, lirabbina hamidun",
        repetitions: 1,
        virtue: 'Said when returning from travel'
      }
    ]
  },
  distress: {
    title: 'Distress Azkar',
    arabicTitle: 'أذكار الكرب',
    description: 'Remembrance during hardship',
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800',
    items: [
      {
        id: 1,
        arabic: 'لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ',
        translation: 'None has the right to be worshipped except Allah, the Mighty, the Forbearing. None has the right to be worshipped except Allah, Lord of the Magnificent Throne. None has the right to be worshipped except Allah, Lord of the heavens, Lord of the Earth, and Lord of the Noble Throne',
        transliteration: "La ilaha illallahul-'adhimul-halim, la ilaha illallahu rabbul-'arshil-'adhim, la ilaha illallahu rabbus-samawati wa rabbul-ardi wa rabbul-'arshil-karim",
        repetitions: 1,
        virtue: 'Relief from distress and anxiety'
      },
      {
        id: 2,
        arabic: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
        translation: 'There is none worthy of worship except You, glory is to You. Indeed, I was among the wrongdoers',
        transliteration: "La ilaha illa anta subhanaka inni kuntu minadh-dhalimin",
        repetitions: 1,
        virtue: 'The supplication of Prophet Yunus (peace be upon him) when he was in the belly of the whale'
      },
      {
        id: 3,
        arabic: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ',
        translation: 'O Ever Living, O Self-Sustaining and All-Sustaining, by Your mercy I seek assistance',
        transliteration: "Ya hayyu ya qayyumu bi-rahmatika astaghith",
        repetitions: 1,
        virtue: 'Seeking Allah\'s help in times of distress'
      }
    ]
  },
  forgiveness: {
    title: 'Forgiveness Azkar',
    arabicTitle: 'أذكار الاستغفار',
    description: 'Seeking Allah\'s forgiveness',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    items: [
      {
        id: 1,
        arabic: 'أَسْتَغْفِرُ اللَّهَ',
        translation: 'I seek forgiveness from Allah',
        transliteration: "Astaghfirullah",
        repetitions: 100,
        virtue: 'Seeking Allah\'s forgiveness'
      },
      {
        id: 2,
        arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
        translation: 'O Allah, You are my Lord, there is none worthy of worship except You. You created me and I am Your servant, and I abide by Your covenant and promise as best I can. I seek refuge in You from the evil that I have done. I acknowledge Your favor upon me, and I acknowledge my sin, so forgive me, for verily none forgives sins except You',
        transliteration: "Allahumma anta rabbi la ilaha illa anta, khalaqtani wa ana 'abduka, wa ana 'ala 'ahdika wa wa'dika mas-tata't, a'udhu bika min sharri ma sana't, abu'u laka bini'matika 'alayya, wa abu'u bidhanbi faghfir li fa'innahu la yaghfirudh-dhunuba illa ant",
        repetitions: 1,
        virtue: 'The master of seeking forgiveness; whoever says it with conviction in the evening and dies that night will enter Paradise'
      },
      {
        id: 3,
        arabic: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ',
        translation: 'My Lord, forgive me and accept my repentance. Indeed, You are the Accepting of repentance, the Merciful',
        transliteration: "Rabbighfir li wa tub 'alayya innaka antat-tawwabur-rahim",
        repetitions: 100,
        virtue: 'Seeking forgiveness and repentance'
      }
    ]
  }
};