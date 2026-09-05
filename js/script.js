document.addEventListener('DOMContentLoaded', () => {

    // --- Dark Mode Toggle ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const icon = themeToggleBtn.querySelector('i');

    function updateIcon(theme) {
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    // Check for saved preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateIcon(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme);
    });

    // --- Mobile Menu Toggle ---
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const btnIcon = mobileBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            btnIcon.classList.remove('fa-bars');
            btnIcon.classList.add('fa-times');
        } else {
            btnIcon.classList.remove('fa-times');
            btnIcon.classList.add('fa-bars');
        }
    });

    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileBtn.querySelector('i').classList.remove('fa-times');
            mobileBtn.querySelector('i').classList.add('fa-bars');
        });
    });

    // --- Scroll Animations ---
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    // --- Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                const headerOffset = 80;
                const offsetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            }
        });
    });

    // --- About Slideshow ---
    const slides = document.querySelectorAll('.about-slideshow .slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        const slideInterval = 3500;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, slideInterval);
    }

    // --- Video Modal ---
    const videoModal = document.getElementById('video-modal');
    const modalVideoPlayer = document.getElementById('modal-video-player');
    const closeModalBtn = document.querySelector('.close-modal');
    const videoThumbnails = document.querySelectorAll('.video-thumbnail');
    const modalContent = document.querySelector('.modal-content');

    if (videoModal && modalVideoPlayer) {
        function getYouTubeId(url) {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            if (match && match[2].length === 11) return match[2];
            const shortsMatch = url.match(/shorts\/([a-zA-Z0-9_-]+)/);
            if (shortsMatch && shortsMatch[1]) return shortsMatch[1];
            return null;
        }

        videoThumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', () => {
                const videoSrc = thumbnail.getAttribute('data-video-src');
                if (videoSrc) {
                    const youtubeId = getYouTubeId(videoSrc);
                    const videoWrapper = document.querySelector('.video-wrapper');
                    const existingIframe = videoWrapper.querySelector('iframe');
                    if (existingIframe) existingIframe.remove();

                    if (youtubeId) {
                        modalVideoPlayer.style.display = 'none';
                        modalVideoPlayer.src = "";
                        const iframe = document.createElement('iframe');
                        iframe.setAttribute('src', `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&playsinline=1&modestbranding=1`);
                        iframe.setAttribute('frameborder', '0');
                        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
                        iframe.setAttribute('allowfullscreen', '');
                        videoWrapper.appendChild(iframe);
                    } else {
                        modalVideoPlayer.style.display = 'block';
                        modalVideoPlayer.src = videoSrc;
                        modalVideoPlayer.play();
                    }

                    videoModal.style.display = 'flex';
                    void videoModal.offsetWidth;
                    videoModal.classList.add('show');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        function closeVideoModal() {
            videoModal.classList.remove('show');
            document.body.style.overflow = '';
            setTimeout(() => {
                videoModal.style.display = 'none';
                modalVideoPlayer.pause();
                modalVideoPlayer.currentTime = 0;
                modalVideoPlayer.src = "";
                modalVideoPlayer.style.display = 'block';
                const videoWrapper = document.querySelector('.video-wrapper');
                const iframe = videoWrapper.querySelector('iframe');
                if (iframe) iframe.remove();
            }, 400);
        }

        if (closeModalBtn) closeModalBtn.addEventListener('click', closeVideoModal);
        videoModal.addEventListener('click', (e) => {
            if (!modalContent.contains(e.target)) closeVideoModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && videoModal.classList.contains('show')) closeVideoModal();
        });
    }

});
