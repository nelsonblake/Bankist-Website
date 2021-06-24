'use strict';
///////////////////////////////////////////////
// Elements
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const allSections = document.querySelectorAll('.section');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');
//only those images with data-src attribute
const imgTargets = document.querySelectorAll('img[data-src]');

const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
///////////////////////////////////////////////
// Modal window
function modalWindow() {
  const openModal = function (e) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
  };

  const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
  };

  btnsOpenModal.forEach(function (button) {
    button.addEventListener('click', openModal);
  });

  btnCloseModal.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}
modalWindow();
//////////////////////////////////////////////
// Button Scrolling
function buttonScroll() {
  btnScrollTo.addEventListener('click', function (e) {
    //getBoundingClientRect gives various attributes related to viewport
    const s1coords = section1.getBoundingClientRect();
    console.log(s1coords);

    // //target of e is btnScrollTo
    // console.log(e.target.getBoundingClientRect());
    // //current scroll
    // console.log('Current Scroll (x/y)', window.pageXOffset, window.pageYOffset);
    // //height and width of viewport
    // //excludes scroll bars
    // console.log(
    //   'height and width of viewport',
    //   document.documentElement.clientHeight,
    //   document.documentElement.clientWidth
    // );

    //Scrolling
    //just the coords doesnt work because these coords are relative to the viewport.
    //we want it to be document relative
    //so we need the window x and y offset added to these coords
    // window.scrollTo(
    //   s1coords.left + window.pageXOffset,
    //   s1coords.top + window.pageYOffset
    // );
    //scrollTo can actually do better by passing in an object with some behavior:
    // window.scrollTo({
    //   left: s1coords.left + window.pageXOffset,
    //   top: s1coords.top + window.pageYOffset,
    //   behavior: 'smooth',
    // });

    //above is still the "oldschool" way of doing it
    //There is a modern solution: WARNING only works in modern browsers
    section1.scrollIntoView({ behavior: 'smooth' });
  });
}
buttonScroll();
///////////////////////////////////////
// Page Navigation
function navigation() {
  //Very inefficient because you create a function for each link
  // document.querySelectorAll('.nav__link').forEach(function (el) {
  //   el.addEventListener('click', function (e) {
  //     //prevent default linking
  //     e.preventDefault();
  //     //get the href string, not the link itself
  //     const id = this.getAttribute('href');
  //     //use href as a selector to get the correct section
  //     const section = document.querySelector(id);
  //     //smooth scroll
  //     section.scrollIntoView({ behavior: 'smooth' });
  //   });
  // });
  //instead use event delegation/propogation

  //Event Delegation
  //1 Add event listener to common parent element
  //2 Determine what element originated the event
  document.querySelector('.nav__links').addEventListener('click', function (e) {
    //prevent default linking
    e.preventDefault();

    //Matching strategy
    //check if the target is a link
    if (e.target.classList.contains('nav__link')) {
      //get the targets href string, not the actual link
      const id = e.target.getAttribute('href');
      //smooth scroll to section
      document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }
  });
}
navigation();
//////////////////////////////////////////////////
//Tab Component
function tabComponent() {
  tabsContainer.addEventListener('click', function (e) {
    e.preventDefault();

    //Matching strategy
    //which button was clicked? use this when there are children that can be clicked
    const clicked = e.target.closest('.operations__tab');

    //Guard clause
    //if nothing is clicked then immediately return
    if (!clicked) return;

    //remove all active tabs
    tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
    //remove all content areas
    tabsContent.forEach(content =>
      content.classList.remove('operations__content--active')
    );

    //Activate tab
    clicked.classList.add('operations__tab--active');
    //Activate content area
    document
      //.querySelector(`.operations__content--${clicked.dataset.tab}`) //same as clicked.getAttribute('data-tab')
      .querySelector(
        `.operations__content--${clicked.getAttribute('data-tab')}`
      )
      .classList.add('operations__content--active');
  });
}
tabComponent();
////////////////////////////////////////////////////
// Menu Fade Animation
function menuFade() {
  //can only have one parameter(the event) if passing into Event Listener
  function handleHover(e) {
    //if this is a navlink
    if (e.target.classList.contains('nav__link')) {
      const link = e.target;
      //get all nav__link siblings
      const siblings = link.closest('nav').querySelectorAll('.nav__link');
      //get anything with 'img' class from nav
      const logo = link.closest('.nav').querySelector('img');

      //change opacity
      siblings.forEach(el => {
        //but not on the link we clicked
        if (el !== link) el.style.opacity = this;
      });
      logo.style.opacity = this;
    }
  }

  //cannot pass this function call into addEventListener because it expects a function not a regular value
  // which is what the functon returns
  // nav.addEventListener('mouseover', function (e) {
  //   handleHover(0.5);
  // });
  // nav.addEventListener('mouseout', function (e) {
  //   handleHover(1);
  // });

  //but we can BIND the function call
  //REMEMBER bind changes THIS
  nav.addEventListener('mouseover', handleHover.bind(0.5));
  nav.addEventListener('mouseout', handleHover.bind(1));

  // /////////////////////////////////////////////////////////////
  // // Sticky Navigation: Intersection Observer API
  // //gets called everytime root and target intersect
  // function obsCallback(entries, observer) {
  //   entries.forEach(entry => {
  //     console.log(entry);
  //   });
  // }

  // //section 1 is the target, the root is what we want to intersect with the target
  // //threshold is how much the intersecting ratio, or how much we want visible before callback
  // const obsOptions = {
  //   root: null,
  //   threshold: [0, 0.2],
  // };

  // const observer = new IntersectionObserver(obsCallback, obsOptions);
  // observer.observe(header);

  //get nav height dynamically
  const navHeight = nav.getBoundingClientRect().height;

  //dont need the observer parameter because we want this to happen any time they scroll here
  function stickyNav(entries) {
    //works for array or single entry
    const [entry] = entries;
    //if no longer intersecting header then add sticky to nav
    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
  }

  //oberserver setup
  const headerObserver = new IntersectionObserver(stickyNav, {
    //interested in whole viewport
    root: null,
    //we want something to happen when exatly NONE of the header is in view
    threshold: 0,
    //rootMargin applies a 90px box applied outside our target element
    rootMargin: `-${navHeight}px`,
  });
  headerObserver.observe(header);
}
menuFade();
////////////////////////////////////////////////////////
// Revealing Sections on Scroll
function revealSections() {
  //here we need observer parameter to unobserve once everything is revealed
  function revealSection(entries, observer) {
    const [entry] = entries;
    //guard clause only reveal section if youre intersecting
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    //stop observing once everything is revealed
    observer.unobserve(entry.target);
  }

  //observer setup
  const sectionObserver = new IntersectionObserver(revealSection, {
    //whole viewport
    root: null,
    //reveal when 15% into the section
    threshold: 0.15,
  });

  allSections.forEach(function (section) {
    //observe each section
    sectionObserver.observe(section);
    //hide all sections
    section.classList.add('section--hidden');
  });
}
revealSections();
////////////////////////////////////////////////////////////
// Lazy Loading Images
function lazyLoad() {
  //load image
  //need observer param to unobserve once everything is loaded
  function loadImg(entries, observer) {
    //works for array or var
    const [entry] = entries;

    //guard clause
    if (!entry.isIntersecting) return;

    //replace src with data-src
    entry.target.src = entry.target.dataset.src;
    //We wait for a load event, and only then to we remove the blur
    //we do this because on slow networks the low res image
    //would be shown until the load event is emitted
    //which doesnt happen until the slow network loads the high res image
    entry.target.addEventListener('load', function () {
      //remove blur class from css
      entry.target.classList.remove('lazy-img');
    });

    observer.unobserve(entry.target);
  }

  const imgObserver = new IntersectionObserver(loadImg, {
    //whole viewport
    root: null,
    //as soon as we intersect the image
    threshold: 0,
    rootMaring: '200px',
  });

  //observe each image
  imgTargets.forEach(img => imgObserver.observe(img));
}
lazyLoad();
//////////////////////////////////////////////////////////
// Slider Component
function slider() {
  let currentSlide = 0;
  const maxSlide = slides.length - 1;

  ////////////
  //Functions
  //insert HTML button class with index for slides
  function createDots() {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  }

  //acitvate the current dot and deactivate all others
  function activateDot(slide) {
    //deactivate all dots
    document.querySelectorAll('.dots__dot').forEach(dot => {
      dot.classList.remove('dots__dot--active');
      //set white dots back to grey
      dot.style.backgroundColor = '#888';
    });

    //Make active dots white on photos
    if (
      //check if the slide is NOT a testimonial
      !document
        .querySelector(`.slide--${Number(slide) + 1}`)
        .children[0].classList.contains('testimonial')
    ) {
      //change color to white if not testimonial
      document.querySelector(
        `.dots__dot[data-slide="${slide}"]`
      ).style.backgroundColor = '#fff';
    }

    //activate current slides dot
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  }

  //go to slide
  //set each slider to be side by side
  //currentSlide = 0: 100 * (0-0) = 0% => 0%, 100%, 200%, ...
  //currentSlide = 1: 100 * (0-1) = -100% => -100%, 0%, 100%, ...
  //currentSlide = 2: 100 * (0-2) = -200% => -200%, -100%, 0%, ...
  function goToSlide(slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  }

  //Go to next slide
  function nextSlide() {
    //when we reach the end of the slides, go back to first one
    if (currentSlide === maxSlide) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }

    activateDot(currentSlide);
    goToSlide(currentSlide);
  }

  function prevSlide() {
    //currentSlide = 1: -100%, 0 , ...
    //currentSlide = 2: -200%, -100%, ...
    //when we reach the beginning of the slides, go back to last one
    if (currentSlide === 0) {
      currentSlide = maxSlide;
    } else {
      currentSlide--;
    }

    activateDot(currentSlide);

    goToSlide(currentSlide);
  }

  //Init
  function init() {
    createDots();
    activateDot(0);
    goToSlide(0);
  }
  init();

  ///////////////////
  //Events

  //Right arrow click
  btnRight.addEventListener('click', nextSlide);
  //Left arrow click
  btnLeft.addEventListener('click', prevSlide);
  //Left or Right arrow press
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });

  //Dots
  dotContainer.addEventListener('click', function (e) {
    //if you click on a dot
    if (e.target.classList.contains('dots__dot')) {
      //get the slide data
      const slide = e.target.getAttribute('data-slide');
      //const slide = e.target.dataset.slide //same as above
      activateDot(slide);
      goToSlide(slide);
    }
  });
}

