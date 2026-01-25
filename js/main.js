/* ==========================================================================
   WISH VALLEY - Main Game Logic
   파일명: js/main.js
   설명: 게임의 핵심 로직(이동, UI, 상호작용, 아이템, 대화, 엔딩 등)을 담당합니다.
   ========================================================================== */

// --- 1. 게임 상태 데이터 (Game State) ---
let gameState = {
    day: 1, 
    energy: 4, 
    weather: '맑음', 
    currentLocation: 'farm',
    inventory: [], 
    affinities: { sion: 0, riku: 0, yushi: 0, jaehee: 0, ryo: 0, sakuya: 0 },
    hasGiftedToday: {}, // 오늘 선물 줬는지 체크 (NPC별)
    playerName: "농장주", // 플레이어 이름
    isEnding: false // 엔딩 진행 중인지 여부
};

// ★ [추가] 대화 끝난 후 멤버별 행동 묘사 (원하는 멘트로 수정하세요)
const npcActions = {
    sion: "(멍하니 하늘을 바라보고 있다...)",
    riku: "(무언가 골똘히 생각하는 듯하다.)",
    yushi: "(작게 콧노래를 흥얼거리고 있다.)",
    jaehee: "(가볍게 스트레칭을 하고 있다.)",
    ryo: "(먼 곳을 응시하고 있다.)",
    sakuya: "(주변을 두리번거리고 있다.)"
};

// --- 전역 변수 (Global Variables) ---
let dialogueQueue = []; // 대사 목록 큐
let currentDialogueIndex = 0; // 현재 대사 순서
let isTyping = false; // 타자 효과 진행 중?
let typingInterval = null; // 타자 효과 타이머
let currentFullText = ""; // 현재 출력 중인 전체 텍스트 (스킵용)
let lastInteractedNPC = null; // 마지막으로 대화한 NPC 키

let selectedSlotIndex = null; // 인벤토리에서 선택된 슬롯 번호
let selectedItems = []; // 조합을 위해 선택된 아이템들
let isDeleteMode = false; // 아이템 삭제 모드 여부
let currentPopupItem = null; // 현재 정보창에 띄운 아이템

// --- 오디오 설정 (Audio) ---
const sfx = {
    click: new Audio('assets/sounds/sfx/click.mp3'),
    success: new Audio('assets/sounds/sfx/success.mp3'),
    walk: new Audio('assets/sounds/sfx/footstep.mp3')
};
let currentBgm = null;

function playSfx(type) {
    // 오디오 파일이 없어도 에러가 안 나도록 처리
    if(sfx[type]) {
        sfx[type].currentTime = 0;
        sfx[type].play().catch(e => console.log("오디오 파일 없음: " + type));
    }
}

function changeBgm(fileName) {
    if (currentBgm) currentBgm.pause();
    currentBgm = new Audio(`assets/sounds/bgm/${fileName}`);
    currentBgm.loop = true;
    currentBgm.play().catch(e => console.log("BGM 파일 없음"));
}


/* ==========================================================================
   2. 게임 시작 및 오프닝 (Start & Intro)
   ========================================================================== */

// 페이지 로드 시 실행
window.onload = () => {
    console.log("게임 로드 완료! 오프닝 대기 중...");
    // 오프닝 화면이 HTML에 기본으로 보여지므로 별도 작업 필요 없음
};

// '시작하기' 버튼 -> 이름 입력창 표시
function showNameInput() {
    document.getElementById('menu-area').classList.add('hidden');
    document.getElementById('name-input-area').classList.remove('hidden');
    playSfx('click');
}

// '취소' 버튼 -> 다시 메뉴로
function hideNameInput() {
    document.getElementById('name-input-area').classList.add('hidden');
    document.getElementById('menu-area').classList.remove('hidden');
    playSfx('click');
}

