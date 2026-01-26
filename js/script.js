// 1. NPC 데이터
const npcs = {
    sion: {
        name: "시온",
        sprite: "assets/images/sprites/sion.png",
        portrait: "assets/images/portraits/sion_default.png",
        gifts: {
            love: ["커피", "에너지 드링크", "설탕", "회"],
            hate: ["블롭피쉬"]
        },
        giftReactions: {
            love: { text: "와... 이거 제가 제일 좋아하는 건데. 어떻게 아셨어요? 진짜 감동이다. 고마워요.", emotion: "default" },
            hate: { text: "마음은 고맙지만... 이건 좀 처치하기 곤란하네요.", emotion: "default" },
            default: { text: "오, 선물인가요? 고맙습니다.", emotion: "default" }
        },
        unknownReaction: { text: "음... 무슨 말씀이신지 잘 모르겠네요.", emotion: "default" },
        locations: { sunny: "hall", rainy: "hall", blossom: "forest" },
        // ★ [추가] 장소별 좌표 설정 (top: 위에서 거리, left: 왼쪽에서 거리)
        positions: {
            hall: { top: "75%", left: "25%" },
            forest: { top: "48%", left: "16%" }
        }
    },
    riku: {
        name: "리쿠",
        sprite: "assets/images/sprites/riku.png",
        portrait: "assets/images/portraits/riku_default.png",
        unknownReaction: { text: "엥? 그게 뭐예여? 먹는 거예여?", emotion: "shock" },
        gifts: {
            love: ["도토리", "초코케이크", "아이스크림"],
            hate: ["흙"]
        },
        giftReactions: {
            love: { text: "{user}(은)는 리쿠를 잘 아는구낭? 고마워영!", emotion: "happy" },
            hate: { text: "왜 리쿠한테 이런 거 줬어여? 리쿠 이거 싫어하는 거 몰랏어여? 속상해여 ㅠㅠ", emotion: "serious" },
            default: { text: "와아, 리쿠 넘 행복해영!", emotion: "default" }
        },
        locations: { sunny: "shop", rainy: "saloon", blossom: "shop" },
        // ★ [추가] 장소별 좌표 설정 (top: 위에서 거리, left: 왼쪽에서 거리)
        positions: {
            shop: { top: "75%", left: "24%" },
            saloon: { top: "80%", left: "16%" }
        }
    },
    yushi: {
        name: "유우시",
        sprite: "assets/images/sprites/yushi.png",
        portrait: "assets/images/portraits/yushi_default.png",
        gifts: { // gifts 속성 추가 (코드 일관성을 위해 임의 추가함, 필요시 수정)
             love: ["스타푸르트", "블루 재즈"],
             hate: ["쓰레기"]
        },
        giftReactions: {
            love: { text: "에 ! 저 주는 거예요 ? 너무 예쁘다 ~ {user} 저 이거 진짜 좋아해요 ! ^_^", emotion: "happy" },
            hate: { text: "에..? 이건.. 너무해요 !", emotion: "serious" },
            default: { text: "고마워요 ! 잘 간직할게요 ^_^ 우리 기분 좋은 추억이 하나 더 생겼네요 ~", emotion: "default" }
        },
        unknownReaction: { text: "에.. 죄송해요. 무슨 말씀이신지 잘 모르겠어요.. ^_^;", emotion: "shock" },
        locations: { sunny: "forest", rainy: "saloon", blossom: "forest" },
        // ★ [추가] 장소별 좌표 설정 (top: 위에서 거리, left: 왼쪽에서 거리)
        positions: {
            forest: { top: "28%", left: "61%" }, // 회관에서는 오른쪽 위에
            saloon: { top: "80%", left: "20%" }
        }
    },
    jaehee: { 
        name: "재희",
        sprite: "assets/images/sprites/jaehee.png",
        portrait: "assets/images/portraits/jaehee_default.png",
        gifts: {
            love: ["행운의 점심", "에너지 드링크"],
            hate: ["쓰레기"]
        },
        giftReactions: {
            love: { text: "우와아!! 진짜 대박!! 저 이거 진짜 좋아하는데! 최고예요!!", emotion: "happy" },
            hate: { text: "마음은 고맙지만.. 이건 좀 처치하기 곤란하네요.", emotion: "serious" },
            default: { text: "오..! 와! 대박! 뭔지 모르겠지만 그래도 {user}(이)가 준 거니까 일단 잘 챙겨둘게요! 허허", emotion: "default" }
        },
        unknownReaction: { text: "에.. 죄송해요. 무슨 말씀이신지 잘 모르겠어요.. ^_^;", emotion: "shock" },
        locations: { sunny: "square", rainy: "saloon", blossom: "shop" },
        // ★ [추가] 장소별 좌표 설정 (top: 위에서 거리, left: 왼쪽에서 거리)
        positions: {
            shop: { top: "57%", left: "64%" }, 
            saloon: { top: "80%", left: "80%" },
            square: { top: "41%", left: "7%" }
        }
    },
                    
    ryo: { 
        name: "료", 
        sprite: "assets/images/sprites/ryo.png",
        portrait: "assets/images/portraits/ryo_default.png",
        gifts: {
            love: ["블롭피쉬", "에너지 드링크"],
            hate: ["쓰레기", "잉어"]
        },
        giftReactions: {
            love: { text: "야하항~! 진짜 최고! 이거 완전 희귀한 건데! 고마워료!", emotion: "happy" },
            hate: { text: "오, 센스 대박! 감사해료!", emotion: "serious" },
            default: { text: "선물인가요? 고맙습니다.", emotion: "default" }
        },
        unknownReaction: { text: "에.. 죄송해요. 무슨 말씀이신지 잘 모르겠어요.. ^_^;", emotion: "shock" },
        locations: { sunny: "square", rainy: "hall", blossom: "square" }, 
        // ★ [추가] 장소별 좌표 설정 (top: 위에서 거리, left: 왼쪽에서 거리)
        positions: {
            hall: { top: "82%", left: "49%" },
            square: { top: "54%", left: "48%" }
        }
    },
    
    sakuya: { 
        name: "사쿠야",
        sprite: "assets/images/sprites/sakuya.png",
        portrait: "assets/images/portraits/sakuya_default.png",
        gifts: {
            love: ["핑크케이크"],
            hate: ["쓰레기", "잉어"]
        },
        giftReactions: {
            love: { text: "고마워요. 특히 이 딸기... 향이 너무 달콤해서 기분이 좋아졌어요", emotion: "happy" },
            hate: { text: "아... 진짜 죄송한데... 이건 다른 사람 주는 게 어때요?", emotion: "serious" },
            default: { text: "에- 엄청 다정하네요. 이런 걸 다 챙겨주고. 고맙습니다.", emotion: "default" }
        },
        unknownReaction: { text: "에.. 죄송해요. 무슨 말씀이신지 잘 모르겠어요.. ^_^;", emotion: "shock" },
        locations: { sunny: "square", rainy: "saloon", blossom: "forest" }, 
        // ★ [추가] 장소별 좌표 설정 (top: 위에서 거리, left: 왼쪽에서 거리)
        positions: {
            forest: { top: "85%", left: "50%" },
            saloon: { top: "75%", left: "41%" },
            square: { top: "25%", left: "43%" }
        }
    }
};

