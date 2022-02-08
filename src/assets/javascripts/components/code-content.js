import { getScrollbarSize } from '../utils/scrollbar-size';

class codeContent {
  constructor($el) {
    this.$panel = $el;
    this.$panelCode = this.$panel.querySelector('code');
    this.$panelCollapseButton = this.$panel.querySelector('.variant__code-collapse-button');
    this.$panelCollapseButtonLabel = this.$panelCollapseButton.querySelector('.variant__code-collapse-button-label');

    this.panelMaxHeight = 200;
    this.scrollbarHeight = getScrollbarSize().height;

    this.observeCodePanelBinded = this.observeCodePanel.bind(this);
    this.panelToggleBinded = this.panelToggle.bind(this);

    this.initCodeContent();
  }

  initCodeContent() {
    // Setup MutationObserver to observe changes in Panels
    const mutationObserver = new MutationObserver(this.observeCodePanelBinded);
    mutationObserver.observe(this.$panel, { attributes: true });

    if (this.$panel.getAttribute('hidden') === null) {
      // We need to retrieve the element's height using a timeout to receive correct results
      setTimeout(() => {
        const panelCodeHeight = this.getElHeight(this.$panelCode);
        if (panelCodeHeight > this.panelMaxHeight) {
          this.panelCollapsible();
        }
      }, 100);
    }

    this.$panelCollapseButton.addEventListener('click', this.panelToggleBinded);
  }

  observeCodePanel(mutationsList) {
    mutationsList.forEach((mutation) => {
      if (mutation.attributeName === 'hidden') {
        const $panel = mutation.target;

        if ($panel.getAttribute('hidden') === null) {
          const panelCodeHeight = this.getElHeight($panel.querySelector('code'));
          if (panelCodeHeight > this.panelMaxHeight) {
            this.panelCollapsible();
          }
        }
      }
    });
  }

  panelCollapsible() {
    this.$panel.classList.add('js-variant-code--collapsible');
  }

  panelToggle() {
    this.$panel.classList.toggle('js-variant-code--expanded');
    const textClosed = this.$panelCollapseButton.dataset.textClosed;
    const textOpened = this.$panelCollapseButton.dataset.textOpened;

    if (this.$panel.classList.contains('js-variant-code--expanded')) {
      this.$panelCollapseButtonLabel.textContent = textOpened;
      this.$panelCollapseButton.setAttribute('style', `margin-bottom: ${this.scrollbarHeight}px;`);
    } else {
      this.$panelCollapseButtonLabel.textContent = textClosed;
      this.$panelCollapseButton.removeAttribute('style');
    }
  }

  getElHeight(e) {
    const $el = e;
    const rect = $el.getBoundingClientRect();

    return rect.height;
  }
}

document.querySelectorAll('.js-variant-code').forEach($el => new codeContent($el));
