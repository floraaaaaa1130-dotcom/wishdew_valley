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
    hasTalkedToday: {}, // 오늘 대화했는지 체크 (NPC별)
    playerName: "농장주", // 플레이어 이름
    isEnding: false, // 엔딩 진행 중인지 여부
    // ★ [추가] 퀘스트 상태 저장 (target: 누구, item: 뭘 원하는지)
    activeQuest: null,
    seenEvents: [],       // 이미 본 이벤트 ID 저장
    isEventPlaying: false, // 현재 이벤트 진행 중인가?
    originalLoc: null,     // 이벤트 끝나고 돌아갈 원래 배경
       
   // ★ [추가] 이미 본 일반 대사의 첫 줄을 저장해둘 배열
    seenDialogues: []
};

// ★ [추가] 입력창(선물 버튼 등)을 현재 대사와 함께 띄울지 판단하는 변수
let shouldShowInput = false;

// ★ [추가] 대화 끝난 후 멤버별 행동 묘사
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
let currentEndingData = null;


// --- 오디오 설정 (Audio) ---
const sfx = {
    click: new Audio('assets/sounds/sfx/click.mp3'),
    success: new Audio('assets/sounds/sfx/success.mp3'),
    walk: new Audio('assets/sounds/sfx/footstep.mp3')
};
let currentBgm = null;

function playSfx(type) {
    if(sfx[type]) {
        sfx[type].currentTime = 0;
        sfx[type].play().catch(e => console.log("오디오 파일 없음: " + type));
    }
}

function changeBgm(FileName) {
    if (currentBgm) currentBgm.pause();
    currentBgm = new Audio(`assets/sounds/bgm/${FileName}`);
    currentBgm.loop = true;
   currentBgm.volume = 0.5;
   
    currentBgm.play().catch(e => console.log("BGM 파일 없음"));
}


/* ==========================================================================
   2. 게임 시작 및 오프닝 (Start & Intro)
   ========================================================================== */

window.onload = () => {
    console.log("게임 로드 완료! 오프닝 대기 중...");
};

function showNameInput() {
    document.getElementById('menu-area').classList.add('hidden');
    document.getElementById('name-input-area').classList.remove('hidden');
    playSfx('click');
}

function hideNameInput() {
    document.getElementById('name-input-area').classList.add('hidden');
    document.getElementById('menu-area').classList.remove('hidden');
    playSfx('click');
}

const setupOrder = ['sion', 'riku', 'yushi', 'jaehee', 'ryo', 'sakuya'];
let currentSetupIndex = 0;

function startGame() {
    const input = document.getElementById('player-name-input');
    const name = input.value.trim();

   changeBgm("wishbgm.mp3");

    if (name.length === 0) {
        alert("이름을 입력해주세요!");
        return;
    }

    gameState.playerName = name;
    playSfx('success');
    
    // 1. 이름 입력창 숨기기
    document.getElementById('name-input-area').classList.add('hidden');

    // ★ [추가] 로고 이미지 숨기기 (공간 확보)
    // (index.html에 있는 로고 이미지 태그를 찾아서 숨깁니다. ID가 없으면 img 태그를 찾습니다)
    const logo = document.querySelector('img[src*="logo.png"]');
    if (logo) logo.style.display = 'none';
    
    // 2. 사진 설정 화면 보여주기
    document.getElementById('portrait-setup').style.display = 'block';
    
    // 3. 첫 번째 멤버(시온)부터 시작하도록 초기화
    currentSetupIndex = 0;
    updateSetupUI();
}

// [신규] 다음 멤버로 넘어가는 함수
function nextMemberStep() {
    playSfx('click');

    // 현재 인덱스 증가
    currentSetupIndex++;

    // 모든 멤버 설정이 끝났으면 게임 시작
    if (currentSetupIndex >= setupOrder.length) {
        enterGame();
    } else {
        // 아니면 다음 멤버 보여주기
        updateSetupUI();
    }
}