// 진짜 게임 시작 (이름 저장 후 농장으로 이동)
function startGame() {
    const input = document.getElementById('player-name-input');
    const name = input.value.trim();

    if (name.length === 0) {
        alert("이름을 입력해주세요!");
        return;
    }

    gameState.playerName = name;
    playSfx('success');
    
    // 오프닝 화면 숨기고 게임 시작
    document.getElementById('intro-screen').classList.add('hidden');
    updateUI(); 
    move('farm'); // 첫 장소로 이동
}

// 설명서, 크레딧 팝업 열기/닫기
function openModal(id) {
    document.getElementById(id).classList.remove('hidden');
    playSfx('click');
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
    playSfx('click');
}


/* ==========================================================================
   3. 이동 시스템 (Movement)
   ========================================================================== */

function move(locId) {
    // 에너지가 없으면 이동 불가 (잠자기 유도)
    if (gameState.energy <= 0) { 
        alert("에너지가 부족합니다! 잠을 자야 해요."); 
        // 3번째 이동(에너지0) 직후라면 바로 알림바를 띄워줌
        showSleepAlert();
        return;
    }

    playSfx('walk');
    gameState.currentLocation = locId;
    
    // 에너지 차감
    gameState.energy--; 
    
    updateUI();
    renderLocation(); // 화면 갱신

    // 이동 횟수를 다 쓰면(에너지 0) 잠자기 알림바 표시
    if (gameState.energy === 0) {
        showSleepAlert();
    }
}

function renderLocation() {
    const loc = locations[gameState.currentLocation];
    const view = document.getElementById('location-view');
    view.style.backgroundImage = `url(${loc.bg})`;

    // 1. 아이템(채집물) 그리기
    const itemLayer = document.getElementById('item-layer');
    itemLayer.innerHTML = "";
    if (loc.items) {
        loc.items.forEach(itemName => {
            createItemElement(itemName);
        });
    }

    // 2. NPC 그리기
    const npcLayer = document.getElementById('npc-layer');
    npcLayer.innerHTML = "";
    
    for (let key in npcs) {
        const npc = npcs[key];
        // 날씨에 따라 NPC 위치 결정 (비 오면 rainy, 맑으면 sunny)
        const targetLoc = gameState.weather === '비' ? npc.locations.rainy : npc.locations.sunny;
        
        if (targetLoc === gameState.currentLocation) {
            const npcSprite = document.createElement('div');
            npcSprite.className = "npc-sprite"; 
            npcSprite.style.backgroundImage = `url(${npc.sprite})`; // 스프라이트 이미지
            
            // NPC 클릭 시 대화 시작
            npcSprite.onclick = () => openDialogue(key);
            npcLayer.appendChild(npcSprite);
        }
    }
}

// 채집물 생성 함수
function createItemElement(itemName) {
    const item = document.createElement('div');
    item.className = "collectible-item"; 

    // 화면 내 랜덤 위치 (10% ~ 90% 범위)
    item.style.left = Math.random() * 80 + 10 + "%";
    item.style.top = Math.random() * 50 + 30 + "%";

    // 아이템 이미지 적용
    if (itemData[itemName] && itemData[itemName].img) {
        item.style.backgroundImage = `url(${itemData[itemName].img})`;
        item.style.backgroundSize = "contain";
        item.style.backgroundRepeat = "no-repeat";
    } else {
        item.innerText = "?"; // 이미지 없으면 물음표
    }

    // 아이템 클릭 시 획득
    item.onclick = () => { 
        collectItem(itemName); 
        item.remove(); 
    };
    
    document.getElementById('item-layer').appendChild(item);
}


/* ==========================================================================
   4. 인벤토리 및 아이템 시스템 (Inventory & Items)
   ========================================================================== */

function collectItem(name) {
    if (gameState.inventory.length >= 8) { 
        alert("가방이 꽉 찼어요!"); 
        return; 
    }
    gameState.inventory.push(name);
    playSfx('success');
    updateUI(); // 하단 미니 인벤토리 갱신
}

