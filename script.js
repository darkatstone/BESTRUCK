// ========================================
// ハンバーガーメニュー
// ========================================
const hamburger = document.getElementById('hamburger');
const navList = document.querySelector('.nav-list');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navList.classList.toggle('active');
});

// メニューリンクをクリックしたらメニューを閉じる
const navLinks = document.querySelectorAll('.nav-list a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navList.classList.remove('active');
    });
});

// ========================================
// バナースライダー
// ========================================
class BannerSlider {
    constructor() {
        this.slides = document.querySelectorAll('.banner-slide');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.querySelector('.banner-prev');
        this.nextBtn = document.querySelector('.banner-next');
        this.currentSlide = 0;
        this.slideInterval = null;
        this.autoPlayDelay = 5000; // 5秒ごとに自動切り替え
        
        this.init();
    }
    
    init() {
        // ドットクリックイベント
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
                this.resetAutoPlay();
            });
        });
        
        // 前へ/次へボタン
        this.prevBtn.addEventListener('click', () => {
            this.previousSlide();
            this.resetAutoPlay();
        });
        
        this.nextBtn.addEventListener('click', () => {
            this.nextSlide();
            this.resetAutoPlay();
        });
        
        // キーボード操作
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.previousSlide();
                this.resetAutoPlay();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
                this.resetAutoPlay();
            }
        });
        
        // タッチスワイプ対応
        this.setupTouchEvents();
        
        // 自動再生開始
        this.startAutoPlay();
        
        // マウスホバーで一時停止
        const bannerSlider = document.querySelector('.banner-slider');
        bannerSlider.addEventListener('mouseenter', () => this.stopAutoPlay());
        bannerSlider.addEventListener('mouseleave', () => this.startAutoPlay());
    }
    
    goToSlide(index) {
        // 現在のスライドを非アクティブに
        this.slides[this.currentSlide].classList.remove('active');
        this.dots[this.currentSlide].classList.remove('active');
        
        // 新しいスライドをアクティブに
        this.currentSlide = index;
        this.slides[this.currentSlide].classList.add('active');
        this.dots[this.currentSlide].classList.add('active');
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }
    
    previousSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }
    
    startAutoPlay() {
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }
    
    stopAutoPlay() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }
    }
    
    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
    
    setupTouchEvents() {
        const bannerContainer = document.querySelector('.banner-container');
        let touchStartX = 0;
        let touchEndX = 0;
        
        bannerContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        bannerContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });
        
        const handleSwipe = () => {
            const swipeThreshold = 50;
            const difference = touchStartX - touchEndX;
            
            if (Math.abs(difference) > swipeThreshold) {
                if (difference > 0) {
                    // 左スワイプ - 次へ
                    this.nextSlide();
                } else {
                    // 右スワイプ - 前へ
                    this.previousSlide();
                }
                this.resetAutoPlay();
            }
        };
        
        this.handleSwipe = handleSwipe;
    }
}

// バナースライダー初期化
document.addEventListener('DOMContentLoaded', () => {
    new BannerSlider();
});

// ========================================
// FAQアコーディオン
// ========================================
const initFAQ = () => {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // 他のFAQアイテムを閉じる（オプション：同時に複数開く場合は削除）
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // クリックしたアイテムの開閉を切り替え
            item.classList.toggle('active', !isActive);
        });
    });
};

// FAQ初期化
document.addEventListener('DOMContentLoaded', () => {
    initFAQ();
});

// ========================================
// スクロール時のヘッダー背景変更
// ========================================
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
    }
});

// ========================================
// スクロールアニメーション（Intersection Observer）
// ========================================
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// アニメーション対象要素
const animateElements = document.querySelectorAll(`
    .stat-card,
    .problem-box,
    .solution-item,
    .feature-card,
    .specs-content
`);

animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
});

