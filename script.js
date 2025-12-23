/**
 * 모바일 청첩장 스크립트
 * - 스크롤 애니메이션
 * - 계좌번호 복사
 * - 탭 전환
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initCopyButtons();
    initAddressCopy();
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

/**
 * 주소 복사 기능
 */
function initAddressCopy() {
    const addressBtn = document.querySelector('.copy-address-btn');

    if (addressBtn) {
        addressBtn.addEventListener('click', async () => {
            const textToCopy = addressBtn.dataset.copy;

            try {
                await navigator.clipboard.writeText(textToCopy);
                showToast('주소가 복사되었습니다');
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
                    showToast('주소가 복사되었습니다');
                } catch (e) {
                    showToast('복사에 실패했습니다');
                }
                document.body.removeChild(textArea);
            }
        });
    }
}

/**
 * 라이트박스 관련 변수
 */
const galleryImages = [
    'images/1.jpg', 'images/2.jpg', 'images/3.jpg',
    'images/4.jpg', 'images/5.jpg', 'images/6.jpg',
    'images/7.jpg', 'images/8.jpg', 'images/9.jpg'
];
let currentImageIndex = 0;
let touchStartX = 0;
let touchEndX = 0;

/**
 * 라이트박스 열기
 */
function openLightbox(imageSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    if (lightbox && lightboxImg) {
        currentImageIndex = galleryImages.indexOf(imageSrc);
        if (currentImageIndex === -1) currentImageIndex = 0;

        lightboxImg.src = imageSrc;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        // 스와이프 이벤트 등록
        lightbox.addEventListener('touchstart', handleTouchStart, { passive: true });
        lightbox.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
}

/**
 * 라이트박스 닫기
 */
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');

    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';

        // 스와이프 이벤트 제거
        lightbox.removeEventListener('touchstart', handleTouchStart);
        lightbox.removeEventListener('touchend', handleTouchEnd);
    }
}

/**
 * 이전 이미지
 */
function prevImage(event) {
    if (event) event.stopPropagation();
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxImage();
}

/**
 * 다음 이미지
 */
function nextImage(event) {
    if (event) event.stopPropagation();
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateLightboxImage();
}

/**
 * 라이트박스 이미지 업데이트
 */
function updateLightboxImage() {
    const lightboxImg = document.getElementById('lightbox-img');
    if (lightboxImg) {
        lightboxImg.style.opacity = '0';
        setTimeout(() => {
            lightboxImg.src = galleryImages[currentImageIndex];
            lightboxImg.style.opacity = '1';
        }, 150);
    }
}

/**
 * 터치 시작 핸들러
 */
function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
}

/**
 * 터치 종료 핸들러
 */
function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}

/**
 * 스와이프 처리
 */
function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextImage(); // 왼쪽으로 스와이프 -> 다음
        } else {
            prevImage(); // 오른쪽으로 스와이프 -> 이전
        }
    }
}