// 인벤토리 팝업 열기/닫기
function toggleInventory() {
    const modal = document.getElementById('inventory-modal');
    
    // hidden 클래스 토글 (보였다 안 보였다)
    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
        // 열릴 때 초기화
        isDeleteMode = false;
        document.getElementById('delete-toggle-btn').classList.remove('active');
        selectedItems = []; 
        renderInventorySlots(); // 팝업 내부 슬롯 그리기
    } else {
        modal.classList.add('hidden');
    }
}

// 팝업 내부 슬롯 그리기 (핵심 기능)
function renderInventorySlots() {
    const grid = document.querySelector('.inventory-grid');
    grid.innerHTML = "";
    
    // 삭제 모드 스타일 적용
    if (isDeleteMode) grid.classList.add('delete-mode');
    else grid.classList.remove('delete-mode');

    // 슬롯 16개 생성 (큰 가방)
    for (let i = 0; i < 16; i++) {
        const slot = document.createElement('div');
        slot.className = "item-slot";
        
        const itemName = gameState.inventory[i];
        
        if (itemName) {
            // 이미지 표시
            if (itemData[itemName] && itemData[itemName].img) {
                const img = document.createElement('img');
                img.src = itemData[itemName].img;
                img.style.width = "100%"; 
                img.style.height = "100%";
                img.style.objectFit = "contain";
                slot.appendChild(img);
            } else {
                slot.innerText = itemName;
            }

            // 클릭 이벤트
            slot.onclick = () => {
                if (isDeleteMode) {
                    // 삭제 모드: 아이템 버리기
                    if (confirm(`정말 [${itemName}] 아이템을 버릴까요?`)) {
                        gameState.inventory.splice(i, 1);
                        playSfx('click');
                        renderInventorySlots();
                        updateUI();
                    }
                } else {
                    // 일반 모드: 정보창 보기 & 선택
                    showItemInfo(itemName);
                    // 하단바에서도 선택된 걸로 처리 (선물하기 연동)
                    selectSlot(i); 
                }
            };

            // 조합을 위해 선택된 아이템 표시
            if (!isDeleteMode && selectedItems.includes(itemName)) {
                slot.style.backgroundColor = "var(--pastel-pink)";
                slot.style.borderColor = "var(--deep-pink)";
            }

        } else {
            slot.style.cursor = "default"; // 빈 슬롯
        }
        
        grid.appendChild(slot);
    }
}

// 하단 미니 인벤토리 슬롯 선택
function selectSlot(index) {
    selectedSlotIndex = index;
    // 모든 슬롯 테두리 초기화
    document.querySelectorAll('.slot').forEach(s => s.style.borderColor = "var(--deep-green)");
    
    // 선택된 슬롯 노란색 강조
    const targetSlot = document.querySelectorAll('.slot')[index];
    if (targetSlot && gameState.inventory[index]) {
        targetSlot.style.borderColor = "yellow";
        playSfx('click');
    }
}

// 조합 기능
function combineItems() {
    if (selectedItems.length < 2) { 
        alert("재료를 2개 이상 선택해 주세요!"); 
        return; 
    }
    // 레시피 찾기
    const recipe = recipes.find(r => 
        r.ingredients.length === selectedItems.length &&
        r.ingredients.every(ing => selectedItems.includes(ing))
    );

    if (recipe) {
        playSfx('success');
        // 재료 삭제
        selectedItems.forEach(ing => {
            const idx = gameState.inventory.indexOf(ing);
            if (idx > -1) gameState.inventory.splice(idx, 1);
        });
        // 결과물 추가
        gameState.inventory.push(recipe.result);
        alert(`짠! [${recipe.result}]을(를) 만들었어요!`);
        
        // 초기화 및 UI 갱신
        selectedItems = [];
        renderInventorySlots();
        updateUI();
    } else { 
        alert("음.. 아무 일도 일어나지 않았습니다. (맞는 레시피가 없어요)"); 
        selectedItems = [];
        renderInventorySlots();
    }
}