// [신규] 현재 순서에 맞는 멤버만 화면에 보여주는 함수
function updateSetupUI() {
    // 1. 모든 단계 숨기기
    setupOrder.forEach(member => {
        document.getElementById(`step-${member}`).style.display = 'none';
    });

    // 2. 현재 멤버만 보여주기
    const currentMember = setupOrder[currentSetupIndex];
    document.getElementById(`step-${currentMember}`).style.display = 'block';

    // 3. 타이틀 업데이트 (1/6 -> 2/6 ...)
    document.getElementById('setup-title').innerText = `멤버 사진 설정 (${currentSetupIndex + 1}/${setupOrder.length})`;

    // 4. 마지막 멤버(사쿠야)일 경우 버튼 텍스트 변경
    const btn = document.getElementById('next-step-btn');
    if (currentSetupIndex === setupOrder.length - 1) {
        btn.innerText = "설정 완료 & 게임 시작!";
        btn.style.backgroundColor = "#ff9999"; // 마지막 버튼은 색 다르게
    } else {
        btn.innerText = "다음 멤버 설정 >";
        btn.style.backgroundColor = "var(--deep-green)";
    }
}

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
    if (gameState.energy <= 0) { 
        showAlert("에너지가 부족합니다! 잠을 자야 해요."); 
        showSleepAlert();
        return;
    }

    playSfx('walk');
    gameState.currentLocation = locId;
    gameState.energy--; 
    
    updateUI();
    renderLocation(); 

    if (gameState.energy === 0) {
        showSleepAlert();
    }
}

function renderLocation() {
    const loc = locations[gameState.currentLocation];
    const view = document.getElementById('location-view');
    view.style.backgroundImage = `url(${loc.bg})`;
   
    view.classList.remove('weather-rain', 'weather-blossom'); // 기존 효과 제거
    
    if (gameState.weather === '비') {
        view.classList.add('weather-rain');
    } else if (gameState.weather === '벚꽃') {
        view.classList.add('weather-blossom');
    }

   // 1. 아이템(채집물) 그리기 - [수정됨: 랜덤 3개만]
    const itemLayer = document.getElementById('item-layer');
    itemLayer.innerHTML = "";
    
    if (loc.items && loc.items.length > 0) {
        
        // ★ [수정됨] 날짜와 확률 필터링 로직 시작
        const validItems = loc.items.filter(item => {
            // (1) 그냥 글자("수선화")로 적힌 경우 -> 무조건 통과
            if (typeof item === 'string') return true;

            // (2) 날짜(days) 조건이 있는데, 오늘 날짜가 아니라면 -> 탈락
            if (item.days && !item.days.includes(gameState.day)) return false;

            // (3) 확률(chance) 조건이 있는데, 랜덤 돌려서 실패하면 -> 탈락
            // Math.random()은 0~1 사이 랜덤 숫자. chance보다 크면 꽝!
            if (item.chance !== undefined && Math.random() > item.chance) return false;

            return true;
        });
        // ★ 필터링 로직 끝

        // (1) 남은 아이템들을 섞는다 (Shuffle)
        const shuffled = [...validItems].sort(() => Math.random() - 0.5);
        
        // (2) 그 중에서 최대 3개만 뽑는다
        const selectedItems = shuffled.slice(0, 3);

        // (3) 화면에 뿌린다
        selectedItems.forEach(itemEntry => {
            // 객체({id: "..."})면 id를 쓰고, 문자열이면 그대로 씀
            const itemName = typeof itemEntry === 'string' ? itemEntry : itemEntry.id;
            createItemElement(itemName);
        });
    }
   
    const npcLayer = document.getElementById('npc-layer');
    npcLayer.innerHTML = "";
    
    for (let key in npcs) {
        const npc = npcs[key];
        // 날씨에 따른 등장 장소 확인
        let targetLoc = npc.locations.sunny; // 기본값 (맑음)
        if (gameState.weather === '비') {
            targetLoc = npc.locations.rainy;
        } else if (gameState.weather === '벚꽃') {
            targetLoc = npc.locations.blossom; // 🌸 벚꽃 장소 설정 사용
        }
        
        // 현재 장소에 있는 NPC라면?
        if (targetLoc === gameState.currentLocation) {
            const npcSprite = document.createElement('div');
            npcSprite.className = "npc-sprite"; 
            npcSprite.style.backgroundImage = `url(${npc.sprite})`; 
            npcSprite.onclick = () => openDialogue(key);

            // ★ [추가된 부분] 좌표 데이터가 있으면 적용, 없으면 중앙(50%, 50%)
            if (npc.positions && npc.positions[targetLoc]) {
                npcSprite.style.top = npc.positions[targetLoc].top;
                npcSprite.style.left = npc.positions[targetLoc].left;
            } else {
                // 좌표 안 적었으면 기본값 중앙
                npcSprite.style.top = "50%";
                npcSprite.style.left = "50%";
            }

            npcLayer.appendChild(npcSprite);
        }
    }
}

