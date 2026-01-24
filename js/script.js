// 1. NPC 데이터
const npcs = {
    sion: {
        name: "시온",
        sprite: "assets/images/sprites/sion.png",
        portraits: {
            default: "assets/images/portraits/sion_default.png",
            happy: "assets/images/portraits/sion_happy.png",
            shock: "assets/images/portraits/sion_serious.png"
        },
        gifts: {
            love: ["별조각", "에너지 드링크"],
            hate: ["쓰레기", "잉어"]
        },
        giftReactions: {
            love: { text: "이거 제가 찾던 건데.. 고마워요, 정말 잘 쓸게요.", emotion: "happy" },
            hate: { text: "마음은 고맙지만.. 이건 좀 처치하기 곤란하네요.", emotion: "serious" },
            default: { text: "선물인가요? 고맙습니다.", emotion: "default" }
        },
        locations: { sunny: "hall", rainy: "hall" }
    },
    riku: {
        name: "리쿠",
        sprite: "assets/images/sprites/riku.png",
        portraits: {
            default: "assets/images/portraits/riku_default.png",
            happy: "assets/images/portraits/riku_happy.png",
            sad: "assets/images/portraits/riku_sad.png",
            shock: "assets/images/portraits/riku_shock.png"
        },
        gifts: {
            love: ["별조각", "에너지 드링크"],
            hate: ["쓰레기", "잉어"]
        },
        giftReactions: {
            love: { text: "이거 제가 찾던 건데.. 고마워요, 정말 잘 쓸게요.", emotion: "happy" },
            hate: { text: "마음은 고맙지만.. 이건 좀 처치하기 곤란하네요.", emotion: "serious" },
            default: { text: "선물인가요? 고맙습니다.", emotion: "default" }
        },
        locations: { sunny: "shop", rainy: "shop" }
    },
    yushi: {
        name: "유우시",
        sprite: "assets/images/sprites/yushi.png",
        portraits: {
            default: "assets/images/portraits/yushi_default.png",
            happy: "assets/images/portraits/yushi_happy.png",
            shock: "assets/images/portraits/yushi_shock.png"
        },
        gifts: { // gifts 속성 추가 (코드 일관성을 위해 임의 추가함, 필요시 수정)
             love: ["별조각"],
             hate: ["쓰레기"]
        },
        giftReactions: {
            love: { text: "이거 제가 찾던 건데.. 고마워요, 정말 잘 쓸게요.", emotion: "happy" },
            hate: { text: "마음은 고맙지만.. 이건 좀 처치하기 곤란하네요.", emotion: "serious" },
            default: { text: "선물인가요? 고맙습니다.", emotion: "default" }
        },
        locations: { sunny: "forest", rainy: "saloon" }
    },
    jaehee: { 
        name: "재희",
        sprite: "assets/images/sprites/jaehee.png",
        portraits: { 
            default: "assets/images/portraits/jaehee_default.png",
            happy: "assets/images/portraits/jaehee_happy.png", // 임시 이미지 경로 주의
            sad: "assets/images/portraits/jaehee_sad.png",
            shock: "assets/images/portraits/jaehee_shock.png"
        },
        gifts: {
            love: ["별조각", "에너지 드링크"],
            hate: ["쓰레기", "잉어"]
        },
        giftReactions: {
            love: { text: "이거 제가 찾던 건데.. 고마워요, 정말 잘 쓸게요.", emotion: "happy" },
            hate: { text: "마음은 고맙지만.. 이건 좀 처치하기 곤란하네요.", emotion: "serious" },
            default: { text: "선물인가요? 고맙습니다.", emotion: "default" }
        },
        locations: { sunny: "square", rainy: "saloon" } 
    },
    ryo: { 
        name: "료", 
        sprite: "assets/images/sprites/ryp.png",
        portraits: { 
            default: "assets/images/portraits/ryo_default.png",
            happy: "assets/images/portraits/ryo_happy.png",
            sad: "assets/images/portraits/ryo_sad.png",
            shock: "assets/images/portraits/ryo_shock.png"
        },
        gifts: {
            love: ["별조각", "에너지 드링크"],
            hate: ["쓰레기", "잉어"]
        },
        giftReactions: {
            love: { text: "이거 제가 찾던 건데.. 고마워요, 정말 잘 쓸게요.", emotion: "happy" },
            hate: { text: "마음은 고맙지만.. 이건 좀 처치하기 곤란하네요.", emotion: "serious" },
            default: { text: "선물인가요? 고맙습니다.", emotion: "default" }
        },
        locations: { sunny: "square", rainy: "saloon" } 
    },
    sakuya: { 
        name: "사쿠야",
        sprite: "assets/images/sprites/sakuya.png",
        portraits: { 
            default: "assets/images/portraits/sakuya_default.png",
            happy: "assets/images/portraits/sakuya_happy.png",
            sad: "assets/images/portraits/sakuya_sad.png",
            shock: "assets/images/portraits/sakuya_shock.png"
        },
        gifts: {
            love: ["별조각", "에너지 드링크"],
            hate: ["쓰레기", "잉어"]
        },
        giftReactions: {
            love: { text: "이거 제가 찾던 건데.. 고마워요, 정말 잘 쓸게요.", emotion: "happy" },
            hate: { text: "마음은 고맙지만.. 이건 좀 처치하기 곤란하네요.", emotion: "serious" },
            default: { text: "선물인가요? 고맙습니다.", emotion: "default" }
        },
        locations: { sunny: "square", rainy: "saloon" } 
    }
};