// 아이템 정보 팝업
function showItemInfo(itemName) {
    currentPopupItem = itemName;
    const data = itemData[itemName];
    
    document.getElementById('info-name').innerText = itemName;
    document.getElementById('info-desc').innerText = data ? data.desc : "정보 없음";
    
    const img = document.getElementById('info-image');
    if (data && data.img) {
        img.src = data.img;
        img.style.display = 'block';
    } else {
        img.style.display = 'none';
    }

    document.getElementById('item-info-modal').classList.remove('hidden');
}

function closeItemInfo() {
    document.getElementById('item-info-modal').classList.add('hidden');
    currentPopupItem = null;
}

// 정보창에서 '조합 담기' 버튼 클릭 시
function selectForCombine() {
    if (!currentPopupItem) return;
    if (selectedItems.includes(currentPopupItem)) {
        alert("이미 담은 아이템입니다!");
    } else {
        selectedItems.push(currentPopupItem);
        renderInventorySlots(); // 선택 표시 갱신
    }
    closeItemInfo();
}

// 삭제 모드 토글
function toggleDeleteMode() {
    isDeleteMode = !isDeleteMode;
    const btn = document.getElementById('delete-toggle-btn');
    const grid = document.querySelector('.inventory-grid');
    
    if (isDeleteMode) {
        btn.classList.add('active'); // 버튼 스타일 변경 (CSS 필요)
        grid.classList.add('delete-mode');
        alert("버릴 아이템을 클릭하세요.");
    } else {
        btn.classList.remove('active');
        grid.classList.remove('delete-mode');
    }
}


/* ==========================================================================
   5. 대화 시스템 (Dialogue System)
   ========================================================================== */

// [교체] 대화창 열기 함수
function openDialogue(npcKey) {
    lastInteractedNPC = npcKey; 
    const overlay = document.getElementById('dialogue-overlay');
    overlay.classList.remove('hidden');
    
    // UI 요소 가져오기
    const inputArea = document.getElementById('input-area');
    const keywordInput = document.getElementById('keyword-input');
    const sendBtn = document.getElementById('send-btn');
    const giftBtn = document.getElementById('gift-btn');

    // 버튼 이벤트 연결 (기존 유지)
    if(giftBtn) giftBtn.onclick = () => giveGift(npcKey);
    if(sendBtn) sendBtn.onclick = () => sendKeyword(npcKey);

    // --- [핵심 로직 변경] ---
    
    // CASE 1: 오늘 이미 대화를 한 경우 (두 번째 클릭부터)
    if (gameState.hasTalkedToday[npcKey]) {
        // 1. 행동 묘사 텍스트 출력
        const actionText = npcActions[npcKey] || "(멍을 때리고 있다...)";
        
        // 큐 초기화하지 않고 바로 텍스트 출력 (타이핑 효과)
        dialogueQueue = [{ text: actionText, emotion: 'default' }];
        currentDialogueIndex = 0;
        showNextLine(npcKey);

        // 2. 입력창과 '말하기' 버튼 숨기기
        keywordInput.classList.add('hidden');
        sendBtn.classList.add('hidden');
        
        // 3. 선물 버튼 제어 (선물 안 줬으면 보이고, 줬으면 숨김)
        if (!gameState.hasGiftedToday[npcKey]) {
            inputArea.classList.remove('hidden'); // 부모 박스는 보여줌
            giftBtn.classList.remove('hidden');   // 선물 버튼 보임
        } else {
            inputArea.classList.add('hidden');    // 선물도 줬으면 박스 전체 숨김
        }

    } 
    // CASE 2: 오늘 첫 대화인 경우
    else {
        // 대화 했음 표시!
        gameState.hasTalkedToday[npcKey] = true;

        // 1. UI 전체 복구 (숨겼던 입력창들 다시 보이게)
        inputArea.classList.remove('hidden');
        keywordInput.classList.remove('hidden');
        sendBtn.classList.remove('hidden');
        giftBtn.classList.remove('hidden');

        // 2. 대사 데이터 가져오기 (랜덤 X, 순차적 or 하루 고정)
        let scriptData = null;
        
        // (1) 날짜별 고정 대사 우선
        if (dailyScripts[gameState.day] && dailyScripts[gameState.day][npcKey]) {
            scriptData = dailyScripts[gameState.day][npcKey];
        } 
        // (2) 고정 대사가 없다면 랜덤 대사 중 하나 가져오기
        else if (randomDialogues[npcKey]) {
            const weather = gameState.weather;
            const list = randomDialogues[npcKey][weather];
            if(list) {
                // ★ 여기서 랜덤으로 하나를 뽑아서 '고정'시킴
                // 하지만 요구사항은 "하루에 대사 하나만"이므로,
                // 이미 hasTalkedToday 체크를 했으니 매번 랜덤이어도 상관없음 
                // (어차피 하루에 한 번만 진입하니까요!)
                scriptData = list[Math.floor(Math.random() * list.length)];
            }
        }

        // 데이터 없으면 기본값
        if (!scriptData) scriptData = [{ text: "안녕하세요.", emotion: "default" }];
        if (!Array.isArray(scriptData)) scriptData = [scriptData];

        // 대화 시작
        dialogueQueue = scriptData;
        currentDialogueIndex = 0;
        showNextLine(npcKey);
    }
}