function createItemElement(itemName) {
    const item = document.createElement('div');
    item.className = "collectible-item"; 
    item.style.left = Math.random() * 80 + 10 + "%";
    item.style.top = Math.random() * 50 + 30 + "%";

    if (itemData[itemName] && itemData[itemName].img) {
        item.style.backgroundImage = `url(${itemData[itemName].img})`;
        item.style.backgroundSize = "contain";
        item.style.backgroundRepeat = "no-repeat";
    } else {
        item.innerText = "?"; 
    }

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
        showAlert("가방이 꽉 찼어요!"); 
        return; 
    }
    gameState.inventory.push(name);
    playSfx('success');
    updateUI(); 
}

function toggleInventory() {
    const modal = document.getElementById('inventory-modal');
    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
        isDeleteMode = false;
        document.getElementById('delete-toggle-btn').classList.remove('active');
        selectedItems = []; 
        renderInventorySlots(); 
    } else {
        modal.classList.add('hidden');
    }
}

function renderInventorySlots() {
    const grid = document.querySelector('.inventory-grid');
    grid.innerHTML = "";
    
    if (isDeleteMode) grid.classList.add('delete-mode');
    else grid.classList.remove('delete-mode');

    for (let i = 0; i < 8; i++) {
        const slot = document.createElement('div');
        slot.className = "item-slot";
        const itemName = gameState.inventory[i];
        
        if (itemName) {
            if (itemData[itemName] && itemData[itemName].img) {
                const img = document.createElement('img');
                img.src = itemData[itemName].img;
                img.style.width = "100%"; img.style.height = "100%";
                img.style.objectFit = "contain";
                slot.appendChild(img);
            } else {
                slot.innerText = itemName;
            }

            slot.onclick = () => {
                if (isDeleteMode) {
                    if (confirm(`정말 [${itemName}] 아이템을 버릴까요?`)) {
                        gameState.inventory.splice(i, 1);
                        playSfx('click');
                        renderInventorySlots();
                        updateUI();
                    }
                } else {
                    showItemInfo(itemName);
                    selectSlot(i); 
                }
            };

            if (!isDeleteMode && selectedItems.includes(itemName)) {
                slot.style.backgroundColor = "var(--pastel-pink)";
                slot.style.borderColor = "var(--deep-pink)";
            }

        } else {
            slot.style.cursor = "default";
        }
        grid.appendChild(slot);
    }
}

function selectSlot(index) {
    selectedSlotIndex = index;
    document.querySelectorAll('.slot').forEach(s => s.style.borderColor = "var(--deep-green)");
    const targetSlot = document.querySelectorAll('.slot')[index];
    if (targetSlot && gameState.inventory[index]) {
        targetSlot.style.borderColor = "yellow";
        playSfx('click');
    }
}

function combineItems() {
    if (selectedItems.length < 2) { 
        showAlert("재료를 2개 이상 선택해 주세요!"); 
        return; 
    }
    const recipe = recipes.find(r => 
        r.ingredients.length === selectedItems.length &&
        r.ingredients.every(ing => selectedItems.includes(ing))
    );

    if (recipe) {
        playSfx('success');
        selectedItems.forEach(ing => {
            const idx = gameState.inventory.indexOf(ing);
            if (idx > -1) gameState.inventory.splice(idx, 1);
        });
        gameState.inventory.push(recipe.result);
        showAlert(`짠! [${recipe.result}]을(를) 만들었어요!`);
        selectedItems = [];
        renderInventorySlots();
        updateUI();
    } else { 
        showAlert("음.. 아무 일도 일어나지 않았습니다."); 
        selectedItems = [];
        renderInventorySlots();
    }
}

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

function selectForCombine() {
    if (!currentPopupItem) return;
    if (selectedItems.includes(currentPopupItem)) {
        showAlert("이미 담은 아이템입니다!");
    } else {
        selectedItems.push(currentPopupItem);
        renderInventorySlots(); 
    }
    closeItemInfo();
}

function toggleDeleteMode() {
    isDeleteMode = !isDeleteMode;
    const btn = document.getElementById('delete-toggle-btn');
    const grid = document.querySelector('.inventory-grid');
    if (isDeleteMode) {
        btn.classList.add('active');
        grid.classList.add('delete-mode');
        showAlert("버릴 아이템을 클릭하세요.");
    } else {
        btn.classList.remove('active');
        grid.classList.remove('delete-mode');
    }
}


/* ==========================================================================
   5. 대화 시스템 (Dialogue System)
   ========================================================================== */