// 2. 대본 및 키워드 데이터
const dailyScripts = {
    1: {
        riku: { text: "누나 안냥 ! 새로 이사 왓어여?? 리쿠는 리쿠에여 잘 부타캐여 히히", emotion: "happy" },
        yushi: { text: "에.. 새로 오신 농장주님이시군요 ? 만나서 반가워요 !", emotion: "default" }
    },
    4: {
        sion: { text: "축제라 그런지 다들 즐거워 보여서 좋네요. 일 생각은 잠시 잊어도 돼요 !", emotion: "happy" }
    },
    "highAffinity": {
        riku: { text: "누나 보니까 리쿠 넘 기부니 조타 ! 오늘두 리쿠랑 마니 놀아조야 대여 히히", emotion: "happy" }
    }
};

// ▼▼▼ [새로 추가] 날씨별 랜덤 대사 & 선택지 데이터 ▼▼▼
const randomDialogues = {
    riku: {
        맑음: [
            { text: "누나 ! 오늘 날씨 짱 조타 그져?? 나랑 공놀이 하까여?", emotion: "happy" },
            { text: "광장에 비둘기 징짜 마나여. 내가 다 쫒아내써 !!", emotion: "happy" },
            { text: "배고파여.. 누나 맛있는 거 없어여??", emotion: "sad" },
            // 선택지형 대화 예시
            { 
                text: "누나는 강아지가 좋아여 고양이가 좋아여??", 
                emotion: "happy",
                choices: [
                    { label: "강아지 (리쿠)", score: 10, reply: "헤헤 저두여 !! 우린 통해써 !" },
                    { label: "고양이", score: -5, reply: "힝.. 고양이는 쫌 무서운데.." }
                ]
            }
        ],
        비: [
            { text: "비 오는 거 시러여.. 축축해..", emotion: "sad" },
            { text: "누나 우산 이써여?? 나랑 같이 쓰까여??", emotion: "happy" },
            { text: "장화 신었으니까 물웅덩이 밟아도 대져??", emotion: "happy" }
        ],
        벚꽃: [
            { text: "와 핑크색 눈이 내리는 거 가타여 !!", emotion: "happy" },
            { text: "벚꽃잎 잡으면 소원 이루어진대여 ! 빨리 잡으러 가여 !!", emotion: "shock" },
            { text: "누나 머리에 꽃잎 붙어써여. ...이뿌다 헤헤.", emotion: "happy" }
        ]
    },
    yushi: {
        맑음: [
            { text: "에.. 햇살이 따뜻하네요. 낮잠 자기 좋은 날씨지요..", emotion: "default" },
            { text: "산책 나오셨나요? 저도 잠시 걷고 있었답니다.", emotion: "happy" },
            { text: "오늘따라 새들이 시끄럽네요.. 아, 싫다는 건 아니에요.", emotion: "shock" },
             // 선택지형 대화 예시
             { 
                text: "농장주님은 어떤 계절을 좋아하시나요?", 
                emotion: "default",
                choices: [
                    { label: "따뜻한 봄", score: 5, reply: "에.. 저도 봄을 제일 좋아해요. 마음이 편안해지니까요." },
                    { label: "시원한 가을", score: 0, reply: "가을이라.. 쓸쓸하지만 운치 있죠." }
                ]
            }
        ],
        비: [
            { text: "에.. 비가 오니 숲이 더 조용해졌네요.", emotion: "default" },
            { text: "빗소리를 들으며 책을 읽으면 집중이 잘 되지요.", emotion: "happy" },
            { text: "감기 조심하세요. 비 맞으면 아프니까요.", emotion: "shock" }
        ],
        벚꽃: [
            { text: "벚꽃이 참 예쁘지요? 금방 져버려서 아쉽지만요..", emotion: "sad" },
            { text: "에.. 머리에 꽃잎이.. 떼어 드릴게요.", emotion: "happy" },
            { text: "이런 날엔 도시락이라도 싸서 소풍을 가고 싶네요.", emotion: "happy" }
        ]
    }
    // 시온, 재희, 료, 사쿠야 등 다른 캐릭터도 같은 형식으로 추가
};

const npcKeywords = {
    riku: {
        "안녕": { text: "누나 오하욘 ! 리쿠 보러 왓어여?? 히히", emotion: "happy" },
        "질투": { text: "왜 리쿠를 두고 먼저 갓어여?? 리쿠 서운해여 ㅠㅠ", emotion: "sad" }
    },
    yushi: {
        "안녕": { text: "에.. 안녕하세요 ! 오늘 날씨가 참 맑지요 ? ^_^", emotion: "happy" }
    }
};

const questLetters = {
    riku: "누나.. 리쿠는 쪼금 서운해여.. ㅠㅠ 나 이거 진짜 필요한뎅..",
    sion: "안녕하세요, 농장주님. 실은 제가 꼭 필요한 물건이 있는데.."
};

// 3. 장소 및 레시피 데이터
const locations = {
    farm: { name: "농장", bg: "assets/images/backgrounds/farm.png", items: ["수선화"] },
    square: { name: "마을 광장", bg: "assets/images/backgrounds/square.png", items: ["수선화", "민들레"] },
    forest: { name: "비밀의 숲", bg: "assets/images/backgrounds/forest.png", items: ["별조각", "블루 재즈"] },
    shop: { name: "피에르 상점", bg: "assets/images/backgrounds/shop.png", items: ["설탕"] },
    hall: { name: "마을 회관", bg: "assets/images/backgrounds/hall.png", items: ["낡은 신문"] },
    saloon: { name: "별빛 주점", bg: "assets/images/backgrounds/saloon.png", items: ["딸기 빵"] }
};

const recipes = [
    { ingredients: ["수선화", "설탕"], result: "꽃 케이크" },
    { ingredients: ["별조각", "블루 재즈"], result: "반짝이는 유리병" }
];



