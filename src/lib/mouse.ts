// eslint-disable-next-line no-undef
export function innerClickEvent(event: MouseEvent | KeyboardEvent){
  const bublealbeEvent = new CustomEvent("inner-click", event);
  document.dispatchEvent(bublealbeEvent);
}