// [교체] 대화창 열기 함수 (로직 단순화)
function openDialogue(npcKey) {
    lastInteractedNPC = npcKey;
    const overlay = document.getElementById('dialogue-overlay');

    // UI 및 버튼 초기화
    shouldShowInput = false;
    document.getElementById('input-area').classList.add('hidden');
    document.getElementById('choice-area').classList.add('hidden');

    const giftBtn = document.getElementById('gift-btn');
    const sendBtn = document.getElementById('send-btn');
    if(giftBtn) giftBtn.onclick = () => giveGift(npcKey);
    if(sendBtn) sendBtn.onclick = () => sendKeyword(npcKey);

    // ---------------------------------------------
    // [CASE 1] 오늘 이미 대화를 한 경우
    // ---------------------------------------------
    if (gameState.hasTalkedToday[npcKey]) {
        overlay.classList.remove('hidden');
        const actionText = npcActions[npcKey] || "(멍을 때리고 있다...)";
        dialogueQueue = [{ text: actionText, emotion: 'default' }];
        currentDialogueIndex = 0;

        // 선물 아직 안 줬으면 버튼 보이기 예약
        if (!gameState.hasGiftedToday[npcKey]) {
            shouldShowInput = true;
        }
        showNextLine(npcKey);
        return;
    }

    // ---------------------------------------------
    // [CASE 2] 오늘 첫 대화 (스토리 vs 이벤트 vs 랜덤)
    // ---------------------------------------------
    gameState.hasTalkedToday[npcKey] = true;
    shouldShowInput = false;

    // ★ [1순위] 날짜별 고정 스토리 (dailyScripts) 확인 - 이걸 꼭 넣어야 함!
    if (dailyScripts[gameState.day] && dailyScripts[gameState.day][npcKey]) {
        overlay.classList.remove('hidden');
        let scriptData = dailyScripts[gameState.day][npcKey];
        if (!Array.isArray(scriptData)) scriptData = [scriptData];
        
        dialogueQueue = scriptData;
        currentDialogueIndex = 0;
        showNextLine(npcKey);
        return;
    }

    // ★ [2순위] 호감도 이벤트 (affinityEvents) 확인
    const currentAffinity = gameState.affinities[npcKey];
    if (typeof affinityEvents !== 'undefined' && affinityEvents[npcKey]) {
        const events = affinityEvents[npcKey];
        // 조건: 호감도 달성 AND 아직 안 본 이벤트
        const targetEvent = events.find(e => 
            currentAffinity >= e.threshold && 
            gameState.seenEvents && !gameState.seenEvents.includes(e.id)
        );

        if (targetEvent) {
            // 이벤트 트리거 (overlay는 triggerEvent 함수 안에서 페이드 효과와 함께 켜짐)
            triggerEvent(targetEvent);
            return;
        }
    }

    // ★ [3순위] 호감도별 랜덤 대사 (affinityDialogues)
    overlay.classList.remove('hidden');

    // (1) 호감도 단계 판단
    let stage = 'very_low'; // 기본값 (0~10점 구간)

    if (currentAffinity >= 70) stage = 'high';       // 70점 이상
    else if (currentAffinity >= 30) stage = 'mid';   // 30~69점
    else if (currentAffinity > 10) stage = 'low';    // 11~29점 (10점 초과)
    // (2) 날씨 확인
    const weather = gameState.weather;

    // (3) 대사 풀 가져오기
    let pool = [];
    if (affinityDialogues[npcKey] && 
        affinityDialogues[npcKey][stage] && 
        affinityDialogues[npcKey][stage][weather]) {
        pool = affinityDialogues[npcKey][stage][weather];
    }

    // (4) 데이터가 없으면 기본값
    if (!pool || pool.length === 0) {
        pool = [{ text: "안녕하세요.", emotion: "default" }];
    }

// (5) 랜덤 뽑기 (★ 중복 방지 로직 적용)
    
    // 안 본 대사만 걸러내기 (대사의 첫 줄 텍스트를 기준으로 확인)
    let unseenPool = pool.filter(dialogue => {
        const firstLineText = Array.isArray(dialogue) ? dialogue[0].text : dialogue.text;
        return !gameState.seenDialogues.includes(firstLineText);
    });

    // 만약 현재 조건(날씨+호감도)의 모든 대사를 이미 다 봤다면? 
    // 에러를 막기 위해 다시 전체 대사 풀에서 뽑도록 되돌림
    if (unseenPool.length === 0) {
        unseenPool = pool; 
    }

    // 안 본 대사 풀(unseenPool) 안에서 랜덤으로 하나 뽑기
    const randomPick = unseenPool[Math.floor(Math.random() * unseenPool.length)];

    // 방금 뽑힌 대사를 '본 대사' 목록에 등록하기
    const pickedText = Array.isArray(randomPick) ? randomPick[0].text : randomPick.text;
    if (!gameState.seenDialogues.includes(pickedText)) {
        gameState.seenDialogues.push(pickedText);
    }

    // 대기열에 넣기
    if (Array.isArray(randomPick)) {
        dialogueQueue = randomPick;
    } else {
        dialogueQueue = [randomPick];
    }
   
    currentDialogueIndex = 0;
    showNextLine(npcKey);
}

