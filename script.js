/**
 * 모바일 청첩장 스크립트
 * - 스크롤 애니메이션
 * - 계좌번호 복사
 * - 탭 전환
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initAccountTabs();
    initCopyButtons();
});

/**
 * 스크롤 애니메이션 초기화
 * Intersection Observer를 사용하여 요소가 뷰포트에 들어올 때 애니메이션 적용
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // 한 번 애니메이션 된 요소는 관찰 중지
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach((el) => {
        observer.observe(el);
    });

    // 캘린더 날짜에 순차 애니메이션 적용
    const calendarDates = document.querySelectorAll('.calendar-dates span');
    calendarDates.forEach((date, index) => {
        date.style.opacity = '0';
        date.style.transform = 'scale(0.8)';
        date.style.transition = `all 0.3s ease ${index * 0.02}s`;
    });

    const calendarObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                calendarDates.forEach((date) => {
                    date.style.opacity = '1';
                    date.style.transform = 'scale(1)';
                });
                calendarObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const calendar = document.querySelector('.calendar');
    if (calendar) {
        calendarObserver.observe(calendar);
    }

    // 갤러리 아이템에 순차 애니메이션
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `all 0.5s ease ${index * 0.1}s`;
    });

    const galleryObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                galleryItems.forEach((item) => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                });
                galleryObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    const gallery = document.querySelector('.gallery-grid');
    if (gallery) {
        galleryObserver.observe(gallery);
    }
}

/**
 * 계좌 탭 전환 기능
 */
function initAccountTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.account-panel');

    tabButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;

            // 모든 버튼에서 active 제거
            tabButtons.forEach((b) => b.classList.remove('active'));
            // 클릭된 버튼에 active 추가
            btn.classList.add('active');

            // 모든 패널 숨기기
            panels.forEach((panel) => panel.classList.remove('active'));
            // 해당 패널 보이기
            const targetPanel = document.getElementById(`${targetTab}-account`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}

/**
 * 계좌번호 복사 기능
 */
function initCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');

    copyButtons.forEach((btn) => {
        btn.addEventListener('click', async () => {
            const textToCopy = btn.dataset.copy;

            try {
                await navigator.clipboard.writeText(textToCopy);
                showToast('계좌번호가 복사되었습니다');
            } catch (err) {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = textToCopy;
                textArea.style.position = 'fixed';
                textArea.style.left = '-9999px';
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    showToast('계좌번호가 복사되었습니다');
                } catch (e) {
                    showToast('복사에 실패했습니다');
                }
                document.body.removeChild(textArea);
            }
        });
    });
}

/**
 * 토스트 메시지 표시
 */
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

/**
 * 부드러운 스크롤 (필요시 사용)
 */
function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}
