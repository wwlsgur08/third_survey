// Firebase SDK 가져오기 (데이터베이스 기능 포함)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// ----------------------------------------------------------------
// Firebase 설정
// ----------------------------------------------------------------
const firebaseConfig = {
    apiKey: "AIzaSyA8bmJF4XSkZiK8uK-ESwxs-1Rpc6GML4U",
    authDomain: "starbase-2accb.firebaseapp.com",
    projectId: "starbase-2accb",
    storageBucket: "starbase-2accb.firebasestorage.app",
    messagingSenderId: "1072209005540",
    appId: "1:1072209005540:web:20b90950a2f637a20755f1",
    measurementId: "G-1K7LMHR35W"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ----------------------------------------------------------------
// 핵심 38문항 데이터
// ----------------------------------------------------------------
const likertQuestions = [
    { scale: '내적 매력 인지 명확성', q: '나는 나의 좋은 점, 즉 \'매력\'이 무엇인지 구체적으로 알고 있다.', reverse: false },
    { scale: '내적 매력 인지 명확성', q: '나는 나의 매력이 무엇인지 구체적으로 설명하기 어렵다.', reverse: true },
    { scale: '내적 매력 인지 명확성', q: '나는 나의 어떤 매력이 나를 다른 사람과 구별되는 특별한 사람으로 만드는지 이해하고 있다.', reverse: false },
    { scale: '내적 매력 인지 명확성', q: '나는 최근 나의 경험을 되돌아볼 때, 어떤 매력이 발휘되었는지 쉽게 떠올릴 수 있다.', reverse: false },
    { scale: '내적 매력 인지 명확성', q: '나는 앞으로 나의 매력을 어떻게 발전시키고 싶은지에 대한 계획이 있다.', reverse: false },
    { scale: '내적 매력 인지 명확성', q: '나는 나의 다양한 매력들이 모여 \'나\'라는 사람을 이룬다고 생각한다.', reverse: false },
    
    { scale: '관계적 자신감', q: '나는 다른 사람들과 함께 있을 때, 나의 생각이나 의견을 편안하게 표현하는 편이다.', reverse: false },
    { scale: '관계적 자신감', q: '나는 다른 사람의 뛰어난 점을 보면, 나 자신과 비교하며 위축될 때가 많다.', reverse: true },
    { scale: '관계적 자신감', q: '나는 내가 무언가 불편할 때, 그것을 존중해달라고 다른 사람에게 요청하는 것을 망설이지 않는다.', reverse: false },
    { scale: '관계적 자신감', q: '나는 다른 사람과 의견 충돌이 있을 때, 건설적으로 해결해 나갈 자신이 있다.', reverse: false },
    { scale: '관계적 자신감', q: '나는 여러 사람이 있는 그룹 안에서 소속감을 느끼는 편이다.', reverse: false },
    { scale: '관계적 자신감', q: '나는 내가 좋아하는 사람들 앞에서 나의 솔직한 모습을 보여주는 것을 즐긴다.', reverse: false },

    { scale: '자기 수용', q: '나는 나의 장점뿐만 아니라 단점까지도 나 자신의 일부로 받아들인다.', reverse: false },
    { scale: '자기 수용', q: '나는 스스로에게 실망할 때, 나 자신을 심하게 자책하는 경향이 있다.', reverse: true },
    { scale: '자기 수용', q: '나는 나의 모습이 완벽하지 않아도, 상관없다.', reverse: false },
    { scale: '자기 수용', q: '나는 나의 부정적인 감정(슬픔, 분노 등)을 느끼는 나 자신이 싫어질 때가 있다.', reverse: true },
    { scale: '자기 수용', q: '나는 다른 사람의 인정이나 칭찬이 없어도, 나 자신의 가치를 느낄 수 있다.', reverse: false },
    { scale: '자기 수용', q: '나는 다른 사람 앞에서 나의 진짜 모습을 보여주는 것이 두렵지 않다.', reverse: false },

    { scale: '로젠버그 자아존중감 척도', q: '전반적으로 나는 내 자신에 대해 만족한다.', reverse: false },
    { scale: '로젠버그 자아존중감 척도', q: '때때로 나는 내가 쓸모없는 사람이라고 생각한다.', reverse: true },
    { scale: '로젠버그 자아존중감 척도', q: '나는 내가 여러 가지 좋은 자질을 가지고 있다고 느낀다.', reverse: false },
    { scale: '로젠버그 자아존중감 척도', q: '나는 다른 사람들만큼 일을 잘 할 수 있다고 생각한다.', reverse: false },
    { scale: '로젠버그 자아존중감 척도', q: '나는 자랑스러워할 만한 것이 별로 없다고 느낀다.', reverse: true },
    { scale: '로젠버그 자아존중감 척도', q: '나는 때때로 내가 정말 쓸모없다고 느낀다.', reverse: true },
    { scale: '로젠버그 자아존중감 척도', q: '나는 적어도 다른 사람들과 동등하게 가치 있는 사람이라고 느낀다.', reverse: false },
    { scale: '로젠버그 자아존중감 척도', q: '나는 내 자신을 더 존중할 수 있었으면 좋겠다고 생각한다.', reverse: true },
    { scale: '로젠버그 자아존중감 척도', q: '나는 대체로 내가 실패자라는 생각이 든다.', reverse: true },
    { scale: '로젠버그 자아존중감 척도', q: '나는 내 자신에 대해 긍정적인 태도를 가지고 있다.', reverse: false },

    { scale: '일반적 자기효능감 척도', q: '나는 열심히 노력하면 어려운 일도 항상 해결할 수 있다.', reverse: false },
    { scale: '일반적 자기효능감 척도', q: '누군가 나에게 반대하더라도, 나는 내가 원하는 것을 얻을 방법을 찾을 수 있다.', reverse: false },
    { scale: '일반적 자기효능감 척도', q: '나는 나의 목표를 고수하고 성취하는 것이 쉽다.', reverse: false },
    { scale: '일반적 자기효능감 척도', q: '나는 예상치 못한 일이 생겨도 효과적으로 대처할 수 있다고 자신한다.', reverse: false },
    { scale: '일반적 자기효능감 척도', q: '나는 나의 기지를 발휘하여 예기치 못한 상황도 잘 처리할 수 있다.', reverse: false },
    { scale: '일반적 자기효능감 척도', q: '필요한 노력을 기울인다면 대부분의 문제를 해결할 수 있다.', reverse: false },
    { scale: '일반적 자기효능감 척도', q: '어려움에 직면했을 때, 나는 나의 대처 능력을 믿고 침착함을 유지할 수 있다.', reverse: false },
    { scale: '일반적 자기효능감 척도', q: '문제가 생기면, 나는 보통 여러 가지 해결책을 찾을 수 있다.', reverse: false },
    { scale: '일반적 자기효능감 척도', q: '곤란한 상황에 처해도, 나는 대개 해결책을 생각해낼 수 있다.', reverse: false },
    { scale: '일반적 자기효능감 척도', q: '나는 대개 어떤 일이 닥쳐도 잘 처리할 수 있다.', reverse: false }
];

// ----------------------------------------------------------------
// 설문지 로직
// ----------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const surveyForm = document.getElementById('survey-form');
    const pages = document.querySelectorAll('.page');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const progress = document.getElementById('progress');

    let currentPageIndex = 0;
    const TOTAL_PAGES = pages.length; // 감사 페이지 포함

    // 4점 척도 문항 동적 생성
    function renderLikertQuestions() {
        const container = document.getElementById('likert-questions-container');
        const template = document.getElementById('likert-question-template').innerHTML;
        let questionCounter = 0; // 문항 번호를 위한 카운터

        likertQuestions.forEach((item) => {
            // ▼▼▼ [수정됨] 카테고리 제목을 생성하는 부분을 삭제하여 쭉 이어지게 함 ▼▼▼
            questionCounter++;
            const qid = `q${questionCounter}`;
            const questionHTML = template
                .replace(/{qid}/g, qid)
                .replace('{is-reverse}', item.reverse)
                .replace('{q-text}', `${questionCounter}. ${item.q}`);
            container.innerHTML += questionHTML;
        });
    }
    
    // 페이지 보여주기 함수
    function showPage(index) {
        pages.forEach((page, i) => {
            page.classList.toggle('active', i === index);
        });
        updateProgress(index);
        updateButtons(index);
        window.scrollTo(0, 0); // 페이지 넘길 때 맨 위로 스크롤
    }
    
    // 진행도 업데이트 함수
    function updateProgress(index) {
        const progressPercentage = (index / (TOTAL_PAGES - 2)) * 100;
        progress.style.width = `${progressPercentage}%`;
    }

    // 버튼 상태 업데이트 함수
    function updateButtons(index) {
        prevBtn.classList.toggle('hidden', index === 0);
        const isLastQuestionPage = index === TOTAL_PAGES - 2;
        nextBtn.classList.toggle('hidden', isLastQuestionPage);
        submitBtn.classList.toggle('hidden', !isLastQuestionPage);

        if (index === 0) {
            nextBtn.textContent = '동의하고 시작하기';
            nextBtn.disabled = !document.getElementById('consent-check').checked;
        } else {
            nextBtn.textContent = '다음';
            nextBtn.disabled = false;
        }
    }

    // 페이지 유효성 검사 함수
    function validatePage(index) {
        const currentPage = pages[index];
        const inputs = currentPage.querySelectorAll('[required]:not(.hidden *)');
        
        for (const input of inputs) {
             if (input.closest('.hidden')) continue;

            if (input.type === 'radio' || input.type === 'checkbox') {
                const name = input.name;
                if (!surveyForm.querySelector(`input[name="${name}"]:checked`)) {
                    alert('필수 항목을 모두 응답해주세요.');
                    input.focus();
                    return false;
                }
            } else if (!input.value.trim()) {
                alert('필수 항목을 모두 응답해주세요.');
                input.focus();
                return false;
            }
        }
        
        // 감정표현 스타일 1개 이상 선택 유효성 검사
        if (currentPage.id === 'page-3') {
             const emotionCheckboxes = document.querySelectorAll('input[name="emotion-style"]:checked');
             if (emotionCheckboxes.length === 0) {
                alert('감정 표현 스타일을 최소 1개 선택해주세요.');
                return false;
             }
        }
        return true;
    }

    // "다음" 버튼 클릭 이벤트
    nextBtn.addEventListener('click', () => {
        if (!validatePage(currentPageIndex)) return;

        if (currentPageIndex < TOTAL_PAGES - 1) {
            currentPageIndex++;
            showPage(currentPageIndex);
        }
    });

    // "이전" 버튼 클릭 이벤트
    prevBtn.addEventListener('click', () => {
        if (currentPageIndex > 0) {
            currentPageIndex--;
            showPage(currentPageIndex);
        }
    });

    // 폼 제출 이벤트
    surveyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validatePage(currentPageIndex)) return;
        
        submitBtn.disabled = true;
        submitBtn.textContent = '제출 중...';

        try {
            const formData = new FormData(surveyForm);
            const surveyData = {};

            // 기본 데이터 수집
            for (let [key, value] of formData.entries()) {
                if (surveyData[key]) {
                    if (!Array.isArray(surveyData[key])) {
                        surveyData[key] = [surveyData[key]];
                    }
                    surveyData[key].push(value);
                } else {
                    surveyData[key] = value;
                }
            }

            // 설문 유형 추가 (추격연구용)
            surveyData.surveyType = "third"; // 사후 설문에서는 "post"로 변경

            // 4점 척도 데이터 정리 (역채점 포함)
            const likertResults = {};
            const likertGroups = document.querySelectorAll('#likert-questions-container .question-group');
            likertGroups.forEach((group, index) => {
                const qid = group.dataset.qid;
                const isReverse = group.dataset.reverse === 'true';
                const originalValue = parseInt(surveyData[qid], 10);
                
                likertResults[qid] = {
                    question: likertQuestions[index].q,
                    scale: likertQuestions[index].scale, // 카테고리 정보는 데이터에만 저장
                    value: originalValue,
                };
                
                if(isReverse) {
                    // 4점 척도 역채점: (최대값 + 1) - 원점수 = (4 + 1) - 원점수
                    likertResults[qid].reversedValue = 5 - originalValue; 
                }

                delete surveyData[qid]; // 원본 폼 데이터에서 q 항목 삭제
            });
            surveyData.likertResponses = likertResults;

            // 불필요한 동의 항목 제거
            delete surveyData.consent;

            // 제출 시간 기록
            surveyData.submittedAt = serverTimestamp();

            // Firestore에 데이터 저장
            const docRef = await addDoc(collection(db, "surveyResponses"), surveyData);
            console.log("Document written with ID: ", docRef.id);
            
            // 감사 페이지로 이동
            currentPageIndex++;
            showPage(currentPageIndex);
            document.querySelector('.btn-container').classList.add('hidden');
            document.querySelector('.progress-bar').classList.add('hidden');

        } catch (error) {
            console.error("Error adding document: ", error);
            alert('오류가 발생했습니다. 다시 시도해주세요.');
            submitBtn.disabled = false;
            submitBtn.textContent = '제출';
        }
    });
    
    // --- 추가 로직 (적응형 질문, 체크박스 제한 등) ---

    // 연구 동의 체크박스
    // 연구 동의 체크박스
    document.getElementById('consent-check').addEventListener('change', () => {
        // 첫 번째 페이지에 있을 때만 버튼 상태를 다시 업데이트합니다.
        if (currentPageIndex === 0) {
            updateButtons(currentPageIndex);
        }
    });

    // 직장인 선택 시 직장 경력 질문 표시
    document.getElementById('status').addEventListener('change', (e) => {
        const workExpGroup = document.getElementById('work-experience-group');
        const workExpInput = document.getElementById('work-experience');
        if (e.target.value === '직장인') {
            workExpGroup.classList.remove('hidden');
            workExpInput.required = true;
        } else {
            workExpGroup.classList.add('hidden');
            workExpInput.required = false;
            workExpInput.value = '';
        }
    });

    // 감정 표현 스타일 최대 2개 선택 제한
    const emotionCheckboxes = document.querySelectorAll('input[name="emotion-style"]');
    emotionCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const checkedCount = document.querySelectorAll('input[name="emotion-style"]:checked').length;
            if (checkedCount > 2) {
                alert('최대 2개까지 선택할 수 있습니다.');
                checkbox.checked = false;
            }
        });
    });

    // 9번 질문(followup_q9) 답변에 따른 10번 질문 표시/숨김 처리
    const followupQ9Radios = document.querySelectorAll('input[name="followup_q9"]');
    const followupQ10Group = document.getElementById('followup-q10-group');
    const followupQ10Textarea = document.getElementById('followup-q10');

    followupQ9Radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const selectedValue = e.target.value;
            if (selectedValue === '3' || selectedValue === '4') {
                followupQ10Group.classList.remove('hidden');
                followupQ10Textarea.required = true;
            } else {
                followupQ10Group.classList.add('hidden');
                followupQ10Textarea.required = false;
                followupQ10Textarea.value = ''; // 숨겨질 때 값 초기화
            }
        });
    });

    // 초기화
    renderLikertQuestions();
    showPage(currentPageIndex);
});