// 2. 대본 및 키워드 데이터
const dailyScripts = {
    // 1일차 대사 (배열로 변경)
    1: {
        riku: [
            { text: "누나 안녕 ! 새로 이사 왓어여??", emotion: "happy" },
            { 
                text: "저는 리쿠고 상점 알바생이에여 히히 리쿠 봣으니 누나는 운이 좋당!", 
                emotion: "happy",
                choices: [
                    { label: "리쿠 귀엽네", score: 10, reply: "에? 진짜용?? ㅎㅎㅎㅎㅎ" },
                    { label: "자주 놀러올게요!", score: 5, reply: "넹! 누나는 특별히 사과 하나 더 줄게용" }
                ]
            },
        ],
        
        sion: [
            { text: "아, 안녕하세요. 오늘 귀농하신다는 분 맞으시죠?" },
            { 
                text: "저는 마을회관 관리를 맡고 있는 오시온입니다.", 
                emotion: "happy",
                choices: [
                    { label: "마을을 위해 열심히 일하겠습니다! 잘 부탁드려요.", score: 5, reply: "오... 열정이 대단하시네요. 저도 도울 수 있는 건 도울게요." },
                    { label: "네 어쩌다보니...(ㅎㅎ) 잘 부탁드려요!", score: 0, reply: "네, 필요한 거 있으시면 말씀해주세요." },
                    { label: "혹시... 소랑 대화 가능하세요?", score: 5, reply: "...네? 소를 키우기는 하는데 대화는... 음... 시도는 해볼게요." }
                ]
            },
        ],
        
        yushi: [
            { text: "에.. 새로 오신 농장주님이시군요 ?", emotion: "default" },
            { text: "만나서 반가워요 !", emotion: "happy" },
            { 
                text: "숲이 참 조용하고 좋지요 ? ^_^", 
                emotion: "happy",
                choices: [
                    { label: "여기서 뭐하고 계세요?", score: 5, reply: "아무것도 하지 않아요 ! 사람이 없는 곳이 마음이 편해서요 ^_^" },
                    { label: "밤에 별 보면 예쁠 것 같아요", score: 10, reply: "맞아요 ! 종종 밤에 와서 하늘을 보는데 정말 예뻐요 ^_^ 다음에 같이 봐요 ~" }
                ]
            },
        ],

                jaehee: [
            { text: "안녕하세요!! 저는 재희라고 해요!", emotion: "default" },
            { 
                text: "인상이 정말 좋으시네요! ㅎㅎ", 
                emotion: "happy",
                choices: [
                    { label: "노래 한 곡 부탁해요", score: 10, reply: "아무것도 하지 않아요 ! 사람이 없는 곳이 마음이 편해서요 ^_^" },
                    { label: "반가워요 재희님", score: 5, reply: "맞아요 ! 종종 밤에 와서 하늘을 보는데 정말 예뻐요 ^_^ 다음에 같이 봐요 ~" }
                ]
            },
        ],

        ryo: [
            { text: "오, 안녕하세요! 저는 료입니다!", emotion: "default" },
            { 
                text: "마을에 신기한 거 찾으면 저한테 제일 먼저 보여주셔야 해요! 제가 분석해드릴게요!", 
                emotion: "happy",
                choices: [
                    { label: "같이 찾으러 갈래?", score: 10, reply: "아무것도 하지 않아요 ! 사람이 없는 곳이 마음이 편해서요 ^_^" },
                    { label: "료는 똑똑하구나", score: 5, reply: "맞아요 ! 종종 밤에 와서 하늘을 보는데 정말 예뻐요 ^_^ 다음에 같이 봐요 ~" }
                ]
            },
        ],

        sakuya: [
            { text: "에- 안녕하세요. 갓 구운 빵 드셔보실래요?", emotion: "default" },
            { 
                text: "아 저는 사쿠야예요. 스타주점 안에 있는 빵집에서 일하고 있어요. 빵 사러 마니 와주세요.", 
                emotion: "happy",
                choices: [
                    { label: "고마워! 잘 먹을게", score: 5, reply: "아무것도 하지 않아요 ! 사람이 없는 곳이 마음이 편해서요 ^_^" },
                    { label: "사쿠빵쨩ㅎㅎ", score: 10, reply: "맞아요 ! 종종 밤에 와서 하늘을 보는데 정말 예뻐요 ^_^ 다음에 같이 봐요 ~" }
                ]
            },
        ]
        
    },
    // 4일차 대사 (한 줄이어도 배열로 감싸는 것을 추천)
    4: {
        sion: [
            { text: "축제라 그런지 다들 즐거워 보여서 좋네요.", emotion: "happy" },
            { text: "일 생각은 잠시 잊어도 돼요 !", emotion: "happy" }
        ]
     }
    };
    

