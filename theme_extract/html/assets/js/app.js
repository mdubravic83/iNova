var MyScroll = "";
(function (window, document, $, undefined) {
  "use strict";

  var Init = {
    i: function (e) {
      Init.s();
      Init.methods();
    },
    s: function (e) {
      (this._window = $(window)),
        (this._document = $(document)),
        (this._body = $("body")),
        (this._html = $("html"));
    },
    methods: function (e) {
      Init.w();
      Init.preloader();
      Init.Gsap();
      Init.roomBox();
      Init.quantityHandle();
      Init.toggle();
      Init.slick();
      Init.niceSelect();
      Init.countdownInit(".countdown", "2025/12/01");
      Init.passwordIcon();
      Init.salInit();
      Init.formValidation();
      Init.contactForm();
      Init.roomDetailGallery();
    },

    w: function (e) {
    },

    preloader: function () {
      setTimeout(function () {
        $("#preloader").hide("slow");
      }, 2000);
    },

    // GSAP
    Gsap: function () {
      if ($('.gallery').length) {
        gsap.registerPlugin(ScrollSmoother, Flip, ScrollTrigger);
      } else {
        gsap.registerPlugin(ScrollSmoother);
      }

      // About Us
      if (window.innerWidth > 576) {
        var imageWidth = window.innerWidth > 575 ? '95vw' :
          window.innerWidth >= 490 && window.innerWidth <= 575 ? '90vw' :
            window.innerWidth >= 394 && window.innerWidth <= 490 ? '78vw' : '72vw'

        var slideAnimation = gsap.timeline({ defaults: { ease: "power2.inOut" }, });
        slideAnimation.to(".journey-sec-wrapper .text-block", { y: "-100%", opacity: 0, duration: 0.1 })
          .to(".journey-sec-wrapper .sec-heading", { y: "-250%", duration: 0.3 })
          .to(".journey-sec-wrapper .journey-sec .text-block", { width: '0', height: '0', margin: "0" }, "<")
          .to(".journey-sec-wrapper .journey-sec .image-block", { width: imageWidth, duration: 1 }, "<"),

          ScrollTrigger.create({
            trigger: ".about",
            scrub: true,
            markers: false,
            start: "top 10%",
            end: "top -20%",
            animation: slideAnimation,
          });
      }

      // Our Story - 1
      if (window.innerWidth > 576) {
        var radiusImage = window.innerWidth > 820 ? '60px' :
          window.innerWidth >= 768 && window.innerWidth <= 820 ? '45px' : '30px'
        var imageSlideAnimation = gsap.timeline({ defaults: { ease: "power2.inOut" }, });
        imageSlideAnimation.to(".story_1 .story_1-content .image-block img", { width: "100%", borderRadius: radiusImage, duration: 3 })
  
        ScrollTrigger.create({
          trigger: ".story_1",
          pin: true,
          scrub: true,
          markers: false,
          start: "top 50%",
          end: "top bottom",
          animation: imageSlideAnimation,
        });
      }

      // Our Story - 2
      if (window.innerWidth > 576) {
        var radiusImage2 = window.innerWidth > 820 ? '60px' :
          window.innerWidth >= 768 && window.innerWidth <= 820 ? '45px' : '20px'
        var imageSlideAnimation2 = gsap.timeline({ defaults: { ease: "power2.inOut" }, });
        imageSlideAnimation2.to(".story_2 .story_content-2 .img-box img", { width: "100%", borderRadius: radiusImage2 })
  
        ScrollTrigger.create({
          trigger: ".story_2",
          pin: true,
          scrub: true,
          markers: false,
          start: "top 50%",
          end: "top 70%",
          animation: imageSlideAnimation2,
        });
      }

      // Filled Text 
      const splitTypes = document.querySelectorAll('.reveal-type')
      splitTypes.forEach((char, i) => {
        const bg = char.dataset.bgColor
        const fg = char.dataset.fgColor
        const text = new SplitType(char, { types: 'chars' })
        gsap.fromTo(text.chars, { color: bg, }, {
          color: fg, duration: 1, stagger: 0.2,
          scrollTrigger: {
            trigger: char,
            start: 'top 80%',
            end: 'top 20%',
            scrub: true,
            markers: false,
            toggleActions: 'play play reverse reverse'
          }
        })
      });

      if (window.innerWidth > 1024) {
        MyScroll = ScrollSmoother.create({
          smooth: 0.7,
          effects: true,
          smoothTouch: 1,
        });
        MyScroll.scrollTo(0);
      }

      // Home page gallery (non-detail pages) keeps Flip effect
      if ($('.gallery').length && !$('.gallery').hasClass('gallery-detail')) {
        $('.gallery .images .gallery-img').on('click', function () {
          var imageFlip = $(this).find('img');
          gsap.set(imageFlip, { borderRadius: '0' });
          var returnimg = $('.gallery:not(.gallery-detail) .image-container').find('img');
          gsap.set(returnimg, { borderRadius: '0' });

          const state = Flip.getState(imageFlip);
          const state2 = Flip.getState(returnimg);

          $('.gallery:not(.gallery-detail) .image-container').append(imageFlip);
          $(this).append(returnimg);

          Flip.from(state, { duration: 0.8, ease: "power1.inOut", scale: true });
          Flip.from(state2, { duration: 0.8, ease: "power1.inOut", scale: true, onComplete: setBorderRadius });

          function setBorderRadius() {
            gsap.to(returnimg, { borderRadius: '0.781vw' });
          }
        });
      }
    },

    // Room detail gallery: thumbnails + prev/next arrows
    roomDetailGallery: function () {
      var $galleries = $('.gallery.gallery-detail');
      if (!$galleries.length) return;

      $galleries.each(function () {
        var $gallery = $(this);
        var $mainImg = $gallery.find('.image-container img').first();
        var $thumbs = $gallery.find('.images .gallery-img img');
        var $prev = $gallery.find('.gallery-nav-prev');
        var $next = $gallery.find('.gallery-nav-next');

        if (!$mainImg.length || !$thumbs.length) return;

        var urls = $thumbs.map(function () { return $(this).attr('src'); }).get();
        var currentIndex = 0;

        function setActive(index) {
          if (!urls.length) return;
          currentIndex = (index + urls.length) % urls.length;
          var newSrc = urls[currentIndex];
          if ($mainImg.attr('src') === newSrc) return;

          $gallery.find('.gallery-img').removeClass('is-active');
          var $activeThumb = $($thumbs[currentIndex]).closest('.gallery-img');
          $activeThumb.addClass('is-active');

          $mainImg.stop(true, true).fadeOut(150, function () {
            $mainImg.attr('src', newSrc).fadeIn(150);
          });
        }

        setActive(0);

        $thumbs.each(function (idx) {
          $(this).css('cursor', 'pointer');
          $(this).off('click.roomDetail').on('click.roomDetail', function (e) {
            e.preventDefault();
            setActive(idx);
          });
        });

        if ($prev.length) {
          $prev.off('click.roomDetail').on('click.roomDetail', function (e) {
            e.preventDefault();
            setActive(currentIndex - 1);
          });
        }
        if ($next.length) {
          $next.off('click.roomDetail').on('click.roomDetail', function (e) {
            e.preventDefault();
            setActive(currentIndex + 1);
          });
        }
      });
    },

    // Room Box
    roomBox: function () {
      if ($('.guest-box').length) {
        var $div = $('.guest-box');

      
        $(document).on('click', function (event) {
          if (!$(event.target).closest('.guest-area, #seat-booking').length) {
            $('.guest-area').slideUp();
          }
      });
      
      $('#seat-booking').on('click', function (event) {
          event.stopPropagation();
          $('.guest-area').slideToggle();
      });

       
      }
    },

    // Quantity Handle
    quantityHandle: function () {
      $("#increment-guest").on("click", function () {
        var guest = +$('#guest').val();
        var plus = guest + 1 ;
        $('#guest').val(plus);
        $('#total-guest').text(plus);
     
      });
      $("#decrement-guest").on("click", function () {
        var guest = +$('#guest').val();
        if(guest > 0){
          var plus = guest - 1 ;
          $('#guest').val(plus);
          $('#total-guest').text(plus);
        }
      });

      // ROOMS
      $("#increment-room").on("click", function () {
        var room = +$('#room').val();
        var plus = room + 1 ;
        $('#room').val(plus);
        $('#total-room').text(plus);
     
      });
      $("#decrement-room").on("click", function () {
        var room = +$('#room').val();
        if(room > 0){
          var plus = room - 1 ;
          $('#room').val(plus);
          $('#total-room').text(plus);
        }
      });
     
    },

    // Toggle Function
    toggle: function () {
      if ($("#stream-player").length) {
        var myPlayer = Stream(document.getElementById('stream-player'));
        $(".videoplay").on("click", function () {
          $('.videoplayer').addClass('show')

          myPlayer.play().catch(() => {
            myPlayer.muted = false;
            myPlayer.startTime = 0;
            myPlayer.play();
          });
        });
        $(".close-videoPlayer").on("click", function () {
          $('.videoplayer').removeClass('show')
          myPlayer.play().catch(() => {
            myPlayer.muted = true;
            myPlayer.play();
          });
        });
      }

      $('.search-block').hover(function () {
        $(this).addClass('show')
      })
      $('.search-block').mouseleave(function () {
        $(this).removeClass('show')
      })
      $('.sub-menu').hover(function () {
        if ($('.link-has-children').hasClass('show')) {
          $('.link-has-children').removeClass('show');
        }
        $(this).parent('.link-has-children').addClass('show');
      })
      $('.link-has-children').mouseleave(function () {
        $(this).removeClass('show');
      })


    },
    // Slick Slider
    slick: function () {
      $('.slider').slick({
        autoplay: false,
        speed: 1000,
        customPaging: function (slider, i) {
          var thumb = $(slider.$slides[i]).data();
          return '<a class="dot h-18 bold white">' + (i + 1) + "/3" + '</a>';
        },
        lazyLoad: 'progressive',
        arrows: false,
        dots: true,
        responsive: [

          {
            breakpoint: 492,
            settings: {
              dots: false,
            },
          },
        ],
      }).slickAnimation();

      if ($(".amenities-slider").length) {
        $(".amenities-slider").slick({
          infinite: true,
          slidesToShow: 4,
          slidesToScroll: 1,
          arrows: false,
          centerMode: false,
          centerPadding: "0",
          autoplay: true,
          cssEase: "linear",
          autoplaySpeed: 0,
          speed: 8000,
          pauseOnFocus: false,
          pauseOnHover: false,
          responsive: [
            {
              breakpoint: 1025,
              settings: {
                slidesToShow: 3,
              },
            },
            {
              breakpoint: 492,
              settings: {
                slidesToShow: 3,
              },
            },
          ],
        });
      }

      $('.testimonial-slider').slick({
        autoplay: false,
        speed: 800,
        lazyLoad: 'progressive',
        arrows: true,
        infinite: false,
        dots: false,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
          {
            breakpoint: 1025,
            settings: {
              slidesToShow: 3,
            },
          },
          {
            breakpoint: 769,
            settings: {
              slidesToShow: 2,
            },
          },
          {
            breakpoint: 492,
            settings: {
              slidesToShow: 1,
            },
          },
        ],
      });

      $('.team-slider').slick({
        autoplay: false,
        speed: 800,
        lazyLoad: 'progressive',
        arrows: true,
        infinite: false,
        dots: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
          {
            breakpoint: 1025,
            settings: {
              slidesToShow: 3,
            },
          },
          {
            breakpoint: 769,
            settings: {
              slidesToShow: 2,
            },
          },
          {
            breakpoint: 492,
            settings: {
              slidesToShow: 1,
            },
          },
        ],
      });

      $('.room-slider').slick({
        autoplay: false,
        speed: 800,
        lazyLoad: 'progressive',
        arrows: true,
        infinite: false,
        dots: false,
      }).slickAnimation();

      $(".prev-btn").click(function () {
        var $this = $(this).attr("data-slide");
        $('.' + $this).slick("slickPrev");
      });

      $(".next-btn").click(function () {
        var $this = $(this).attr("data-slide");
        $('.' + $this).slick("slickNext");
      });

      $(".prev-btn").addClass("slick-disabled");

      $(".sliders").on("afterChange", function () {
        var $parent = $(this).attr("data-parent");
        if ($('.' + $parent).find(".slick-prev").hasClass("slick-disabled")) {
          $('.' + $parent).find(".prev-btn").addClass("slick-disabled");
        } else {
          $('.' + $parent).find(".prev-btn").removeClass("slick-disabled");
        }
        if ($('.' + $parent).find(".slick-next").hasClass("slick-disabled")) {
          $('.' + $parent).find(".next-btn").addClass("slick-disabled");
        } else {
          $('.' + $parent).find(".next-btn").removeClass("slick-disabled");
        }
      })

    },

    // Nice Select
    niceSelect: function () {
      if ($(".has-nice-select").length) {
        $('.has-nice-select, .contact-form select').niceSelect();
      }
    },

    // Countdown Timer
    countdownInit: function (countdownSelector, countdownTime, countdown) {
      var eventCounter = $(countdownSelector);
      if (eventCounter.length) {
        eventCounter.countdown(countdownTime, function (e) {
          $(this).html(
            e.strftime(
              '<li><h2>%D</h2><h6>Days</h6></li>\
              <li><h2>%H</h2><h6>Hrs</h6></li>\
              <li><h2>%M</h2><h6>Min</h6></li>\
              <li><h2>%S</h2><h6>Sec</h6></li>'
            )
          );
        });
      }
    },

    // Password Icon
    passwordIcon: function () {
      $('#eye').click(function () {
        if ($(this).hasClass('fa-eye-slash')) {
          $(this).removeClass('fa-eye-slash');
          $(this).addClass('fa-eye');
          $('#passWord').attr('type', 'text');

        } else {
          $(this).removeClass('fa-eye');
          $(this).addClass('fa-eye-slash');
          $('#passWord').attr('type', 'password');
        }
      });
    },

    // Sal Js
    salInit: function () {
      sal({
        threshold: 0.1,
        once: true,
      });
    },

    // Form Validation
    formValidation: function () {
      if ($(".form-validate").length) {
        $(".form-validate").validate();
      }
    },

    // Contact Form 
    contactForm: function () {
      $(".contact-form").on("submit", function (e) {
        e.preventDefault();
        if ($(".contact-form").valid()) {
          var _self = $(this);
          _self
            .closest("div")
            .find('button[type="submit"]')
            .attr("disabled", "disabled");
          var data = $(this).serialize();
          $.ajax({
            url: "./assets/mail/contact.php",
            type: "post",
            dataType: "json",
            data: data,
            success: function (data) {
              $(".contact-form").trigger("reset");
              _self.find('button[type="submit"]').removeAttr("disabled");
              if (data.success) {
                document.getElementById("message").innerHTML =
                  "<h3 class='color-primary mt-5'>Email Sent Successfully</h3>";
              } else {
                document.getElementById("message").innerHTML =
                  "<h3 class='color-primary mt-5'>There is an error</h3>";
              }
              $("#message").show("slow");
              $("#message").slideDown("slow");
              setTimeout(function () {
                $("#message").slideUp("hide");
                $("#message").hide("slow");
              }, 3000);
            },
          });
        } else {
          return false;
        }
      });
    },
    // Room Detail Gallery
    roomDetailGallery: function () {
      if ($('.gallery-detail').length) {
        // Thumbnail click functionality
        $('.gallery-detail .gallery-img').on('click', function () {
          var newSrc = $(this).find('img').attr('src');
          $('.gallery-detail .image-container img').attr('src', newSrc);
          
          // Update active state
          $('.gallery-detail .gallery-img').removeClass('active');
          $(this).addClass('active');
        });

        // Previous/Next arrow functionality
        $('.gallery-arrow.prev').on('click', function () {
          var currentActive = $('.gallery-detail .gallery-img.active');
          var prevImg = currentActive.prev('.gallery-img');
          
          if (prevImg.length === 0) {
            prevImg = $('.gallery-detail .gallery-img').last();
          }
          
          prevImg.trigger('click');
        });

        $('.gallery-arrow.next').on('click', function () {
          var currentActive = $('.gallery-detail .gallery-img.active');
          var nextImg = currentActive.next('.gallery-img');
          
          if (nextImg.length === 0) {
            nextImg = $('.gallery-detail .gallery-img').first();
          }
          
          nextImg.trigger('click');
        });

        // Set first image as active by default
        $('.gallery-detail .gallery-img').first().addClass('active');
      }
    },
  };

  Init.i();
})(window, document, jQuery);