function showNextLine(npcKey) {
    const data = dialogueQueue[currentDialogueIndex];
    const portraitDiv = document.getElementById('dialogue-portrait');
    const portraitImg = document.getElementById('current-portrait');
   
    if (npcs[npcKey]) { 
        portraitDiv.style.display = 'block'; 
        const npc = npcs[npcKey];
        // const emotion = data.emotion || 'default';
        // portraitImg.src = npc.portraits[emotion] || npc.portraits['default'];
       portraitImg.src = npc.portrait;
    } else {
        portraitDiv.style.display = 'none'; 
    }
   
    const textZone = document.getElementById('dialogue-text');
    let textContent = data.text.replace(/{user}/g, gameState.playerName);
    typeWriter(textContent, textZone);
}

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

// [수정] 타자 효과 종료 후 처리 (화면 구성 결정)
function finishTyping() {
    clearInterval(typingInterval);
    isTyping = false;
    document.getElementById('dialogue-text').innerHTML = currentFullText;
    
    const currentData = dialogueQueue[currentDialogueIndex];
    const inputArea = document.getElementById('input-area');
    const choiceArea = document.getElementById('choice-area');
    const nextCursor = document.getElementById('next-cursor');
    
    const keywordInput = document.getElementById('keyword-input');
    const sendBtn = document.getElementById('send-btn');
    const giftBtn = document.getElementById('gift-btn');

    // UI 초기화
    inputArea.classList.add('hidden');
    choiceArea.classList.add('hidden');
    nextCursor.classList.add('hidden');

    // --- [1] 선택지형 대사 ---
    if (currentData.choices) {
        renderChoices(currentData.choices);
    } 
    // --- [2] 키워드 입력형 대사 ---
    else if (currentData.type === "keyword") {
        inputArea.classList.remove('hidden'); 
        
        // ★ [문제 해결 4] 키워드 입력 때는 선물 버튼 숨기기
        keywordInput.classList.remove('hidden');
        sendBtn.classList.remove('hidden');
        giftBtn.classList.add('hidden'); // 선물 버튼 숨김
        
        keywordInput.value = ""; 
        keywordInput.placeholder = "답변을 입력하세요...";
        
        sendBtn.onclick = () => checkKeywordAnswer(currentData);
    }
    // --- [3] 일반 대사 / 행동 묘사 ---
    else {
        // 다음 화살표 표시
        nextCursor.classList.remove('hidden');

        // ★ [문제 해결 2] 행동 묘사(이미 대화함) 상황이면 바로 선물 버튼 띄우기
        if (shouldShowInput && !gameState.isEnding) {
            inputArea.classList.remove('hidden');
            
            // 선물 버튼만 보이고 나머지는 숨김
            keywordInput.classList.add('hidden');
            sendBtn.classList.add('hidden');
            giftBtn.classList.remove('hidden');
        }
    }
}

/* main.js 파일의 renderChoices 함수를 이걸로 덮어쓰세요 */
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
            
            // 점수 반영
            if (choice.score) gameState.affinities[lastInteractedNPC] += choice.score;
            
            let newQueue = [];

            // ★ [수정 핵심] 데이터 타입에 따라 다르게 처리
            if (Array.isArray(choice.reply)) {
                // 배열인 경우 (여러 줄 대사)
                newQueue = choice.reply.map(line => {
                    // 이미 {text: "...", emotion: "..."} 형태라면 그대로 사용
                    if (typeof line === 'object' && line.text) {
                        return line;
                    }
                    // 단순 문자열 "안녕" 형태라면 객체로 변환
                    return {
                        text: line,
                        emotion: choice.score > 0 ? "happy" : "shock"
                    };
                });
            } else {
                // 단일 대사인 경우
                if (typeof choice.reply === 'object' && choice.reply.text) {
                    newQueue = [choice.reply];
                } else {
                    newQueue = [{ 
                        text: choice.reply, 
                        emotion: choice.score > 0 ? "happy" : "shock" 
                    }]; 
                }
            }

            // 대사 큐 교체 및 진행
            dialogueQueue = newQueue;
            currentDialogueIndex = 0;
            choiceArea.classList.add('hidden');
            showNextLine(lastInteractedNPC);
        };
        choiceArea.appendChild(btn);
    });
}
function checkKeywordAnswer(currentData) {
    const inputVal = document.getElementById('keyword-input').value.trim();
    if (!inputVal) return; 

    let reaction = null;

    // 1. 키워드 매칭 확인
    for (let key in currentData.answers) {
        if (key !== "default" && inputVal.includes(key)) {
            reaction = currentData.answers[key];
            break;
        }
    }

    // 2. 매칭된 게 없으면? -> 멤버별 전용 모르쇠 대사 가져오기
    if (!reaction) {
        const npc = npcs[lastInteractedNPC];
        if (npc && npc.unknownReaction) {
            reaction = npc.unknownReaction;
        } else {
            // 혹시 데이터가 없으면 기본 대사
            reaction = { text: "무슨 말인지 잘 모르겠어요.", emotion: "default" };
        }
    }

    if (reaction.score) {
        gameState.affinities[lastInteractedNPC] += reaction.score;
    }

    dialogueQueue = [reaction];
    currentDialogueIndex = 0;

    document.getElementById('input-area').classList.add('hidden');
    showNextLine(lastInteractedNPC);
}