slider();
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
//Lecture

// ////////////////////////////////////////////
// //selecting elements
// //select entire webpage
// console.log(document.documentElement);

// console.log(document.head);
// console.log(document.body);

// //only need . selector for queries
// const header = document.querySelector('.header');
// const allSections = document.querySelectorAll('.section');
// console.log(allSections);

// document.getElementById('section--1');
// //HTMLCollections are updated automatically when the DOM changes
// const allBtns = document.getElementsByTagName('button');
// console.log(allBtns);

// document.getElementsByClassName('btn');

// ///////////////////////////////////////////////
// //creating and inserting elements
// // .insertAdjacentHTML()

// //creating an element with a message and button
// const message = document.createElement('div');
// //specify class
// message.classList.add('cookie-message');
// // message.textContent = 'We use cookies for improved functionality and analytics.';
// //create HTML string
// message.innerHTML =
//   'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
// //insert or move button to top of page
// //header.prepend(message);
// //to bottom of page
// header.append(message);

// //elements cannot be in two places at once

// //message before header
// //header.before(message);
// //message after header
// //header.after(message);

// ///////////////////////////////////////////////////
// //delete elements
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove();
//   });

// ///////////////////////////////////////////////////
// //Styles
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// //only works for styles we set ourself like backgroundColor
// console.log(message.style.height);
// console.log(message.style.backgroundColor);

