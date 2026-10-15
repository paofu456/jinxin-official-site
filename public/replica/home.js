// @ts-nocheck
$(function(){
 var reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
 $('#fullpage').fullpage({anchors:['page1','page2','page3','page4','page5'],menu:'#page-control',scrollingSpeed:reduce.matches?0:700,afterLoad:function(anchor){$('.sec-hnews').toggleClass('on',anchor==='page5');if(anchor!=='page2'){var video=document.querySelector('.habout-video video');if(video)video.pause();}}});
 function sizeSlides(){$('#home-slider .slides li').height($(window).height());}
 sizeSlides();$(window).on('resize',sizeSlides);
 $('#home-slider').flexslider({animation:'slide',controlNav:true,directionNav:true,keyboard:false,animationSpeed:reduce.matches?0:600,slideshow:!reduce.matches});
 $('.flex-prev').attr('aria-label','上一张轮播图');$('.flex-next').attr('aria-label','下一张轮播图');
 $('.flex-control-paging a').each(function(i){$(this).attr('aria-label','查看第'+(i+1)+'张轮播图');});
 $('.vide-play a').on('click',function(e){e.preventDefault();var video=document.querySelector('.habout-video video');if(!video)return;video.hidden=false;$('.h-about-fig').addClass('on');video.play().catch(function(){});});
 if(!reduce.matches)$('.single-num').countUp();
});