// ========================================
// スムーススクロール（古いブラウザ対応）
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // "#"のみの場合はスクロールしない
        if (href === '#') {
            e.preventDefault();
            return;
        }
        
        const target = document.querySelector(href);
        
        if (target) {
            e.preventDefault();
            
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// 数字のカウントアップアニメーション
// ========================================
const statNumbers = document.querySelectorAll('.stat-number');

const animateNumber = (element, target, duration = 2000) => {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;
    
    const updateNumber = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(updateNumber);
        } else {
            element.textContent = target.toLocaleString();
        }
    };
    
    updateNumber();
};

const numberObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            const text = entry.target.textContent.trim();
            
            // 数字のみを抽出
            const match = text.match(/\d+/);
            if (match) {
                const targetNumber = parseInt(match[0]);
                const restOfText = text.replace(/\d+/, '');
                
                animateNumber(entry.target, targetNumber);
                
                // 数字以外のテキストを後で追加
                setTimeout(() => {
                    entry.target.textContent = targetNumber.toLocaleString() + restOfText;
                }, 2000);
            }
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(num => numberObserver.observe(num));

// ========================================
// パララックス効果
// ========================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image');
    
    if (heroImage) {
        const parallaxSpeed = 0.3;
        heroImage.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }
});

// ========================================
// CTAボタンのホバーエフェクト強化
// ========================================
const ctaButtons = document.querySelectorAll('.btn-primary');

ctaButtons.forEach(button => {
    button.addEventListener('mouseenter', function(e) {
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.3)';
        ripple.style.width = '0';
        ripple.style.height = '0';
        ripple.style.left = e.clientX - rect.left + 'px';
        ripple.style.top = e.clientY - rect.top + 'px';
        ripple.style.transition = 'width 0.6s, height 0.6s';
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.style.width = '300px';
            ripple.style.height = '300px';
            ripple.style.marginLeft = '-150px';
            ripple.style.marginTop = '-150px';
        }, 10);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// ========================================
// フォームバリデーション（将来的な拡張用）
// ========================================
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const validatePhone = (phone) => {
    const re = /^[\d\-\(\)]+$/;
    return re.test(phone);
};

// ========================================
// ローディングアニメーション
// ========================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ========================================
// パフォーマンス最適化：画像の遅延読み込み
// ========================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    // 遅延読み込み対象の画像があれば適用
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========================================
// アクセシビリティ：キーボードナビゲーション
// ========================================
document.addEventListener('keydown', (e) => {
    // Escキーでモバイルメニューを閉じる
    if (e.key === 'Escape' && navList.classList.contains('active')) {
        hamburger.classList.remove('active');
        navList.classList.remove('active');
    }
});

// ========================================
// スクロールプログレスバー
// ========================================
const createProgressBar = () => {
    const progressBar = document.createElement('div');
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.width = '0%';
    progressBar.style.height = '4px';
    progressBar.style.backgroundColor = '#DC2626';
    progressBar.style.zIndex = '9999';
    progressBar.style.transition = 'width 0.1s ease';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
};

createProgressBar();

// ========================================
// お問い合わせフォームの送信処理
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // フォームデータの取得
            const formData = new FormData(contactForm);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // ここで実際の送信処理を実装
            // 例: APIへの送信、メール送信など
            console.log('フォーム送信:', data);
            
            // 送信成功時の処理
            alert('お問い合わせありがとうございます。\n3営業日以内にご連絡いたします。');
            contactForm.reset();
            
            // ラジオボタンのデフォルト選択を復元
            const defaultRadio = contactForm.querySelector('input[value="report_sample5"]');
            if (defaultRadio) {
                defaultRadio.checked = true;
            }
        });
    }
});

// ========================================
// コンソールメッセージ
// ========================================
console.log('%c🚛 ナットチェッカー LP', 'font-size: 20px; font-weight: bold; color: #DC2626;');
console.log('%c事故ゼロの未来を、技術で実現', 'font-size: 14px; color: #4B5563;');