// 다음 대사 출력 (타이핑 효과)
function showNextLine(npcKey) {
    const npc = npcs[npcKey];
    const data = dialogueQueue[currentDialogueIndex];
    
    // 초상화 변경
    const portraitImg = document.getElementById('current-portrait');
    const emotion = data.emotion || 'default';
    portraitImg.src = npc.portraits[emotion] || npc.portraits['default'];

    // 텍스트 출력
    const textZone = document.getElementById('dialogue-text');
    let textContent = data.text.replace(/{user}/g, gameState.playerName);
    typeWriter(textContent, textZone);
}

// 타자 효과
function typeWriter(text, element, speed = 50) {
    let i = 0;
    element.innerHTML = "";
    isTyping = true;
    currentFullText = text;
    document.getElementById('next-cursor').classList.add('hidden'); 

    if (typingInterval) clearInterval(typingInterval);

    typingInterval = setInterval(() => {
        element.innerHTML += text.charAt(i);
        i++;
        if (i >= text.length) finishTyping();
    }, speed);
}

// 타자 효과 즉시 완료 (스킵)
function finishTyping() {
    clearInterval(typingInterval);
    isTyping = false;
    document.getElementById('dialogue-text').innerHTML = currentFullText;
    
    const currentData = dialogueQueue[currentDialogueIndex];
    
    if (currentData.choices) {
        renderChoices(currentData.choices); // 선택지 표시
    } else {
        document.getElementById('next-cursor').classList.remove('hidden'); // 커서 표시
    }
}

// 선택지 표시
function renderChoices(choices) {
    const choiceArea = document.getElementById('choice-area');
    choiceArea.innerHTML = "";
    choiceArea.classList.remove('hidden');

    choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = "choice-btn";
        btn.innerText = choice.label;
        
        btn.onclick = (e) => {
            e.stopPropagation();
            // 호감도 반영
            if (choice.score) gameState.affinities[lastInteractedNPC] += choice.score;
            
            // 답변 대사로 이어가기
            dialogueQueue = [{ 
                text: choice.reply, 
                emotion: choice.score > 0 ? "happy" : "shock" 
            }]; 
            currentDialogueIndex = 0;
            choiceArea.classList.add('hidden');
            showNextLine(lastInteractedNPC);
        };
        choiceArea.appendChild(btn);
    });
}