function giveGift(npcKey) {
    if (selectedSlotIndex === null || !gameState.inventory[selectedSlotIndex]) {
        showAlert("먼저 인벤토리(가방)에서 줄 선물을 선택해주세요!");
        return;
    }
    if (gameState.hasGiftedToday[npcKey]) {
        showAlert("오늘은 이미 선물을 줬어요!");
        return;
    }

    const item = gameState.inventory[selectedSlotIndex];
    const npc = npcs[npcKey];

    if (gameState.activeQuest && 
        gameState.activeQuest.target === npcKey && 
        gameState.activeQuest.item === item) {
        
        gameState.affinities[npcKey] += 50; 
        gameState.hasGiftedToday[npcKey] = true;
        gameState.inventory.splice(selectedSlotIndex, 1);
        selectedSlotIndex = null;
        
        // 선물 줬으니 버튼 숨김 모드로 전환
        shouldShowInput = false;

        const successDialogue = questScripts[npcKey].success;
        displayDialogue(npcKey, successDialogue);
        gameState.activeQuest = null;
        updateUI();
        playSfx('success');
        return; 
    }
    
    let points = 5;
    let response = npc.giftReactions?.default || { text: "고마워요.", emotion: "default" };

    // 1. 최고(Best) 선물인지 확인
    if (npc.gifts.best === item) {
        points = 15; // ★ 점수 대박 (원하는 만큼 조절)
        if (npc.giftReactions?.best) response = npc.giftReactions.best;
    } 
    // 2. 좋아하는(Love) 선물인지 확인
    else if (npc.gifts.love.includes(item)) {
        points = 7;
        if (npc.giftReactions?.love) response = npc.giftReactions.love;
    } 
    // 3. 싫어하는(Hate) 선물인지 확인
    else if (npc.gifts.hate.includes(item)) {
        points = -10;
        if (npc.giftReactions?.hate) response = npc.giftReactions.hate;
    }
    gameState.affinities[npcKey] += points;
    gameState.hasGiftedToday[npcKey] = true;
    gameState.inventory.splice(selectedSlotIndex, 1);
    selectedSlotIndex = null;

    // 선물 줬으니 버튼 숨김 모드로 전환
    shouldShowInput = false;

    displayDialogue(npcKey, response); 
    updateUI();
    playSfx('success');
}

// [수정] 대화창 클릭 처리
document.getElementById('dialogue-overlay').onclick = (e) => {
    // 버튼, 입력창 클릭은 무시
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;

    if (isTyping) {
        finishTyping(); 
        return;
    }

    const currentData = dialogueQueue[currentDialogueIndex];
    if (currentData.choices || currentData.type === "keyword") return;

    // 다음 대사가 있으면 진행
    if (currentDialogueIndex < dialogueQueue.length - 1) {
        currentDialogueIndex++;
        showNextLine(lastInteractedNPC);
        return;
    }

    // --- [대화 종료 시점] ---

    if (gameState.isEnding) {
        showFinalPopup();
        return;
    }

    // ★ [수정됨] 이벤트 중이었다면 endEvent() 호출, 아니면 그냥 닫기
    if (gameState.isEventPlaying) {
        endEvent(); 
    } else {
        document.getElementById('dialogue-overlay').classList.add('hidden');
    }
};

/* js/main.js 파일의 맨 아래쪽에 있는 displayDialogue 함수를 이걸로 덮어쓰세요 */
function displayDialogue(npcKey, dialogueObj) {
    // ★ [수정됨] 들어온 데이터가 배열(여러 개)이면 그대로 쓰고, 한 개면 배열로 감싸기
    if (Array.isArray(dialogueObj)) {
        dialogueQueue = dialogueObj;
    } else {
        dialogueQueue = [dialogueObj];
    }
    
    currentDialogueIndex = 0;
    document.getElementById('input-area').classList.add('hidden');
    showNextLine(npcKey);
}


