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
    // EmailJSの初期化
    // 注意: 実際の使用時には、EmailJSのPublic Keyを設定してください
    // emailjs.init("YOUR_PUBLIC_KEY");
    
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // 送信ボタンを無効化
            const submitBtn = contactForm.querySelector('.form-submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>送信中...</span>';
            
            // フォームデータの取得
            const formData = new FormData(contactForm);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // 資料タイプのラベルを取得
            const materialTypeLabels = {
                'report_only': '事故防止レポート（ダウンロード）',
                'report_sample3': 'レポート＋サンプル3個',
                'report_sample5': 'レポート＋サンプル1輪分（5個）'
            };
            const materialTypeLabel = materialTypeLabels[data.material_type] || data.material_type;
            
            try {
                // ========================================
                // EmailJS設定
                // ========================================
                // 詳細な設定方法は「EMAILJS_SETUP_GUIDE.md」を参照してください
                // 
                // 設定手順の概要:
                // 1. https://www.emailjs.com/ でアカウント作成
                // 2. Email Services でメールサービスを設定（Gmail推奨）
                // 3. Email Templates でメールテンプレートを作成
                // 4. Account > General でPublic Keyを取得
                // 5. 以下の3つの値を実際の値に置き換える
                
                // EmailJSの設定（実際の値に置き換えてください）
                const serviceId = 'service_814lf5t';        // ステップ2: Email Services で取得したService ID
                const templateId = 'template_3zgmj1g';      // ステップ3: Email Templates で取得したTemplate ID
                const publicKey = 'x-YY5DTRppsuFBQf-';         // ステップ4: Account > General で取得したPublic Key
                
                // 設定例:
                // const serviceId = 'service_abc123';
                // const templateId = 'template_xyz789';
                // const publicKey = 'abcdefghijklmnop';
                
                // EmailJSを初期化（まだ初期化されていない場合）
                if (typeof emailjs !== 'undefined') {
                    emailjs.init(publicKey);
                    
                    // メール送信
                    // 注意: EmailJSのテンプレートで使用する変数名と一致させる必要があります
                    // テンプレート内で {{変数名}} の形式で使用できます
                    await emailjs.send(serviceId, templateId, {
                        // 送信先（テンプレートの「To Email」で設定することも可能）
                        to_email: 'sales@bestruck.co.jp',
                        
                        // フォームから取得したデータ（テンプレートで {{変数名}} として使用可能）
                        from_name: data.name,              // テンプレート: {{from_name}}
                        from_email: data.email,            // テンプレート: {{from_email}}
                        company_name: data.company_name,   // テンプレート: {{company_name}}
                        phone: data.phone || '未入力',     // テンプレート: {{phone}}
                        address: data.address,            // テンプレート: {{address}}
                        vehicle_count: data.vehicle_count || '未入力', // テンプレート: {{vehicle_count}}
                        material_type: materialTypeLabel,  // テンプレート: {{material_type}}
                        message: data.message || 'なし',    // テンプレート: {{message}}
                        reply_to: data.email               // 返信先（テンプレート: {{reply_to}}）
                    });
                } else {
                    // EmailJSが読み込まれていない場合のフォールバック
                    // 実際の環境では、バックエンドAPIを呼び出すか、EmailJSを正しく設定してください
                    console.warn('EmailJSが読み込まれていません。メール送信機能を使用するには、EmailJSを設定してください。');
                    
                    // 開発環境用: コンソールにデータを出力
                    console.log('送信データ:', {
                        to: 'sales@bestruck.co.jp',
                        subject: '資料・サンプル申し込み',
                        body: `
会社名: ${data.company_name}
お名前: ${data.name}
メールアドレス: ${data.email}
電話番号: ${data.phone || '未入力'}
送付先住所: ${data.address}
保有台数: ${data.vehicle_count || '未入力'}
ご希望の資料: ${materialTypeLabel}
ご質問・ご要望: ${data.message || 'なし'}
                        `
                    });
                    
                    // EmailJSが設定されていない場合でも、感謝ページを表示
                    // 実際の本番環境では、バックエンドAPIを呼び出すことを推奨します
                }
                
                // 送信成功時の処理（EmailJSの設定有無に関わらず実行）
                // フォームを非表示にして感謝ページを表示
                const contactSection = document.querySelector('.cta-section');
                const thankYouPage = document.getElementById('thankYouPage');
                
                if (contactSection && thankYouPage) {
                    contactSection.style.display = 'none';
                    thankYouPage.style.display = 'block';
                    
                    // 感謝ページまでスムーズにスクロール
                    setTimeout(() => {
                        thankYouPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                } else {
                    // フォールバック: アラートを表示
                    alert('お申し込みありがとうございます。\n3営業日以内にご連絡いたします。');
                    contactForm.reset();
                    
                    // ラジオボタンのデフォルト選択を復元
                    const defaultRadio = contactForm.querySelector('input[value="report_sample5"]');
                    if (defaultRadio) {
                        defaultRadio.checked = true;
                    }
                }
                
            } catch (error) {
                console.error('メール送信エラー:', error);
                alert('申し訳ございません。送信に失敗しました。\nしばらく時間をおいて再度お試しいただくか、\n直接 sales@bestruck.co.jp までご連絡ください。');
                
                // ボタンを元に戻す
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }
});

// ========================================
// UTMパラメータ解析とGoogleスプレッドシートへの記録
// ========================================
(function() {
    // Google Apps ScriptのWebアプリURL
    // 設定方法は「GOOGLE_SHEETS_ANALYTICS_SETUP.md」を参照してください
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxO1jcQDE2yFwLbn51hs9VpI83gcCNX2HM8ZnTaww31IQysR_Q-vw4BH07CBMr68Iab/exec';
    
    // セッションIDを生成（既に存在する場合は取得）
    function getSessionId() {
        let sessionId = sessionStorage.getItem('analytics_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('analytics_session_id', sessionId);
        }
        return sessionId;
    }
    
    // UTMパラメータを取得
    function getUTMParams() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            utm_source: urlParams.get('utm_source') || '',
            utm_medium: urlParams.get('utm_medium') || '',
            utm_campaign: urlParams.get('utm_campaign') || ''
        };
    }
    
    // アクセスデータをGoogleスプレッドシートに送信
    function sendAnalyticsData() {
        // UTMパラメータが存在する場合のみ送信
        const utmParams = getUTMParams();
        const hasUTMParams = utmParams.utm_source || utmParams.utm_medium || utmParams.utm_campaign;
        
        if (!hasUTMParams) {
            return; // UTMパラメータがない場合は送信しない
        }
        
        // 送信データを準備
        const analyticsData = {
            utm_source: utmParams.utm_source,
            utm_medium: utmParams.utm_medium,
            utm_campaign: utmParams.utm_campaign,
            referrer: document.referrer || '',
            user_agent: navigator.userAgent || '',
            page_url: window.location.href,
            session_id: getSessionId()
        };
        
        // Google Apps Scriptに送信（非同期、エラーは無視）
        if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL !== 'YOUR_GOOGLE_SCRIPT_URL') {
            fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // CORSエラーを回避
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(analyticsData)
            }).catch(error => {
                // エラーはコンソールに出力するだけ（ユーザーには影響しない）
                console.log('Analytics送信エラー（無視されます）:', error);
            });
        } else {
            console.log('Analytics: Google Script URLが設定されていません');
        }
    }
    
    // ページ読み込み時に実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', sendAnalyticsData);
    } else {
        sendAnalyticsData();
    }
})();

// ========================================
// コンソールメッセージ
// ========================================
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxO1jcQDE2yFwLbn51hs9VpI83gcCNX2HM8ZnTaww31IQysR_Q-vw4BH07CBMr68Iab/exec';
const SPREADSHEET_ID = '1DOmwWf16_8JroffsY8HtLfY7GDHxMsxkPkvBunaUDmY';
console.log('%c🚛 ナットチェッカー LP', 'font-size: 20px; font-weight: bold; color: #DC2626;');
console.log('%c事故ゼロの未来を、技術で実現', 'font-size: 14px; color: #4B5563;');