// 키워드 대화 기능
function sendKeyword(npcKey) {
    const input = document.getElementById('keyword-input').value;
    const keywordData = npcKeywords[npcKey];

    if (keywordData && keywordData[input]) {
        gameState.affinities[npcKey] += 10;
        dialogueQueue = Array.isArray(keywordData[input]) ? keywordData[input] : [keywordData[input]];
    } else {
        dialogueQueue = [{ text: "음.. 그게 무슨 말인지 잘 모르겠어요.", emotion: "shock" }];
    }
    
    document.getElementById('keyword-input').value = "";
    currentDialogueIndex = 0;
    document.getElementById('input-area').classList.add('hidden');
    showNextLine(npcKey);
}

// 선물하기 기능
function giveGift(npcKey) {
    if (selectedSlotIndex === null || !gameState.inventory[selectedSlotIndex]) {
        alert("먼저 인벤토리(가방)에서 줄 선물을 선택해주세요!");
        return;
    }
    if (gameState.hasGiftedToday[npcKey]) {
        alert("오늘은 이미 선물을 줬어요!");
        return;
    }

    const item = gameState.inventory[selectedSlotIndex];
    const npc = npcs[npcKey];
    
    let points = 5;
    let response = npc.giftReactions?.default || { text: "고마워요.", emotion: "default" };

    if (npc.gifts.love.includes(item)) {
        points = 20;
        if(npc.giftReactions?.love) response = npc.giftReactions.love;
    } else if (npc.gifts.hate.includes(item)) {
        points = -10;
        if(npc.giftReactions?.hate) response = npc.giftReactions.hate;
    }

    gameState.affinities[npcKey] += points;
    gameState.hasGiftedToday[npcKey] = true;
    
    // 아이템 제거
    gameState.inventory.splice(selectedSlotIndex, 1);
    selectedSlotIndex = null;

    displayDialogue(npcKey, response); // 반응 대사 출력
    updateUI();
    playSfx('success');
}

// 대화창 클릭 처리 (넘기기 / 닫기)
document.getElementById('dialogue-overlay').onclick = (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;

    if (isTyping) {
        finishTyping(); // 스킵
        return;
    }

    if (currentDialogueIndex < dialogueQueue.length - 1) {
        currentDialogueIndex++;
        showNextLine(lastInteractedNPC);
        return;
    }

    // 선택지가 있으면 닫지 않음
    if (dialogueQueue[currentDialogueIndex].choices) return;

    // 대화 종료
    if (!gameState.isEnding) {
        const inputArea = document.getElementById('input-area');
        
        // 입력창이 떠 있으면 -> 닫기
        if (!inputArea.classList.contains('hidden')) {
            document.getElementById('dialogue-overlay').classList.add('hidden');
            return;
        }

        // 입력창 보여주기 (대화 후 추가 행동 유도)
        document.getElementById('next-cursor').classList.add('hidden');
        inputArea.classList.remove('hidden');
        document.getElementById('dialogue-text').innerText = ""; 
    }
};

// 단순 대사 출력 (선물 반응 등)
function displayDialogue(npcKey, dialogueObj) {
    dialogueQueue = [dialogueObj];
    currentDialogueIndex = 0;
    
    // 입력창 숨기고 대사 출력 시작
    document.getElementById('input-area').classList.add('hidden');
    showNextLine(npcKey);
}


/* ==========================================================================
   6. 시간 및 UI 관리 (Time & UI)
   ========================================================================== */