// //we can still get styles
// console.log(getComputedStyle(message).color);
// console.log(getComputedStyle(message).height);

// //change height with the getComputedStyle
// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// ////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////
// //CSS variables can only be changed this way
// //documentElement is root
// document.documentElement.style.setProperty('--color-primary', 'orangered');

// //Attribues - in HTML they are blue
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src);
// console.log(logo.className);
// //if the we specify the property here then JavaScript will create it for us
// //but if it doesnt belong then it wont create a property on the object

// logo.alt = 'Beautiful minimalist logo';

// //non standard
// //designer is not a standard property for images
// console.log(logo.designer);

// //but we can still get them this way
// console.log(logo.getAttribute('designer'));
// //create and set an attribute for logo
// logo.setAttribute('company', 'Bankist');

// //absolute element
// console.log(logo.src);
// //relative element
// console.log(logo.getAttribute('src'));

// const link = document.querySelector('.nav__link--btn');
// //absolute
// console.log(link.href);
// //html reference
// console.log(link.getAttribute('href'));

// //Data Attributes
// //att that start with the word data and then - whatever we want
// //but rememeber to camelCase them here
// console.log(logo.dataset.versionNumber);

///////////////////////////////////////////////////////
//Classes
// logo.classList.add()
// logo.classList.remove()
// logo.classList.toggle()
// logo.classList.contains()

///////////////////////////////////////////////////////
// //Implement smooth scrolling
// const btnScrollTo = document.querySelector('.btn--scroll-to');
// //# for IDs
// const section1 = document.querySelector('#section--1');