// Mobile Sidebar

$(document).on('click', function (e) {
  if (!$(e.target).closest('.sidebar').length && !$(e.target).hasClass('btn')) {
    $('.sidebar').removeClass("show");
  }
});
$('.btn').click(function (e) {
  e.stopPropagation();
  $('.sidebar').toggleClass("show");
});

$('.menu-btn').click(function () {
  $(this).toggleClass("show");
  $(this).parents('li').find('.menu-item').animate({ height: 'toggle' });

});

$('nav ul li').click(function () {
  $(this).addClass("active").siblings().removeClass("active");
});

// ...existing code...
$(document).ready(function(){
    $('.gallery-slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true
    });
    $('.gallery-arrow.prev').click(function(){
        $('.gallery-slider').slick('slickPrev');
    });
    $('.gallery-arrow.next').click(function(){
        $('.gallery-slider').slick('slickNext');
    });
});
// ...existing code...

// Floating Action Button: first click expands, second click opens booking (new tab)
(function(){
  const fab = document.querySelector('.fab');
  if(!fab) return;
  const targetUrl = fab.dataset.href || '#';
  // Ensure keyboard accessible
  fab.setAttribute('tabindex', '0');

  let isOpen = false;
  let closeTimer = null;

  function openFab(){
    fab.classList.add('open');
    isOpen = true;
    if (closeTimer) clearTimeout(closeTimer);
    closeTimer = setTimeout(closeFab, 5000);
  }
  function closeFab(){
    fab.classList.remove('open');
    isOpen = false;
    if (closeTimer){ clearTimeout(closeTimer); closeTimer = null; }
  }

  function navigate(){
    // open in new tab like original link
    window.open(targetUrl, '_blank', 'noopener');
  }

  fab.addEventListener('click', function(e){
    e.preventDefault();
    if(!isOpen){
      openFab();
    } else {
      navigate();
    }
  });

  // keyboard support: Enter / Space
  fab.addEventListener('keydown', function(e){
    if(e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      if(!isOpen) openFab(); else navigate();
    } else if (e.key === 'Escape' && isOpen){
      closeFab();
    }
  });

  // close when clicking outside
  document.addEventListener('click', function(e){
    if(isOpen && !fab.contains(e.target)){
      closeFab();
    }
  });
})();