function updateUI() {
    // 1. 날짜, 날씨, 에너지 업데이트
    document.getElementById('date-display').innerText = `Day ${gameState.day} - ${gameState.weather}`;
    
    let hearts = "";
    for(let i=0; i<gameState.energy; i++) hearts += "♥";
    for(let i=gameState.energy; i<3; i++) hearts += "♡"; // 최대 에너지 3 기준
    document.getElementById('energy-hearts').innerText = hearts;
    
    // 2. 하단 미니 인벤토리 슬롯 업데이트
    const slots = document.querySelectorAll('#inventory-slots .slot');
    slots.forEach((slot, index) => {
        slot.innerHTML = "";
        const itemName = gameState.inventory[index];
        
        if (itemName) {
            if (itemData[itemName] && itemData[itemName].img) {
                const img = document.createElement('img');
                img.src = itemData[itemName].img;
                img.style.width = "30px"; img.style.height = "30px";
                slot.appendChild(img);
            } else {
                slot.innerText = itemName;
            }
        }
        slot.style.borderColor = "var(--deep-green)"; // 초기화
    });

    // 선택된 슬롯 강조
    if (selectedSlotIndex !== null && slots[selectedSlotIndex]) {
        slots[selectedSlotIndex].style.borderColor = "yellow";
    }
}

// 잠자기 알림바 표시
function showSleepAlert() {
    document.getElementById('sleep-alert').classList.remove('hidden');
}

// 잠자기 버튼 -> 밤 화면(정산)으로
function goToSleep() {
    document.getElementById('sleep-alert').classList.add('hidden');
    
    const nightOverlay = document.getElementById('night-overlay');
    nightOverlay.classList.remove('hidden');
    
    // 정산 내용 표시 (예: 획득한 아이템 등)
    // const summary = document.getElementById('daily-summary');
    // summary.innerText = `오늘의 성과: ...`; 
}

// 다음 날 시작
function startNextDay() {
    // 7일차면 엔딩 체크
    if (gameState.day >= 7) { 
        checkEnding(); 
        return; 
    }
    
    gameState.day++;
    gameState.energy = 3; // 에너지 충전
    gameState.hasGiftedToday = {}; // 선물 기록 초기화
   // ★ [추가] 하루가 지났으니 기록 초기화
    gameState.hasGiftedToday = {}; 
    gameState.hasTalkedToday = {};
    
    // 날씨 랜덤 변경
    const weathers = ['맑음', '맑음', '비', '벚꽃'];
    gameState.weather = weathers[Math.floor(Math.random() * weathers.length)];
    
    document.getElementById('night-overlay').classList.add('hidden');
    updateUI(); 
    move('farm'); // 집(농장)에서 시작
}


/* ==========================================================================
   7. 엔딩 시스템 (Ending)
   ========================================================================== */

function checkEnding() {
    gameState.isEnding = true;
    document.getElementById('night-overlay').classList.add('hidden');
    document.getElementById('dialogue-overlay').classList.add('hidden');

    // 호감도 계산
    const sorted = Object.entries(gameState.affinities).sort((a, b) => b[1] - a[1]);
    const topNpcKey = sorted[0][0];
    const topScore = sorted[0][1];
    
    // 양다리 체크 (80점 이상이 2명 이상)
    const highAffinityCount = sorted.filter(item => item[1] >= 80).length;

    let endingData = null;

    if (highAffinityCount >= 2 && endingScripts.cheater) {
        endingData = endingScripts.cheater;
    } else if (topScore >= 80 && endingScripts[topNpcKey]) {
        endingData = endingScripts[topNpcKey];
    } else {
        endingData = endingScripts.normal; // 기본 엔딩
    }

    playEndingSequence(endingData);
}

function playEndingSequence(data) {
    if (!data) return;

    const overlay = document.getElementById('ending-overlay');
    const title = document.getElementById('ending-title');
    const img = document.getElementById('ending-image');
    const text = document.getElementById('ending-text');
    const btn = document.getElementById('restart-btn');

    title.innerText = data.title;
    if (data.image) img.src = data.image;
    text.innerText = ""; 

    overlay.classList.remove('hidden');

    // 2초 뒤 텍스트 출력
    setTimeout(() => {
        let i = 0;
        const fullText = data.text;
        const endingTyping = setInterval(() => {
            text.innerText += fullText.charAt(i);
            i++;
            if (i >= fullText.length) {
                clearInterval(endingTyping);
                setTimeout(() => { btn.classList.remove('hidden'); }, 1000);
            }
        }, 100);
    }, 2000);
}