// btnScrollTo.addEventListener('click', function (e) {
//   //getBoundingClientRect gives various attributes related to viewport
//   const s1coords = section1.getBoundingClientRect();
//   console.log(s1coords);

//   //target of e is btnScrollTo
//   console.log(e.target.getBoundingClientRect());
//   //current scroll
//   console.log('Current Scroll (x/y)', window.pageXOffset, window.pageYOffset);
//   //height and width of viewport
//   //excludes scroll bars
//   console.log(
//     'height and width of viewport',
//     document.documentElement.clientHeight,
//     document.documentElement.clientWidth
//   );

//   //Scrolling
//   //just the coords doesnt work because these coords are relative to the viewport.
//   //we want it to be document relative
//   //so we need the window x and y offset added to these coords
//   // window.scrollTo(
//   //   s1coords.left + window.pageXOffset,
//   //   s1coords.top + window.pageYOffset
//   // );
//   //scrollTo can actually do better by passing in an object with some behavior:
//   // window.scrollTo({
//   //   left: s1coords.left + window.pageXOffset,
//   //   top: s1coords.top + window.pageYOffset,
//   //   behavior: 'smooth',
//   // });

//   //above is still the "oldschool" way of doing it
//   //There is a modern solution: WARNING only works in modern browsers
//   section1.scrollIntoView({ behavior: 'smooth' });
// });

// ///////////////////////////////////////////////////
// //Events
// //You can do this in HTML too, but it is never used anymore. only for reference
// //Mouse enter
// const h1 = document.querySelector('h1');

// const alertH1 = e => {
//   alert('addEventListener: Great! You are reading the heading');
//   //remove after first listen
//   h1.removeEventListener('mouseenter', alertH1);
// };
// //event whenever the mouse enters a certain area
// h1.addEventListener('mouseenter', alertH1);

// //remove after a certain time
// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

//old school event listening
// h1.onmouseenter = function (e) {
//   alert('onmouseenter: Great! You are reading the heading');
// };

//when an event is heard on an a link, the signal is actually sent to the top of the DOM tree
//to the document and then travels down the DOM tree document>html>body>section>paragraph to the link/anchor
//This is called the CAPTURE phase.
//Then the event callback is called on the target which is the TARGET PHASE
//finally the call must travel or BUBBLE back up the DOM tree to the document
//events can be handled in the target and bubbling phase. This becomes really powerful
//This can also be summarized by saying: "events propogate"

// /////////////////////////////////////////////////////
// //Event Propogation
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// //Target is always the same. It is where the click happened
// //currentTarget is always where the event is attached and is equivalent to this.
// //callback is called for target and all parents
// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor(0, 255);
//   console.log('Link', e.target, e.currentTarget);

//   //Stop propogation - not good practice in general
//   //e.stopPropagation();
// });
// //callback called for all parents
// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor(0, 255);
//   console.log('Container', e.target, e.currentTarget);
// });
// //callback called for parent
// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor(0, 255);
//   console.log('Nav', e.target, e.currentTarget);
// });
// //addEventListener does NOT listen to the capture phase
// //as it is generally not useful
// //but you can still do it with a third parameter: true

// //////////////////////////////////////////////////////////////
// //DOM Traversing

// const h1 = document.querySelector('h1');

// //going down: selecting child elements
// //will select ALL highlight elements that are children of h1
// console.log(h1.querySelectorAll('.highlight'));
// //sometimes we only want direct children
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orangered';

// //going upwards: selecting parents
// //only direct parent
// console.log(h1.parentNode);
// console.log(h1.parentElement);
// //often we need a parent somewhere up the tree
// //querySelector finds children and closest finds parents
// h1.closest('.header').style.background = 'var(--gradient-secondary)'; //CSS attribute
// h1.closest('h1').style.background = 'var(--gradient-primary)'; //CSS attribute

// //going sideways: selecting siblings
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// //get all siblings
// console.log(h1.parentElement.children);
// //transform all but h1 for fun
// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) el.style.transform = 'scale(0.5)';
// });

// ///////////////////////////////////////////
// //DOM content load event
// //only waits for html and javascript to be loaded
// document.addEventListener('DOMContentLoaded', function (e) {
//   console.log('Parsed');
// });
// //script tag in HTML makes us not need to listen for this load event

// //'load' is only fired when everything is fully loaded

// //prompt user before they leave the page
// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   e.returnValue = '';
// });

//////////////////////////////////////////////////
// Efficient script loading
// End of Body Regular = finish parse html > fetch > execute
// Head Async = parse html + fetch > execute > finish parse
// Head Defer = finish parse html + fetch > execute

//Defer is the best