/* ==========================================================================
   6. 시간 및 UI 관리 (Time & UI)
   ========================================================================== */

function updateUI() {
    document.getElementById('date-display').innerText = `Day ${gameState.day} - ${gameState.weather}`;
    
    let hearts = "";
    for(let i=0; i<gameState.energy; i++) hearts += "♥";
    for(let i=gameState.energy; i<3; i++) hearts += "♡"; 
    document.getElementById('energy-hearts').innerText = hearts;
    
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
        slot.style.borderColor = "var(--deep-green)"; 
    });

    if (selectedSlotIndex !== null && slots[selectedSlotIndex]) {
        slots[selectedSlotIndex].style.borderColor = "yellow";
    }
}

function showSleepAlert() {
    document.getElementById('sleep-alert').classList.remove('hidden');
}

function goToSleep() {
    document.getElementById('sleep-alert').classList.add('hidden');
    const nightOverlay = document.getElementById('night-overlay');
    nightOverlay.classList.remove('hidden');
}

function startNextDay() {
    if (gameState.day >= 10) { 
        checkEnding(); 
        return; 
    }
    
    gameState.day++;
    gameState.energy = 4; 
    gameState.hasGiftedToday = {}; 
    gameState.hasTalkedToday = {};
    
    const weathers = ['맑음', '맑음', '비', '벚꽃'];
    gameState.weather = weathers[Math.floor(Math.random() * weathers.length)];
    
    document.getElementById('night-overlay').classList.add('hidden');
    updateUI(); 
    move('farm'); 

    if (gameState.day === 5) {
        triggerDay5Quest();
    }
}

function triggerDay5Quest() {
    const sorted = Object.entries(gameState.affinities).sort((a, b) => b[1] - a[1]);
    let targetEntry = sorted[1] ? sorted[1] : sorted[0];
    if (!targetEntry) return; 

    const targetNpcKey = targetEntry[0];
    const questData = questScripts[targetNpcKey];

    if (questData) {
        gameState.activeQuest = {
            target: targetNpcKey,
            item: questData.item
        };
        const modal = document.getElementById('letter-modal');
        const text = document.getElementById('letter-text');
        
        text.innerText = questData.letter;
        modal.classList.remove('hidden');
        playSfx('success'); 
    }
}

function closeLetter() {
    document.getElementById('letter-modal').classList.add('hidden');
}

/* ==========================================================================
   7. 엔딩 시스템 (Ending)
   ========================================================================== */

function checkEnding() {
    gameState.isEnding = true; 
    document.getElementById('night-overlay').classList.add('hidden'); 
    document.getElementById('dialogue-overlay').classList.add('hidden'); 

    const sorted = Object.entries(gameState.affinities).sort((a, b) => b[1] - a[1]);
    const topNpcKey = sorted[0][0];
    const topScore = sorted[0][1];
    
    const highAffinityCount = sorted.filter(item => item[1] >= 80).length;

    let endingData = null;
    let targetNpc = null; 

    if (highAffinityCount >= 2 && endingScripts.cheater) {
        endingData = endingScripts.cheater;
        targetNpc = null; 
    } else if (topScore >= 80 && endingScripts[topNpcKey]) {
        endingData = endingScripts[topNpcKey];
        targetNpc = topNpcKey; 
    } else {
        endingData = endingScripts.normal;
        targetNpc = null;
    }

    playEndingSequence(endingData, targetNpc);
}

function playEndingSequence(data, npcKey) {
    if (!data) return;

   // ★ [추가] 엔딩 시작 시 선물 버튼 표시 기능 강제 종료
    shouldShowInput = false; 
    
    // ... (기존 코드 계속) ...
    
    currentEndingData = data; 
    gameState.isEnding = true;
    lastInteractedNPC = npcKey; 

    document.getElementById('status-bar').style.display = 'none';
    document.getElementById('control-panel').style.display = 'none'; 
    document.getElementById('inventory-icon').classList.add('hidden');
    document.getElementById('delete-toggle-btn').classList.add('hidden');

    document.getElementById('item-layer').innerHTML = "";
    document.getElementById('npc-layer').innerHTML = "";

    if (data.bg) {
        document.getElementById('location-view').style.backgroundImage = `url(${data.bg})`;
    }

    const overlay = document.getElementById('dialogue-overlay');
    overlay.classList.remove('hidden');
    
    document.getElementById('input-area').classList.add('hidden');
    document.getElementById('choice-area').classList.add('hidden');
    
    if (data.script) {
        dialogueQueue = data.script;
    } else {
        const lines = data.text.split('\n').filter(line => line.trim() !== "");
        dialogueQueue = lines.map(line => {
            return { text: line, emotion: 'happy' };
        });
    }

    currentDialogueIndex = 0;
    
    // 엔딩이므로 초상화가 필요 없을 수도 있지만, 필요하면 npcKey를 넘김
    showNextLine(lastInteractedNPC || 'sion'); // npcKey가 null일 경우 대비
}

