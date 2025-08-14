import { Component } from "../base.component";

class IfElement extends Component {
  onMount(): void {
    const condition$ = this.useProp<boolean>(
      "condition", 
      { required: true }
    );

    condition$.subscribe((visible: boolean) => {
      console.log(`Property 'condition' changed to: ${visible}`);
      this.#render(visible);
    });
  }

  #render(visible: boolean) {
    if (visible) {
      this.shadowRoot!.innerHTML = /* html */ `
        <slot></slot>
    `;
    } else {
      this.shadowRoot!.innerHTML = "";
    }
  }
}

customElements.define("x-if", IfElement);
