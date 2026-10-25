document.addEventListener("DOMContentLoaded", function () {
  const article = document.querySelector(".page__content");
  if (!article) return;

  const footnoteContainer = article.querySelector(".footnotes");
  if (!footnoteContainer) return;

  const footnotes = Array.from(
    footnoteContainer.querySelectorAll("li[id^='fn:']")
  );

  if (!footnotes.length) return;

  const references = Array.from(
    article.querySelectorAll("a.footnote[href^='#fn:']")
  );

  if (!references.length) return;


  /*
   * ------------------------------------------------------------
   * Utility functions
   * ------------------------------------------------------------
   */

  function getFootnote(reference) {
    const href = reference.getAttribute("href");
    if (!href) return null;

    return article.querySelector(
      "#" + CSS.escape(href.substring(1))
    );
  }


  function getReferenceNumber(reference) {
    return reference.textContent.trim();
  }


  function getReferenceParagraph(reference) {
    return reference.closest(
      "p, li, blockquote, figcaption, td, th"
    );
  }


  function createFootnoteContent(footnote, reference) {
    const wrapper = document.createElement("div");
    wrapper.className = "footnote-content";

    const number = document.createElement("span");
    number.className = "footnote-number";
    number.textContent = getReferenceNumber(reference);

    const content = document.createElement("div");
    content.className = "footnote-text";

    const clone = footnote.cloneNode(true);

    clone.removeAttribute("id");

    clone
      .querySelectorAll(".reversefootnote")
      .forEach(function (link) {
        link.remove();
      });

    while (clone.firstChild) {
      content.appendChild(clone.firstChild);
    }

    const details = document.createElement("details");
    details.className = "footnote-disclosure";
    const summary = document.createElement("summary");
    const label = document.createElement("span");
    label.className = "footnote-label";
    label.textContent = footnote.dataset.noteLabel ||
      footnote.querySelector("[data-note-label]")?.dataset.noteLabel ||
      (footnote.querySelector("em")?.textContent || content.textContent.trim().split(/[.!?]/)[0]).slice(0, 72);
    summary.appendChild(number);
    summary.appendChild(label);
    details.appendChild(summary);
    details.appendChild(content);
    details.open = false;
    details.addEventListener("toggle", function () {
      window.requestAnimationFrame(updateDesktopFootnotes);
    });
    wrapper.appendChild(details);

    return wrapper;
  }


  /*
   * ------------------------------------------------------------
   * Desktop sidebar
   * ------------------------------------------------------------
   */

  const sidebar = document.createElement("aside");

  sidebar.className = "footnote-sidebar";
  sidebar.setAttribute("aria-label", "Footnotes");

  document.body.appendChild(sidebar);


  /*
   * Each entry contains:
   *
   *   reference
   *   element
   *   desiredTop
   *   height
   *   state
   *
   * State is either:
   *
   *   "visible"
   *   "fading"
   */
  const desktopNotes = new Map();


  function createDesktopFootnote(reference) {
    const footnote = getFootnote(reference);

    if (!footnote) return null;

    const element = document.createElement("div");

    element.className = "footnote-sidebar__item";

    element.appendChild(
      createFootnoteContent(
        footnote,
        reference
      )
    );

    return element;
  }


  /*
   * Begin fading out a desktop note.
   *
   * We do NOT use setTimeout here. Instead, we wait for the
   * browser's actual CSS transitionend event.
   */
  function fadeOutDesktopNote(reference, item) {

    /*
     * If it is already fading, there is nothing to do.
     */
    if (item.state === "fading") {
      return;
    }

    item.state = "fading";

    const element = item.element;

    /*
     * Remove the visible class.
     */
    element.classList.remove("is-visible");


    /*
     * Remove the element when the opacity transition actually
     * finishes.
     */
    function removeAfterTransition(event) {

      if (event.propertyName !== "opacity") {
        return;
      }

      element.removeEventListener(
        "transitionend",
        removeAfterTransition
      );


      /*
       * Make absolutely sure this is still the same note
       * represented by this Map entry.
       */
      const current = desktopNotes.get(reference);

      if (
        current &&
        current.element === element &&
        current.state === "fading"
      ) {
        element.remove();

        desktopNotes.delete(reference);
      }
    }

    element.addEventListener(
      "transitionend",
      removeAfterTransition
    );


    /*
     * Fallback for browsers where transitionend isn't fired
     * (for example if the element becomes display:none).
     *
     * This timeout is deliberately longer than the CSS
     * transition and is only a safety net.
     */
    item.removeTimer = window.setTimeout(
      function () {

        const current =
          desktopNotes.get(reference);

        if (
          current &&
          current.element === element &&
          current.state === "fading"
        ) {
          element.remove();

          desktopNotes.delete(reference);
        }

      },
      1000
    );
  }


  /*
   * Cancel a pending fade-out if a footnote becomes visible
   * again.
   */
  function restoreDesktopNote(reference, item) {

    if (item.removeTimer) {
      window.clearTimeout(
        item.removeTimer
      );

      item.removeTimer = null;
    }

    /*
     * If the note was fading, cancel that state.
     */
    if (item.state === "fading") {
      item.state = "visible";

      item.element.classList.add(
        "is-visible"
      );
    }
  }


  /*
   * Update the desktop footnotes.
   */
  function updateDesktopFootnotes() {
    // Follow the reading column, regardless of sidebar or viewport layout.
    if (window.innerWidth >= 1200) {
      const articleRight = article.getBoundingClientRect().right;
      const noteLeft = articleRight + 32;
      sidebar.style.left = noteLeft + "px";
      sidebar.style.width = Math.max(0, Math.min(280, window.innerWidth - noteLeft - 24)) + "px";
      sidebar.style.maxWidth = "none";
    }


    /*
     * Don't run desktop behavior on mobile.
     */
    if (window.innerWidth < 1200) {

      sidebar.classList.remove(
        "is-visible"
      );

      desktopNotes.forEach(
        function (item) {
          fadeOutDesktopNote(
            item.reference,
            item
          );
        }
      );

      return;
    }


    /*
     * ----------------------------------------------------------
     * Determine visible references
     * ----------------------------------------------------------
     */

    const visibleReferences = [];

    references.forEach(
      function (reference) {

        const rect =
          reference.getBoundingClientRect();

        if (
          rect.bottom >= 0 &&
          rect.top <= window.innerHeight
        ) {
          visibleReferences.push({
            reference: reference,
            rect: rect
          });
        }
      }
    );


    const visibleKeys = new Set();


    /*
     * ----------------------------------------------------------
     * Create / restore visible notes
     * ----------------------------------------------------------
     */

    visibleReferences.forEach(
      function (entry) {

        const reference =
          entry.reference;

        visibleKeys.add(reference);


        /*
         * Create the note if it doesn't already exist.
         */
        if (!desktopNotes.has(reference)) {

          const element =
            createDesktopFootnote(
              reference
            );

          if (!element) return;


          const item = {
            reference: reference,
            element: element,

            desiredTop:
              entry.rect.top +
              entry.rect.height / 2,

            height: 0,

            state: "visible",

            removeTimer: null
          };


          sidebar.appendChild(
            element
          );

          desktopNotes.set(
            reference,
            item
          );


          /*
           * Force the browser to register opacity: 0 before
           * adding the visible class.
           */
          element.offsetHeight;


          requestAnimationFrame(
            function () {

              /*
               * The note may have become irrelevant before
               * this animation frame executes.
               */
              if (
                desktopNotes.get(
                  reference
                ) !== item
              ) {
                return;
              }

              element.classList.add(
                "is-visible"
              );
            }
          );

        } else {

          /*
           * The note already exists.
           */
          const item =
            desktopNotes.get(
              reference
            );


          /*
           * If it was fading out, bring it back.
           */
          restoreDesktopNote(
            reference,
            item
          );


          /*
           * Update its desired vertical position.
           */
          item.desiredTop =
            entry.rect.top +
            entry.rect.height / 2;
        }
      }
    );


    /*
     * ----------------------------------------------------------
     * Fade out notes that are no longer visible
     * ----------------------------------------------------------
     */

    desktopNotes.forEach(
      function (item, reference) {

        if (
          !visibleKeys.has(reference)
        ) {
          fadeOutDesktopNote(
            reference,
            item
          );
        }
      }
    );


    /*
     * ----------------------------------------------------------
     * Position visible notes
     * ----------------------------------------------------------
     */

    const items = [];


    desktopNotes.forEach(
      function (item, reference) {

        /*
         * Only position notes that are currently visible.
         */
        if (
          !visibleKeys.has(reference)
        ) {
          return;
        }


        item.height =
          item.element.offsetHeight;

        items.push(item);
      }
    );


    /*
     * Sort notes vertically according to the position of
     * their references.
     */
    items.sort(
      function (a, b) {
        return (
          a.desiredTop -
          b.desiredTop
        );
      }
    );


    const gap = 24;
    const margin = 16;

    let previousBottom = margin;


    items.forEach(
      function (item) {

        const summary = item.element.querySelector("summary");
        const summaryOffset = summary
          ? summary.getBoundingClientRect().top - item.element.getBoundingClientRect().top + summary.offsetHeight / 2
          : item.height / 2;
        let top = item.desiredTop - summaryOffset;


        /*
         * Keep the note inside the viewport.
         */
        top = Math.max(
          top,
          margin
        );


        /*
         * Prevent overlapping notes.
         */
        if (
          top <
          previousBottom + gap
        ) {
          top =
            previousBottom +
            gap;
        }


        /*
         * Don't let the bottom of the note leave
         * the viewport.
         */
        const maximumTop =
          window.innerHeight -
          item.height -
          margin;


        top = Math.min(
          top,
          maximumTop
        );


        item.element.style.top =
          top + "px";


        previousBottom =
          top + item.height;
      }
    );


    /*
     * The sidebar itself remains visible as long as at least
     * one note is either visible or fading out.
     */
    if (desktopNotes.size > 0) {
      sidebar.classList.add(
        "is-visible"
      );
    } else {
      sidebar.classList.remove(
        "is-visible"
      );
    }
  }


  /*
   * ------------------------------------------------------------
   * Mobile inline footnotes
   * ------------------------------------------------------------
   */

  function openMobileFootnote(reference) {

    const paragraph =
      getReferenceParagraph(
        reference
      );

    const footnote =
      getFootnote(reference);

    if (
      !paragraph ||
      !footnote
    ) {
      return;
    }


    const existing =
      paragraph.nextElementSibling;


    /*
     * Tapping an already-open reference closes it.
     */
    if (
      existing &&
      existing.classList.contains(
        "mobile-footnote"
      )
    ) {

      existing.remove();

      reference.setAttribute(
        "aria-expanded",
        "false"
      );

      return;
    }


    /*
     * Close any other open mobile footnotes.
     */
    article
      .querySelectorAll(
        ".mobile-footnote"
      )
      .forEach(
        function (note) {
          note.remove();
        }
      );


    article
      .querySelectorAll(
        "a.footnote[aria-expanded='true']"
      )
      .forEach(
        function (link) {

          link.setAttribute(
            "aria-expanded",
            "false"
          );
        }
      );


    /*
     * Create the inline footnote.
     */
    const note =
      document.createElement(
        "aside"
      );

    note.className =
      "mobile-footnote";


    note.appendChild(
      createFootnoteContent(
        footnote,
        reference
      )
    );


    /*
     * Insert immediately after the paragraph.
     */
    paragraph.insertAdjacentElement(
      "afterend",
      note
    );


    reference.setAttribute(
      "aria-expanded",
      "true"
    );
  }


  /*
   * ------------------------------------------------------------
   * Reference events
   * ------------------------------------------------------------
   */

  references.forEach(
    function (reference) {

      reference.setAttribute(
        "aria-expanded",
        "false"
      );


      reference.addEventListener(
        "click",
        function (event) {

          event.preventDefault();


          if (
            window.innerWidth < 1200
          ) {

            openMobileFootnote(
              reference
            );

          } else {

            updateDesktopFootnotes();
          }
        }
      );


      reference.addEventListener(
        "focus",
        function () {

          if (
            window.innerWidth >= 1200
          ) {

            updateDesktopFootnotes();
          }
        }
      );
    }
  );


  /*
   * ------------------------------------------------------------
   * Scrolling
   * ------------------------------------------------------------
   */

  let ticking = false;


  function onScroll() {

    if (ticking) {
      return;
    }


    ticking = true;


    window.requestAnimationFrame(
      function () {

        updateDesktopFootnotes();

        ticking = false;
      }
    );
  }


  window.addEventListener(
    "scroll",
    onScroll,
    {
      passive: true
    }
  );


  /*
   * ------------------------------------------------------------
   * Resizing
   * ------------------------------------------------------------
   */

  window.addEventListener(
    "resize",
    function () {

      if (
        window.innerWidth >= 1200
      ) {

        /*
         * Remove any mobile notes.
         */
        article
          .querySelectorAll(
            ".mobile-footnote"
          )
          .forEach(
            function (note) {
              note.remove();
            }
          );


        article
          .querySelectorAll(
            "a.footnote"
          )
          .forEach(
            function (link) {

              link.setAttribute(
                "aria-expanded",
                "false"
              );
            }
          );


        updateDesktopFootnotes();

      } else {

        /*
         * Hide the desktop sidebar.
         *
         * The notes themselves are allowed to fade out.
         */
        sidebar.classList.remove(
          "is-visible"
        );

        desktopNotes.forEach(
          function (item) {

            fadeOutDesktopNote(
              item.reference,
              item
            );
          }
        );
      }
    }
  );


  /*
   * ------------------------------------------------------------
   * Initial state
   * ------------------------------------------------------------
   */

  updateDesktopFootnotes();
});