// ★ 기존 randomDialogues 삭제!
const affinityDialogues = {
    sion: {
        very_low: {
            "맑음": [
                [
                { text: "...", emotion: "default" },
                { text: "(가볍게 목례만 한다.)", emotion: "default" }
                ]
            ],
            "비": [
                { text: "비가 오네요.", emotion: "default" }
            ],
            "벚꽃": [
                { text: "산책 나오셨어요?", emotion: "default" },
                { text: "저는 할 일이 좀 남아서요. 먼저 가보세요.", emotion: "default" }
            ]
        },
        
        low: {
            "맑음": [
                [
                { text: "새로운 환경이라 낯설지 않으세요? 저도 처음엔 적응하는 데 시간이 좀 걸렸거든요.", emotion: "happy" },
                { text: "그래도 잘 지내시는 것 같아 다행이네요.", emotion: "default" }
                ],
                { 
                text: "혹시 마을회관 이용 수칙은 다 읽어보셨나요? 꼼꼼히 확인해주시는 게 좋아요.", 
                emotion: "happy",
                choices: [
                    { label: "헉, 있는 줄 몰랐어요. 지금 읽어볼게요!", score: 0, reply: "네. 궁금한 부분 있으면 알려드릴게요." },
                    { label: "네! 누가 쓴 건지 아주 완벽하던데요?", score: 5, reply: "아... 알아봐 주시니 감사하네요. 열심히 썼거든요." }
                ]
            },
                { 
                text: "농장 일은 처음이라 부족한 게 많을 텐데, 혹시 지금 가장 필요한 게 뭐예요?", 
                emotion: "shy",
                type: "keyword", // ★ 여기가 핵심! 키워드 입력 타입 지정
                answers: {
                    "선배님": { text: "ㅋㅋ저도 전문가는 아니지만... 팁 정도는 알려드릴 수 있어요.", emotion: "happy", score: 10 },
                    "도움": { text: "ㅋㅋ저도 전문가는 아니지만... 팁 정도는 알려드릴 수 있어요.", emotion: "happy", score: 10 },
                    "가르침": { text: "ㅋㅋ저도 전문가는 아니지만... 팁 정도는 알려드릴 수 있어요.", emotion: "happy", score: 10 },
                }
            }
                
            ],
            
            "비": [
                { text: "비가 오니 마을이 조용하네요. 빗소리 들으면서 업무 보는 것도 좋아요.", emotion: "default" },
                { text: "우산 쓰고 다니세요. 감기 걸리면 본인만 손해니까요.", emotion: "default" },
                { 
                text: "비 오는 날은 습기 때문에 책 관리가 까다로워요. 제습기라도 하나 더 놔야 하나...", 
                emotion: "happy",
                choices: [
                    { label: "제가 좀 도와드릴까요?", score: 5, reply: "어... 괜찮으시겠어요? 감사합니다. 다음에 커피라도 한 잔 살게요." },
                    { label: "에궁ㅠㅠ 수고가 많으시네요!", score: 0, reply: "뭘요. 제 일이니까 열심히 해야죠." }
                ]
            },
                { 
                text: "비가 계속 오니까 따뜻한 게 마시고 싶네요.", 
                emotion: "happy",
                choices: [
                    { label: "저도요. 아메리카노 먹고 싶어요!", score: 5, reply: "오, 저도 아메리카노 생각하고 있었어요. 커피 좋아하시는구나." },
                    { label: "저도요. 캐모마일차 먹고 싶어요!", score: 0, reply: "그렇구나. 상점에 차 종류가 꽤 많은데 보셨어요?" },
                    { label: "저도요. 핫초코 먹고 싶어요!", score: 3, reply: "ㅋㅋ다음에 료랑 같이 회관 놀러오세요. 핫초코 타드릴게요." }
                ]
            },
            ],
            
            "벚꽃": [
                [
                { text: "잠시 머리 좀 식히러 나왔어요. 회관에만 있으면 답답할 때가 있어서요.", emotion: "happy" },
                { text: "벚꽃 비가 정말 예쁘죠?", emotion: "default" }
                ],
                { 
                text: "(떨어지는 벚꽃잎을 잡으려다 놓친다) 아... 쉽지 않네요.", 
                emotion: "happy",
                choices: [
                    { label: "무슨 소원 비시려고요?ㅎㅎ", score: 3, reply: "음... 더 나은 사람이 되게 해달라고요." },
                    { label: "아 그거 그렇게 하는 거 아닌데", score: 0, reply: "네? 그럼 뭐 어떻게 해야하죠..." },
                    { label: "(벚꽃잎을 하나 잡아 건넨다.)", score: 5, reply: "어... 저 주시는 거예요? 감사합니다. {user} 님도 같이 소원 빌어요." }
                ]
            }
            ]
        },
        
        mid: { // 30~69점
            "맑음": [
                { text: "왔어요? 마침 심심했는데 잘됐다. 저랑 잠깐 농땡이... 아니, 휴식 좀 취할래요?", emotion: "happy" },
                { 
                text: "오늘따라 일이 손에 안 잡히네요. 자꾸 딴생각이 들어서.", 
                emotion: "happy",
                choices: [
                    { label: "무슨 생각 하는데요?", score: 3, reply: "음... 그냥 맛있는 거 먹고 싶다는 생각? 퀸아망에 아아라던가." },
                    { label: "어허. 집중력 부족.", score: 0, reply: "으... 팩트폭력 너무 아픈데요." },
                    { label: "그런 날은 그냥 푹 쉬거나 노는 것도 방법이에요!", score: 5, reply: "오... 이도저도 아닌 것보단 그게 낫겠네요. 근데 저랑 놀아주실 거예요?" }
                ]
                },
                { 
                text: "저 방금 스타주점 다녀왔는데 뭐 샀게요?", 
                emotion: "shy",
                type: "keyword", // ★ 여기가 핵심! 키워드 입력 타입 지정
                answers: {
                    "아메리카노": { text: "ㅎㅎ맞아요. 한 모금 드실래요?", emotion: "happy", score: 5 },
                    "아아": { text: "ㅎㅎ맞아요. 한 모금 드실래요?", emotion: "happy", score: 5 },
                    "커피": { text: "ㅎㅎ맞아요. 한 모금 드실래요?", emotion: "happy", score: 5 },
                }
            ],
            
            "비": [
                { text: "비 오니까 파전에 막걸... 아니, 따뜻한 커피 한 잔 하고 싶네요 ㅎㅎ", emotion: "happy" },
                { text: "...좀 전에 천둥칠 때 제 쪽 안 보셨죠? 못 봤다고 해주세요.", emotion: "happy" }
            ],
            
            "벚꽃": [
                { text: "옛날엔 여기서 숨바꼭질하고 놀았는데. 저 꽤 잘 숨어요. 찾아볼래요?", emotion: "happy" },
                { text: "어, 머리에 꽃잎 붙었다. ...가만히 있어봐요.", emotion: "happy" }
            ]
        },
        
        high: { // 70점 이상
            "맑음": [
                { text: "오늘은 왜 이렇게 늦게 왔어요? 시계만 쳐다보고 있었잖아요. ...농담이에요ㅎㅎ", emotion: "happy" },
                { text: "내일도 날씨 맑대요. 내일도... 회관 들러주실 거죠?", emotion: "love" }
            ],
            
            "비": [
                { text: "비 오는 날 당신이 곁에 있어 따뜻하네요.", emotion: "love" }
            ],
            
            "벚꽃": [
                { text: "이 아름다운 풍경보다 당신이 더 눈부셔요.", emotion: "love" }
            ]
        }
    },
    
    // 리쿠 예시 (나머지 멤버도 같은 구조로 추가)
    riku: {
        low: {
            "맑음": [{ text: "안냐세여!", emotion: "default" }],
            "비": [{ text: "비 시러여.. 축축해..", emotion: "sad" }],
            "벚꽃": [{ text: "분홍색 눈이 내려여!", emotion: "happy" }]
        },
        mid: {
            "맑음": [
                [
                    { text: "누나누나! 저기 봐바여!", emotion: "shock" },
                    { text: "개미가 지나가여!!", emotion: "happy" }
                ]
            ],
            "비": [{ text: "누나 우산 같이 써도 대여?", emotion: "shy" }],
            "벚꽃": [{ text: "누나 머리에 꽃잎 붙어써여! 헤헤", emotion: "happy" }]
        },
        high: {
            "맑음": [{ text: "누나! 리쿠가 세상에서 젤 조아해!!", emotion: "happy" }],
            "비": [{ text: "비 와도 누나랑 있으면 죠아!", emotion: "happy" }],
            "벚꽃": [{ text: "나랑 평생 꽃놀이 같이 가여 약속!", emotion: "happy" }]
        }
    }
    // 유우시, 재희, 료, 사쿠야도 위와 똑같은 구조(low/mid/high -> 맑음/비/벚꽃)로 만드시면 됩니다.
};

// ★ 2. 호감도 달성 이벤트 (특정 점수 도달 시 1회 발동)
const affinityEvents = {
    sion: [
        {
            id: "sion_event_30", // 이벤트 고유 ID
            threshold: 30,       // 발동 조건 호감도
            bg: "assets/images/backgrounds/forest.png", // 이벤트 배경 (원하는 이미지 경로)
            script: [
                { text: "(시온이 숲속에서 혼자 무언가를 보고 있다.)", emotion: "default" },
                { text: "아, 농장주님. 오셨군요.", emotion: "happy" },
                { text: "사실 여기서만 보이는 희귀한 꽃을 찾고 있었어요.", emotion: "default" },
                { text: "당신에게 보여주고 싶었거든요.", emotion: "happy" }
            ]
        }
    ],
    riku: [
        {
            id: "riku_event_50",
            threshold: 50,
            bg: "assets/images/backgrounds/shop.png",
            script: [
                { text: "누나! 이거 봐바여! 리쿠가 아꼈던 사탕인데 누나 줄게여!", emotion: "happy" },
                { text: "(리쿠의 소중한 사탕을 받았다...)", emotion: "default" }
            ]
        }
    ]
};

// 3. 장소 및 레시피 데이터
const locations = {
    farm: { name: "농장", bg: "assets/images/backgrounds/farm.png", items: ["수선화", "흙", "딸기"] },
    square: { name: "마을 광장", bg: "assets/images/backgrounds/square.png", items: ["수선화", "민들레", "리모컨", "에너지 드링크", "흙"] },
    forest: { name: "비밀의 숲", bg: "assets/images/backgrounds/forest.png", items: ["스타푸르트", "블루 재즈", "블롭피쉬", "딸기", "도토리", "흙"] },
    shop: { name: "피에르 상점", bg: "assets/images/backgrounds/shop.png", items: ["설탕", "치즈", "밀가루", "달걀"] },
    hall: { name: "마을 회관", bg: "assets/images/backgrounds/hall.png", items: ["에너지 드링크", "초코케이크", "흙"] },
    saloon: { name: "별빛 주점", bg: "assets/images/backgrounds/saloon.png", items: ["딸기 빵", "행운의 점심", "초코케이크", "커피"] }
};

const recipes = [
    { ingredients: ["밀가루", "달걀", "딸기", "설탕"], result: "핑크케이크" },
    { ingredients: ["수선화", "민들레", "블루 재즈"], result: "꽃다발" },
    { ingredients: ["스타푸르트", "커피"], result: "스타드롭커피" }
];

// 4. 아이템 정보 데이터 (이미지 경로 포함)
const itemData = {
    "수선화": { img: "assets/images/items/daffodil.png", desc: "봄에 피는 노란 꽃" }, //ㅎㅇ
    "민들레": { img: "assets/images/items/dandelion.png", desc: "후 불면 날아갈 것 같다" }, //ㅎㅇ
    "커피": { img: "assets/images/items/coffee.png", desc: "고소한 원두 향이 난다" }, //ㅎㅇ
    "블루 재즈": { img: "assets/images/items/bluejazz.png", desc: "동그란 모양의 푸른 꽃" }, //ㅎㅇ
    "치즈": { img: "assets/images/items/cheese.png", desc: "꼬릿꼬릿한 냄새가 난다" }, //ㅎㅇ
    "설탕": { img: "assets/images/items/Sugar.png", desc: "혈당 관리 해야하는데..." }, //ㅎㅇ
    "핑크케이크": { img: "assets/images/items/pink_cake.png", desc: "사랑스러운 핑크색 케이크" }, //ㅎㅇ
    "초코케이크": { img: "assets/images/items/chocolatecake.png", desc: "찐한 초콜릿 냄새가 난다" }, //ㅎㅇ
    "딸기": { img: "assets/images/items/Strawberry.png", desc: "뚜왈기!" }, //ㅎㅇ
    "행운의 점심": { img: "assets/images/items/luckylunch.png", desc: "행운이 올 것 같다!" }, //ㅎㅇ
    "밀가루": { img: "assets/images/items/Flour.png", desc: "제빵의 기본 재료" }, //ㅎㅇ
    "달걀": { img: "assets/images/items/egg.png", desc: "작고 소중한 달걀" }, //ㅎㅇ
    "흙": { img: "assets/images/items/Clay.png", desc: "흙이다" }, //ㅎㅇ
    "스타푸르트": { img: "assets/images/items/Starfruit.png", desc: "별 모양의 과일" }, //ㅎㅇ
    "스타드롭커피": { img: "assets/images/items/stardropcoffee.png", desc: "커피가 상큼할 수 있다니" }, //ㅎㅇ
    "리모컨": { img: "assets/images/items/remote.png", desc: "음...?" }, //ㅎㅇ
    "꽃다발": { img: "assets/images/items/bouquet.png", desc: "받으면 행복할 것 같다" }, //ㅎㅇ
    "블롭피쉬": { img: "assets/images/items/blobfish.png", desc: "오우..." }, //ㅎㅇ
    "도토리": { img: "assets/images/items/acorn.png", desc: "다람쥐가 좋아할 것 같다" }, //ㅎㅇ
    "에너지 드링크": { img: "assets/images/items/energytonic.png", desc: "피로가 싹 가신다" } //ㅎㅇ
};

// --- 5. 엔딩 스크립트 데이터 (순애 6명 + 양다리 1명) ---
const endingScripts = {
    sion: {
        title: "시온과의 따뜻한 티타임",
        image: "assets/images/portraits/sion_happy.png",
        text: "농장주님 덕분에 마을이 훨씬 더 활기차진 것 같아요.\n\n앞으로도 저와 함께 차 한 잔의 여유를 즐겨주시겠어요?\n당신과 함께라면 매일이 행복할 것 같습니다."
    },
    riku: {
        title: "리쿠의 영원한 단짝",
        image: "assets/images/portraits/riku_happy.png",
        text: "누나누나!! 이제 어디 가면 안 대여 알겟져?\n\n리쿠는 누나랑 평생~ 같이 놀 거야!\n약속 도장 꾹!! 헤헤, 사랑해여!!"
    },
    yushi: {
        title: "수줍은 고백",
        image: "assets/images/portraits/yushi_happy.png",
        text: "에.. 사실 처음 뵀을 때부터 농장주님이 신경 쓰였어요.\n\n제가 표현은 서툴지만.. 제 마음은 진심이에요.\n저의 곁에 있어 주시겠어요?"
    },
    jaehee: {
        title: "든든한 파트너",
        image: "assets/images/portraits/jaehee_happy.png",
        text: "허허, 농장주님만큼 저랑 잘 맞는 사람은 처음 봤습니다.\n\n우리 둘이 힘을 합치면 못 할 게 없겠죠.\n앞으로도 잘 부탁합니다, 나의 파트너."
    },
    ryo: {
        title: "최고의 콤비",
        image: "assets/images/portraits/ryo_happy.png",
        text: "야하~ 역시 누나가 최고야!\n\n나랑 같이 있으면 심심할 틈 없을걸?\n내가 매일매일 웃게 해 줄게! 진짜루!"
    },
    sakuya: {
        title: "달콤한 빵 냄새",
        image: "assets/images/portraits/sakuya_happy.png",
        text: "갓 구운 빵 냄새보다 농장주님이 더 좋은걸요?\n\n매일 아침 맛있는 빵과 함께 당신을 기다릴게요.\n저랑.. 사귀어 주실래요?"
    },
    // 양다리 엔딩 (호감도 높은 사람이 2명 이상일 때)
    cheater: {
        title: "위시 밸리의 카사노바",
        image: "assets/images/ui/star_icon.png", // 또는 경고 이미지
        text: "시온: 농장주님.. 저한테만 잘해주신 게 아니었나요?\n리쿠: 누나 미워!! 리쿠만 좋아한다구 해짜나!!\n\n모두의 마음을 얻으려다 결국 신뢰를 잃고 말았습니다...\n(Bad Ending?)"
    },
    // 노말 엔딩 (호감도 부족)
    normal: {
        title: "평화로운 귀농 생활",
        image: "assets/images/backgrounds/farm.png",
        text: "7일간의 체험이 끝났습니다.\n특별한 인연은 만들지 못했지만, 훌륭한 농장주가 되었습니다.\n\n- The End -"
    }
};

// [신규] 5일차 퀘스트 데이터 (편지 내용 + 요구 아이템 + 보상 대사)
const questScripts = {
    riku: {
        letter: "누나.. 리쿠는 쪼금 서운해여.. ㅠㅠ 나 '딸기'가 진짜 먹고 싶은데.. 구해줄 수 이써여?",
        item: "딸기", // 인벤토리의 아이템 이름과 정확히 일치해야 함
        success: { text: "와아!! 진짜 구해왔네?! 역시 누나밖에 없어! 사랑해!!", emotion: "love" }
    },
    sion: {
        letter: "안녕하세요, 농장주님. 실은 제가 '점토'가 꼭 필요한데.. 혹시 구해주실 수 있나요?",
        item: "점토",
        success: { text: "아, 이걸 정말 구해주셨군요. 당신의 성실함에 다시 한번 반했습니다.", emotion: "happy" }
    },
    yushi: {
        letter: "저기.. 혹시 '우유' 남는 거 있으세요? 요리 연습을 하고 싶은데 재료가 없어서요..",
        item: "우유",
        success: { text: "우와! 덕분에 맛있는 거 만들 수 있겠어요! 짱이다!", emotion: "happy" }
    },
    // 나머지 멤버들도 같은 형식으로 추가 (jaehee, ryo, sakuya 등)
};

/* ==========================================================================
   [추가] 이미지 업로드 및 Cropper.js 처리 로직
   ========================================================================== */

let currentCropper = null;
let currentMemberId = null;

// HTML이 모두 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    
    // 모달 관련 요소 가져오기
    const modal = document.getElementById('crop-modal');
    const imageToCrop = document.getElementById('image-to-crop');
    const btnCrop = document.getElementById('btn-crop');
    const btnCancel = document.getElementById('btn-cancel');

    // NPC 목록을 순회하며 이벤트 연결
    const members = Object.keys(npcs); 

    members.forEach(member => {
        const input = document.getElementById(`upload-${member}`);
        
        if (input) {
            input.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        // 1. 현재 어떤 멤버를 수정 중인지 저장
                        currentMemberId = member; 
                        
                        // 2. 모달 띄우기 (순서 중요: display가 none이면 크로퍼가 크기를 못 잡음)
                        if(modal) modal.style.display = 'flex';

// 3. 이미지 소스 설정
imageToCrop.src = event.target.result;

// 🔥 이미지 로드 보장 방식으로 변경
imageToCrop.addEventListener(
    'load',
    function handleLoad() {
        // 기존 크로퍼 초기화
        if (currentCropper) {
            currentCropper.destroy();
            currentCropper = null;
        }

        // 새 크로퍼 생성
        currentCropper = new Cropper(imageToCrop, {
            aspectRatio: 1,
            viewMode: 1,
            minContainerWidth: 300,
            minContainerHeight: 300,
            autoCropArea: 1
        });

        // ★ 한 번만 실행되게 제거
        imageToCrop.removeEventListener('load', handleLoad);
    },
    { once: true }
);
                    
                    reader.readAsDataURL(file);
                }
                // 같은 파일 다시 선택 가능하게 초기화
                e.target.value = ''; 
            });
        }
    });

    // [자르기 & 저장 버튼 클릭 시]
    if (btnCrop) {
        btnCrop.addEventListener('click', function() {
            if (currentCropper && currentMemberId) {
                // 자른 이미지를 Base64 데이터로 변환
                const croppedCanvas = currentCropper.getCroppedCanvas({
                    width: 200, // 게임 내 표시될 크기
                    height: 200
                });
                const croppedImage = croppedCanvas.toDataURL();

                // 1) 미리보기 이미지 업데이트
                const preview = document.getElementById(`preview-${currentMemberId}`);
                if (preview) preview.src = croppedImage;

                // 2) 게임 데이터(npcs) 업데이트 ★핵심★
                if (npcs[currentMemberId]) {
                    npcs[currentMemberId].portrait = croppedImage;
                    console.log(`${currentMemberId}의 초상화가 변경되었습니다.`);
                }

                // 3) 정리
                modal.style.display = 'none';
                currentCropper.destroy();
                currentCropper = null;
            }
        });
    }

    // [취소 버튼 클릭 시]
    if (btnCancel) {
        btnCancel.addEventListener('click', function() {
            if(modal) modal.style.display = 'none';
            if (currentCropper) {
                currentCropper.destroy();
                currentCropper = null;
            }
        });
    }
});