function showFinalPopup() {
    const overlay = document.getElementById('ending-overlay');
    const title = document.getElementById('ending-title');
    const img = document.getElementById('ending-image');
    const text = document.getElementById('ending-text'); 
    const btn = document.getElementById('restart-btn');

    title.innerText = currentEndingData.title; 
    if (currentEndingData.image) img.src = currentEndingData.image; 
    text.innerText = ""; 

    document.getElementById('dialogue-overlay').classList.add('hidden');
    overlay.classList.remove('hidden');
    
    setTimeout(() => {
        overlay.classList.add('visible');
    }, 50);
    
    btn.classList.remove('hidden');
}

// [신규] 커스텀 알림창 띄우기
function showAlert(message) {
    const modal = document.getElementById('alert-modal');
    const msgBox = document.getElementById('alert-msg');
    msgBox.innerText = message;
    modal.classList.remove('hidden');
    playSfx('click'); // 알림음 (선택 사항)
}

// [신규] 커스텀 알림창 닫기
function closeAlert() {
    document.getElementById('alert-modal').classList.add('hidden');
    playSfx('click');
}

// [신규] 사진 설정 후 -> 진짜 게임 시작 함수
function enterGame() {
    playSfx('success');
    
    // 전체 오프닝 화면 숨기기
    document.getElementById('intro-screen').classList.add('hidden');
    
    // 게임 시작
    updateUI(); 
    move('farm'); 
}

/* ==========================================================================
   [추가] 이벤트 시스템 함수
   ========================================================================== */

function triggerEvent(eventData) {
    gameState.isEventPlaying = true;
    if (!gameState.seenEvents) gameState.seenEvents = []; // 안전장치
    gameState.seenEvents.push(eventData.id); // 이벤트 본 것으로 처리
    
    // 원래 배경 저장 (현재 위치 기준)
    if (locations[gameState.currentLocation]) {
        gameState.originalLoc = locations[gameState.currentLocation].bg;
    }

    const fadeOverlay = document.getElementById('fade-overlay'); // index.html에 추가했는지 확인 필요
    const view = document.getElementById('location-view');

    // 1. 페이드 아웃 (화면 검게)
    if (fadeOverlay) fadeOverlay.classList.add('visible');

    // 2. 1초 뒤 배경 바꾸고 대화 시작
    setTimeout(() => {
        // 배경 변경
        view.style.backgroundImage = `url(${eventData.bg})`;
        
        // NPC 등 레이어 숨기기 (깔끔한 연출 위해)
        document.getElementById('npc-layer').style.display = 'none';
        document.getElementById('item-layer').style.display = 'none';

        // 페이드 인 (다시 밝게)
        if (fadeOverlay) fadeOverlay.classList.remove('visible');

        // 대화창 열기
        document.getElementById('dialogue-overlay').classList.remove('hidden');
        
        // 대사 큐 교체
        dialogueQueue = eventData.script;
        currentDialogueIndex = 0;
        
        // 입력창 숨기기 (이벤트 중에는 선물/키워드 금지)
        document.getElementById('input-area').classList.add('hidden');
        
        showNextLine(lastInteractedNPC);

    }, 1000); 
}

function endEvent() {
    const fadeOverlay = document.getElementById('fade-overlay');
    const view = document.getElementById('location-view');

    // 대화창 닫기
    document.getElementById('dialogue-overlay').classList.add('hidden');

    // 1. 다시 페이드 아웃
    if (fadeOverlay) fadeOverlay.classList.add('visible');

    setTimeout(() => {
        // 2. 원래 배경 및 NPC 복구
        if (gameState.originalLoc) {
            view.style.backgroundImage = `url(${gameState.originalLoc})`;
        }
        document.getElementById('npc-layer').style.display = 'block';
        document.getElementById('item-layer').style.display = 'block';
        
        gameState.isEventPlaying = false; // 이벤트 상태 해제

        // 3. 페이드 인
        if (fadeOverlay) fadeOverlay.classList.remove('visible');
    }, 1000);
}






