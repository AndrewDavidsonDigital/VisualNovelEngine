// eslint-disable-next-line no-undef
export function innerInteractionEvent(event: MouseEvent | KeyboardEvent){
  const bublealbeEvent = new CustomEvent("inner-click", event);
  document.dispatchEvent(bublealbeEvent);
}